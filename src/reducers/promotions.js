/* eslint-disable new-cap */
import Immutable from 'immutable'
import { PROMOTIONS } from '../constants/action_types'

const initialState = Immutable.Map({
  authentication: Immutable.List(),
})

export default (state = initialState, action) => {
  switch (action.type) {
    case PROMOTIONS.AUTHENTICATION_SUCCESS:
      return initialState.set('authentication', action.payload.response).toJS()
    default:
      return initialState.toJS()
  }
}

