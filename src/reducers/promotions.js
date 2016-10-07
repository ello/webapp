import { fromJS } from 'immutable'
import { PROMOTIONS } from '../constants/action_types'

const initialState = fromJS({
  authentication: [],
  loggedIn: [],
  loggedOut: [],
})

export default (state = initialState, action) => {
  switch (action.type) {
    case PROMOTIONS.AUTHENTICATION_SUCCESS:
      return initialState.set('authentication', action.payload.response).toJS()
    case PROMOTIONS.LOGGED_IN_SUCCESS:
      return initialState.set('loggedIn', action.payload.response).toJS()
    case PROMOTIONS.LOGGED_OUT_SUCCESS:
      return initialState.set('loggedOut', action.payload.response).toJS()
    default:
      return initialState.toJS()
  }
}

