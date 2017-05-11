/* eslint-disable no-console,max-len */
import 'babel-polyfill'
import 'isomorphic-fetch'
import Immutable from 'immutable'
import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { renderStaticOptimized } from 'glamor-server'
import React from 'react'
import Helmet from 'react-helmet'
import Honeybadger from 'honeybadger'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import './vendor/glamor-pxtorem'
import { EDITORIALS, POSTS } from './constants/mapping_types'
import { createServerStore } from './store'
import { selectViewNameFromRoute } from './selectors/routing'
import createRoutes from './routes'
import { serverRoot } from './sagas'
import { runningServerFetches } from './sagas/requester'

const indexStr = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8')

// Return promises for initial loads
function preRenderComponents(renderProps, store, sagaTask, startTime, requestId) {
  const promises = renderProps.components.map(component => ((component && component.preRender) ? component.preRender(store, renderProps) : null)).filter(component => !!component)
  return Promise.all(promises).then(() => {
    console.log(`[${requestId}][prerender] component promises resolved in ${new Date() - startTime}ms, closing store`)
    store.close()
    return sagaTask.done
  })
}

const createSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS
  return (state) => {
    const routingState = state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

function getPostTrackingMetadata(url, state, renderProps) {
  let postIds = []
  let postTokens = []
  let streamKind = null
  let streamId = null

  let result = state.json.getIn(['pages', url], Immutable.Map())
  if (result.get('type') === POSTS || result.get('type') === EDITORIALS) {
    postIds = result.get('ids', Immutable.List()).toArray()
  } else if (renderProps.params.token) {
    postTokens = [renderProps.params.token]
  }

  switch (selectViewNameFromRoute(state, renderProps)) {
    case 'editorial':
      streamKind = 'editorial'
      break
    case 'search':
      streamKind = 'search'
      result = state.json.getIn(['pages', '/search/posts'], Immutable.Map())
      postIds = result.get('ids', Immutable.List()).toArray()
      break
    case 'discover':
      if (['trending', 'recent', 'featured', 'recommended', 'all', undefined].includes(renderProps.params.type)) {
        streamKind = renderProps.params.type || 'featured'
      } else {
        streamKind = 'category'
        const category = state.json.get('categories').find(cat => cat.get('slug') === renderProps.params.type)
        if (category) {
          streamId = category.get('id')
        }
      }
      break
    case 'postDetail':
      streamKind = 'post'
      streamId = state.json.get('posts').find(post => post.get('token') === renderProps.params.token).get('id')
      break
    case 'userDetail': {
      if (renderProps.params.type === 'loves') {
        streamKind = 'love'
      } else {
        streamKind = 'user'
      }
      const userForDetail = state.json.get('users', Immutable.List())
        .find(user => user.get('username') === renderProps.params.username)
      if (userForDetail) {
        streamId = userForDetail.get('id')
      }
      break
    }
    // no default
  }

  return { postIds, postTokens, streamKind, streamId }
}

function prerender(context) {
  const promise = new Promise((resolve, reject) => {
    const { accessToken,
            expiresAt,
            originalUrl,
            url,
            timingHeader,
            requestId } = context
    const startTime = new Date()
    Honeybadger.setContext(context)

    console.log(`[${requestId}][prerender] Rendering ${url}`)

    const memoryHistory = createMemoryHistory(originalUrl)
    const store = createServerStore(memoryHistory, {
      authentication: Immutable.Map({
        accessToken,
        expirationDate: new Date(expiresAt),
        isLoggedIn: false,
      }),
    })
    const isServer = true
    const routes = createRoutes(store, isServer)
    const history = syncHistoryWithStore(memoryHistory, store, {
      selectLocationState: createSelectLocationState(),
    })
    const sagaTask = store.runSaga(serverRoot)

    match({ history, routes, location: url }, (error, redirectLocation, renderProps) => {
      // populate the router store object for initial render
      if (error) {
        console.log(`[${requestId}][prerender] MATCH ERROR`, error)
        // TODO: Should we abort here?
      } else if (redirectLocation) {
        console.log(`[${requestId}][prerender] Rendering redirect to ${redirectLocation.pathname}`)
        resolve({ type: 'redirect', location: redirectLocation.pathname })
        return
      } else if (!renderProps) {
        console.log(`[${requestId}][prerender] NO RENDER PROPS`)
        reject()
        return
      }

      const InitialComponent = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      preRenderComponents(renderProps, store, sagaTask, startTime, requestId).then(() => {
        console.log(`[${requestId}][prerender] Saga task complete after ${new Date() - startTime}ms, finalizing markup`)
        const componentHTML = renderToString(InitialComponent)
        const head = Helmet.rewind()
        const { css, ids } = renderStaticOptimized(() => componentHTML)
        const state = store.getState()

        // Store post IDs for later tracking
        const { postIds, postTokens, streamKind, streamId } = getPostTrackingMetadata(url, state, renderProps)
        console.log('Recording post metadata for later tracking', url, postIds, postTokens, streamKind, streamId)

        if (state.stream.get('should404') === true) {
          console.log(`[${requestId}][prerender] Rendering 404 (total ${new Date() - startTime}ms)`)
          resolve({ type: '404' })
        } else {
          Object.keys(state).forEach((key) => {
            state[key] = state[key].toJS()
          })
          const initialStateTag = `<script id="initial-state">window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`
          const initialGlamTag = `<script id="glam-state">window.__GLAM__ = ${JSON.stringify(ids)}</script>`
          const initialIsoFetchesTag = `<script id="running-server-fetches">window.__ISO_FETCHES__ = ${JSON.stringify(runningServerFetches)}</script>`
          // Add helmet's stuff after the last statically rendered meta tag
          const [headTag, bodyTag] = indexStr.split('</head>')
          const htmlWithoutRoot = `${headTag}${head.title.toString()} ${head.meta.toString()} ${head.link.toString()} ${timingHeader} <style>${css}</style></head>${bodyTag}`

          // Splice in the body
          const [preRoot, postRoot] = htmlWithoutRoot.split('<div id="root"></div>')
          const html = `${preRoot}<div id="root">${componentHTML}</div>${initialStateTag} ${initialGlamTag} ${initialIsoFetchesTag}${postRoot}`
          console.log(`[${requestId}][prerender] Rendering 200 (total ${new Date() - startTime}ms)`)
          resolve({ type: 'render', body: html, postIds, postTokens, streamKind, streamId })
        }
      }).catch((err) => {
        console.log(`[${requestId}][prerender] Caught error (total ${new Date() - startTime}ms)`, err)
        Honeybadger.notify(err);
        resolve({ type: 'error' })
      })
      renderToString(InitialComponent)
    })
  })
  return promise
}

export default prerender
