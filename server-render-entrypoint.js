import 'babel-polyfill'
import 'isomorphic-fetch'
import Immutable from 'immutable'
import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import React from 'react'
import Helmet from 'react-helmet'
import Honeybadger from 'honeybadger'
import newrelic from 'newrelic'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { updateStrings as updateTimeAgoStrings } from './src/lib/time_ago_in_words'
import { createElloStore } from './src/store'
import createRoutes from './src/routes'
import { serverRoot } from './src/sagas'

const indexStr = fs.readFileSync(path.join(__dirname, './public/index.html'), 'utf-8')

// Return promises for initial loads
function preRender(renderProps, store, sagaTask) {
  const promises = renderProps.components.map(component => ((component && component.preRender) ? component.preRender(store, renderProps) : null)).filter(component => !!component)
  return Promise.all(promises).then(() => {
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

function handlePrerender(context) {
  const { access_token, originalUrl, url } = context

  console.log(`Spun up child process ${process.pid} to render ${url} isomorphically`)

  newrelic.createBackgroundTransaction('render', () => {
    const memoryHistory = createMemoryHistory(originalUrl)
    const store = createElloStore(memoryHistory, {
      authentication: Immutable.Map({
        accessToken: access_token,
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
        console.log('ELLO MATCH ERROR', error)
      } else if (redirectLocation) {
        console.log('ELLO HANDLE REDIRECT', redirectLocation)
        newrelic.endTransaction()
        process.send({ type: 'redirect', location: redirectLocation.pathname }, null, {}, () => {
          process.exit(0)
        })
      } else if (!renderProps) {
        console.log('NO RENDER PROPS')
        newrelic.endTransaction()
        process.exit(1)
        return
      }

      const InitialComponent = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      )

      preRender(renderProps, store, sagaTask).then(() => {
        const componentHTML = renderToString(InitialComponent)
        const head = Helmet.rewind()
        const state = store.getState()
        if (state.stream.get('should404') === true) {
          newrelic.endTransaction()
          process.send({ type: '404' }, null, {}, () => {
            process.exit(1)
          })
        } else {
          Object.keys(state).forEach((key) => {
            state[key] = state[key].toJS()
          })
          const initialStateTag = `<script id="initial-state">window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`
          // Add helmet's stuff after the last statically rendered meta tag
          const html = indexStr.replace(
            'rel="copyright">',
            `rel="copyright">${head.title.toString()} ${head.meta.toString()} ${head.link.toString()}`,
          ).replace('<div id="root"></div>', `<div id="root">${componentHTML}</div>${initialStateTag}`)
          newrelic.endTransaction()
          process.send({ type: 'render', body: html }, null, {}, () => {
            process.exit(0)
          })
        }
      }).catch((err) => {
        // this will give you a js error like:
        // `window is not defined`
        console.log('ELLO CATCH ERROR', err)
        Honeybadger.notify(err)
        newrelic.endTransaction()
        process.send({ type: 'error' }, null, {}, () => {
          process.exit(1)
        })
      })
      renderToString(InitialComponent)
    })
  })
}

process.on('message', handlePrerender)

export default handlePrerender
