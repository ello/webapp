/* eslint-disable new-cap */
import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import { ALERT, AUTHENTICATION, MODAL, PROFILE } from '../constants/action_types'

const initialState = Immutable.Map({
  classList: null,
  component: null,
  isActive: false,
  kind: 'Modal',
  type: null,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case ALERT.OPEN:
    case ALERT.CLOSE:
    case MODAL.OPEN:
    case MODAL.CLOSE:
      return state.merge(Immutable.fromJS(action.payload))
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return initialState
    case LOCATION_CHANGE:
      if (state.get('isActive')) { return initialState }
      return state
    default:
      return state
  }
}

