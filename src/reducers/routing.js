/* eslint-disable new-cap */
import Immutable from 'immutable'
import get from 'lodash/get'
import { LOCATION_CHANGE } from 'react-router-redux'

const previousPath = typeof document === 'undefined' ? '/' : document.location.pathname

// Merge our initial state with routerReducer's initial state
const initialState = Immutable.fromJS({ previousPath })

export default (state = initialState, { type, payload }) => {
  if (type === LOCATION_CHANGE) {
    console.log('routing', state)
    return state.merge({
      location: {
        pathname: get(payload, 'locationBeforeTransitions.pathname'),
        state: get(payload, 'locationBeforeTransitions.state'),
      },
      previousPath: state.getIn(['location', 'pathname']),
    })
  }
  return state
}

