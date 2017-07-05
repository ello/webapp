import { decamelizeKeys } from 'humps'
import { saveProfile } from 'ello-brains/actions/profile'
import { trackEvent } from 'ello-brains/actions/analytics'
import store from '../store'

export function preferenceToggleChanged(obj) {
  const newObj = { ...obj }
  if ({}.hasOwnProperty.call(newObj, 'is_public')) {
    if (!newObj.is_public) {
      newObj.has_reposting_enabled = false
      newObj.has_sharing_enabled = false
    }
  }
  store.dispatch(saveProfile(decamelizeKeys(newObj)))
}

export function dispatchTrackEvent(label, options = {}) {
  store.dispatch(trackEvent(label, options))
}

