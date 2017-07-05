/* eslint-disable no-underscore-dangle */
import { createLogger } from 'redux-logger'
import Immutable from 'immutable'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { compose, combineReducers, createStore, applyMiddleware } from 'redux'
import { autoRehydrate } from 'redux-persist'
import createSagaMiddleware, { END } from 'redux-saga'
import { fromJSON } from 'transit-immutable-js'
import { rehydrate } from 'glamor'
import * as reducers from 'ello-brains/reducers'
import rootSaga from './sagas'

const reducer = combineReducers({ ...reducers })

// Always take the reducedState from rehydrate since the inboundState
// seems to be a subset of what is actually returned from the rehydrate action
const stateReconciler = (state, inboundState, reducedState) => ({ ...reducedState })

const createBrowserStore = (history, passedInitialState = {}) => {
  const logConfig = {
    collapsed: true,
    predicate: () => ENV.APP_DEBUG,
  }
  if (ENV.NODE_ENV === 'development') {
    logConfig.stateTransformer = (state) => {
      const newState = {}
      Object.keys(state).forEach((key) => {
        newState[key] = state[key].toJS()
      })
      return newState
    }
  }
  if (ENV.APP_DEBUG) {
    window.Pam = r => fromJSON(JSON.parse(localStorage.getItem(`reduxPersist:${r}`))).toJS()
  }
  const logger = createLogger(logConfig)
  const reduxRouterMiddleware = routerMiddleware(history)
  const sagaMiddleware = createSagaMiddleware()
  const serverInitState = window.__INITIAL_STATE__
  if (serverInitState) {
    Object.keys(serverInitState).forEach((key) => {
      serverInitState[key] = Immutable.fromJS(serverInitState[key])
    })
  }
  const initialState = serverInitState || passedInitialState
  // react-router-redux doesn't know how to serialize
  // query params from server-side rendering, so we just kill it
  // and let the browser reconstruct the router state
  initialState.routing = Immutable.Map()

  if (window.__GLAM__) { rehydrate(window.__GLAM__) }

  const store = compose(
    autoRehydrate({ stateReconciler }),
    applyMiddleware(
      sagaMiddleware,
      reduxRouterMiddleware,
      logger,
    ),
  )(createStore)(reducer, initialState)
  store.close = () => store.dispatch(END)

  store.sagaTask = sagaMiddleware.run(rootSaga)
  return store
}

const createServerStore = (history, initialState = {}) => {
  const reduxRouterMiddleware = routerMiddleware(history)
  const sagaMiddleware = createSagaMiddleware()
  const logger = createLogger({ collapsed: true, predicate: () => ENV.APP_DEBUG, colors: false })
  const store = compose(
    applyMiddleware(sagaMiddleware, reduxRouterMiddleware, logger),
  )(createStore)(reducer, initialState)

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}

const createElloStore = (history, initialState = {}) => {
  if (typeof window !== 'undefined') return createBrowserStore(browserHistory, initialState)
  return createServerStore(history, initialState)
}

export { createElloStore, createServerStore }

export default createElloStore()

