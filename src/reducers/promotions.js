import { fromJS } from 'immutable'
import { PROMOTIONS } from '../constants/action_types'

const initialState = {
  authentication: [],
}

export default (state = initialState, action) => {
  const map = fromJS(state)
  switch (action.type) {
    case PROMOTIONS.AUTHENTICATION_SUCCESS:
      return map.set('authentication', action.payload.response).toJS()
    default:
      return state
  }
}

