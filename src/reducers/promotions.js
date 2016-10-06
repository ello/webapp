import { fromJS } from 'immutable'
import { PROMOTIONS } from '../constants/action_types'

const initialState = {
  authentication: [],
  loggedIn: [],
  loggedOut: [],
}

export default (state = initialState, action) => {
  const map = fromJS(state)
  switch (action.type) {
    case PROMOTIONS.AUTHENTICATION_SUCCESS:
      return map.set('authentication', action.payload.response).toJS()
    case PROMOTIONS.LOGGED_IN_SUCCESS:
      return map.set('loggedIn', action.payload.response).toJS()
    case PROMOTIONS.LOGGED_OUT_SUCCESS:
      return map.set('loggedOut', action.payload.response).toJS()
    default:
      return state
  }
}

