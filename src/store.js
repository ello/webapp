/* eslint-disable no-underscore-dangle */
import createLogger from 'redux-logger'
import Immutable from 'immutable'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { compose, combineReducers, createStore, applyMiddleware } from 'redux'
import { autoRehydrate } from 'redux-persist'
import createSagaMiddleware, { END } from 'redux-saga'
import * as reducers from './reducers'
import rootSaga from './sagas'

const reducer = combineReducers({
  ...reducers,
})

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

  const store = compose(
    autoRehydrate(),
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
  const logger = createLogger({ collapsed: true, predicate: () => ENV.APP_DEBUG })
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

export { createElloStore }

export default createElloStore()
