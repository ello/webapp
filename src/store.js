/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
import createLogger from 'redux-logger'
import Immutable from 'immutable'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'
import { autoRehydrate } from 'redux-persist'
import createSagaMiddleware, { END } from 'redux-saga'
import * as reducers from './reducers'
import rootSaga from './sagas'

const reducer = combineReducers({
  ...reducers,
})

const createBrowserStore = (history, passedInitialState = {}) => {
  const logger = createLogger({
    collapsed: true,
    predicate: () => ENV.APP_DEBUG,
    // stateTransformer: (state) => {
    //   const newState = {}
    //   state.keySeq().forEach((key) => {
    //     newState[key] = state.get(key).toJS()
    //   })
    //   return newState
    // },
  })
  const reduxRouterMiddleware = routerMiddleware(history)
  const sagaMiddleware = createSagaMiddleware()
  const initialState = window.__INITIAL_STATE__ || passedInitialState
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
  )(createStore)(reducer, Immutable.fromJS(initialState))
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
  )(createStore)(reducer, Immutable.fromJS(initialState))

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
