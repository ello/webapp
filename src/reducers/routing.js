// import { fromJS } from 'immutable'
import get from 'lodash/get'
import { LOCATION_CHANGE, routerReducer } from 'react-router-redux'

const previousPath = typeof document === 'undefined' ? '/' : document.location.pathname

// Merge our initial state with routerReducer's initial state
const initialState = {
  ...routerReducer(undefined, { type: null, payload: null }),
  previousPath,
}

export default (state = initialState, { type, payload: location }) => {
  const newState = routerReducer(state, { type, payload: location })
  if (type !== LOCATION_CHANGE) {
    return newState
  }
  return {
    ...newState,
    location: {
      pathname: get(newState, 'locationBeforeTransitions.pathname'),
      state: get(newState, 'locationBeforeTransitions.state'),
    },
    previousPath: get(state, 'locationBeforeTransitions.pathname'),
  }
}

// const initialState = fromJS({
//   ...routerReducer(undefined, { type: null, payload: null }),
//   previousPath,
// })

// export default (state = initialState, { type, payload: location }) => {
//   const newState = routerReducer(state, { type, payload: location })
//   if (type !== LOCATION_CHANGE) {
//     return fromJS(newState)
//   }
//   return state.merge({
//     location: {
//       pathname: get(newState, 'locationBeforeTransitions.pathname'),
//       state: get(newState, 'locationBeforeTransitions.state'),
//     },
//     previousPath: get(state, 'locationBeforeTransitions.pathname'),
//   })
// }

