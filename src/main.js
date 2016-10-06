import 'babel-polyfill'
import 'isomorphic-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyRouterMiddleware, browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import useScroll from 'react-router-scroll/lib/useScroll'
import { persistStore, storages } from 'redux-persist'

// import './main.sass'
import './main.css'
import { addFeatureDetection, isIOS } from './lib/jello'
import MemoryStore from './lib/memory_store'
import Session from './lib/session'
import { updateStrings as updateTimeAgoStrings } from './lib/time_ago_in_words'
import store from './store'
import createRoutes from './routes'
import Honeybadger from './vendor/honeybadger'
import './vendor/embetter'
import './vendor/embetter_initializer'

/* eslint-disable global-require */
// only use fastclick if we are on iOS
if (isIOS()) {
  require('react-fastclick')
}
/* eslint-enable global-require */

function shouldScroll(prevRouterProps, { location }) {
  const notificationScrollY = Session.getItem(`${location.pathname}/scrollY`)
  if (/\/notifications\b/.test(location.pathname) && notificationScrollY) {
    return [0, notificationScrollY]
  }
  return location.action !== 'REPLACE'
}

// ONLY FOR PERFORMANCE TESTING!
// if (process.env.NODE_ENV !== 'production') {
//   const { Perf } = require('react-addons-perf')
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   window.Perf = Perf
//   whyDidYouUpdate(React)
// }

Honeybadger.configure({
  api_key: ENV.HONEYBADGER_API_KEY,
  environment: ENV.HONEYBADGER_ENVIRONMENT,
})

updateTimeAgoStrings({ about: '' })

const APP_VERSION = '3.0.21'

const history = syncHistoryWithStore(browserHistory, store)
// const history = syncHistoryWithStore(browserHistory, store, {
//   selectLocationState(state) {
//     return state.get('routing').toJS()
//   },
// })
const routes = createRoutes(store)
const element = (
  <Provider store={store}>
    <Router
      history={history}
      render={applyRouterMiddleware(useScroll(shouldScroll))}
      routes={routes}
    />
  </Provider>
)

const whitelist = ['authentication', 'editor', 'gui', 'json', 'profile']

const launchApplication = (storage, hasLocalStorage = false) => {
  addFeatureDetection()
  const persistor = persistStore(store, { storage, whitelist }, () => {
    const root = document.getElementById('root')
    ReactDOM.render(element, root)
  })

  // check and update current version and only kill off the persisted reducers
  // due to the async nature of the default storage we need to check against the
  // real localStorage to determine if we should purge to avoid a weird race condition
  if (hasLocalStorage) {
    if (localStorage.getItem('APP_VERSION') !== APP_VERSION) {
      persistor.purge(['json'])
      Session.clear()
      storage.setItem('APP_VERSION', APP_VERSION, () => {})
    }
  } else {
    storage.getItem('APP_VERSION', (error, result) => {
      if (result && result !== APP_VERSION) {
        persistor.purge(['json'])
        Session.clear()
        storage.setItem('APP_VERSION', APP_VERSION, () => {})
      }
    })
  }
}

// this will fail in a safari private window
function isLocalStorageSupported() {
  if (typeof window === 'undefined') { return false }
  const testKey = 'test-localStorage'
  const storage = window.localStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

if (isLocalStorageSupported()) {
  // use localStorage as indexedDB seems to
  // have issues in chrome and firefox private
  launchApplication(storages.asyncLocalStorage, true)
} else {
  // localStorage fails, use an in-memory store
  launchApplication(MemoryStore)
}

