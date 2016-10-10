/* eslint-disable new-cap */
import Immutable from 'immutable'
import get from 'lodash/get'
import { LOCATION_CHANGE, routerReducer } from 'react-router-redux'

const previousPath = typeof document === 'undefined' ? '/' : document.location.pathname

// Merge our initial state with routerReducer's initial state
const initialState = Immutable.Map({
  ...routerReducer(undefined, { type: null, payload: null }),
  previousPath,
})

export default (state = initialState, { type, payload: location }) => {
  if (type === LOCATION_CHANGE) {
    const newState = routerReducer(state, { type, payload: location })
    return state.merge({
      location: {
        pathname: get(newState, 'locationBeforeTransitions.pathname'),
        state: get(newState, 'locationBeforeTransitions.state'),
      },
      previousPath: get(state, 'locationBeforeTransitions.pathname'),
    })
  }
  return state
}

