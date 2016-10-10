/* eslint-disable new-cap */
import Immutable from 'immutable'
import { camelizeKeys } from 'humps'
import jwtDecode from 'jwt-decode'
import get from 'lodash/get'
import { REHYDRATE } from 'redux-persist/constants'
import { AUTHENTICATION, INVITATIONS, PROFILE } from '../constants/action_types'

function parseJWT(token) {
  const decoded = jwtDecode(token)
  if (decoded && decoded.data) {
    return { ...(camelizeKeys(decoded.data)) }
  }
  return {}
}

const initialState = Immutable.Map()

export default (state = initialState, action) => {
  switch (action.type) {
    case PROFILE.AVAILABILITY_SUCCESS:
      return state.merge({
        availability: {
          original: action.meta.original,
          ...action.payload.response.availability,
        },
      })
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      // keep around the registration data so that android
      // can re-register a user if they logout and then login
      // as a different user without leaving the app
      return Immutable.Map({
        buildVersion: state.buildVersion,
        bundleId: state.bundleId,
        marketingVersion: state.marketingVersion,
        registrationId: state.registrationId,
      })
    case PROFILE.EXPORT_SUCCESS:
      if (action.payload.serverStatus === 200) {
        return state.set('dataExport', action.payload.response.exportUrl)
      }
      return state.set('dataExport', null)
    case PROFILE.LOAD_SUCCESS:
      return state.merge({
        ...action.payload.response.users,
        id: `${action.payload.response.users.id}`,
      })
    case PROFILE.REQUEST_PUSH_SUBSCRIPTION:
      return state.merge(action.payload)
    case PROFILE.SAVE_REQUEST:
      return state.set('errors', null)
    case PROFILE.SAVE_SUCCESS: {
      return state.merge({
        ...action.payload.response.users,
        availability: null,
        id: `${action.payload.response.users.id}`,
      })
    }
    // should only happen if we get a 422 meaning
    // the current password entered was wrong
    case PROFILE.SAVE_FAILURE:
      return state.set('errors', get(action, 'payload.response.errors'))
    // Store a base64 reprensentation of the asset in `tmp` while uploading
    case PROFILE.TMP_AVATAR_CREATED:
    case PROFILE.TMP_COVER_CREATED: {
      const { type } = action
      const assetType = type === PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
      const key = type === PROFILE.TMP_AVATAR_CREATED ? 'hasAvatarPresent' : 'hasCoverImagePresent'
      const obj = {}
      obj[assetType] = { ...state[assetType], ...action.payload }
      obj[key] = key
      return state.merge(obj)
    }
    case REHYDRATE:
      if (!action.payload.profile) { return state }
      return state.merge(action.payload.profile)
        .set('availability', null)
        .set('dataExport', null)
        .deleteIn(['avatar', 'tmp'])
        .deleteIn(['coverImage', 'tmp'])
    case PROFILE.SAVE_AVATAR_SUCCESS:
    case PROFILE.SAVE_COVER_SUCCESS:
      return state.merge(action.payload.response.users)
        .set('avatar', { ...action.payload.response.users.avatar, tmp: state.getIn(['avatar', 'tmp']) })
        .set('coverImage', { ...action.payload.response.users.coverImage, tmp: state.getIn(['coverImage', 'tmp']) })
    case AUTHENTICATION.USER_SUCCESS:
    case AUTHENTICATION.REFRESH_SUCCESS:
    case PROFILE.SIGNUP_SUCCESS:
      return state.merge(parseJWT(action.payload.response.accessToken))
    case INVITATIONS.GET_EMAIL_SUCCESS:
      return state.set('email', get(action, 'payload.response.invitations.email'))
    default:
      return state
  }
}

