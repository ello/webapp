/* eslint-disable no-underscore-dangle */
import createLogger from 'redux-logger'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { combineReducers, compose, createStore, applyMiddleware } from 'redux'
// import { combineReducers } from 'redux-immutable'
import { autoRehydrate } from 'redux-persist'
// import { fromJS } from 'immutable'
import createSagaMiddleware, { END } from 'redux-saga'
import * as reducers from './reducers'
import rootSaga from './sagas'

const reducer = combineReducers({
  ...reducers,
})

const createBrowserStore = (history, passedInitialState = {}) => {
  const logger = createLogger({ collapsed: true, predicate: () => ENV.APP_DEBUG })
  const reduxRouterMiddleware = routerMiddleware(history)
  const sagaMiddleware = createSagaMiddleware()
  const initialState = window.__INITIAL_STATE__ || passedInitialState
  // react-router-redux doesn't know how to serialize
  // query params from server-side rendering, so we just kill it
  // and let the browser reconstruct the router state
  initialState.routing = {}

  const store = compose(
    autoRehydrate(),
    applyMiddleware(
      sagaMiddleware,
      reduxRouterMiddleware,
      logger
    ),
  )(createStore)(reducer, initialState)
  // )(createStore)(reducer, fromJS(initialState))
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
  // )(createStore)(reducer, fromJS(initialState))

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}

const createElloStore = (history, initialState = {}) => {
  if (typeof window !== 'undefined') return createBrowserStore(browserHistory, initialState)
  return createServerStore(history, initialState)
  // return createServerStore(history, fromJS(initialState))
}

export { createElloStore }

export default createElloStore()
