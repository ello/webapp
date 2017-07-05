import { AUTHENTICATION, PROFILE } from 'ello-brains/constants/action_types'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import { selectBundleId, selectRegistrationId } from 'ello-brains/selectors/profile'
import {
  registerForGCM,
  requestPushSubscription,
  unregisterForGCM,
} from 'ello-brains/actions/profile'
import { loginPushSubscribe, logoutPushUnsubscribe } from '../../../src/sagas/push_subscription'

describe('push subscription saga', function () {
  const regId = 'my awesome registration id'

  describe('#loginPushSubscribe', function () {
    it('registers for GCM when logged in', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = loginPushSubscribe()
      expect(pushHandler).to.take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
      expect(pushHandler.next(pushAction)).to.select(selectIsLoggedIn)
      expect(pushHandler.next(true)).to.put(registerForGCM(regId))
    })

    it('defers registration for GCM until logged in', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = loginPushSubscribe()
      expect(pushHandler).to.take(PROFILE.REQUEST_PUSH_SUBSCRIPTION)
      expect(pushHandler.next(pushAction)).to.select(selectIsLoggedIn)
      expect(pushHandler.next(false)).to.take(AUTHENTICATION.USER_SUCCESS)
      expect(pushHandler).to.put(registerForGCM(regId))
    })
  })

  describe('#logoutPushUnsubscribe', function () {
    it('unregisters push subscription on logout or profile delete', function () {
      const pushAction = requestPushSubscription(regId)
      const pushHandler = logoutPushUnsubscribe()
      expect(pushHandler).to.take([
        AUTHENTICATION.LOGOUT_SUCCESS,
        AUTHENTICATION.LOGOUT_FAILURE,
        AUTHENTICATION.REFRESH_FAILURE,
        PROFILE.DELETE_SUCCESS,
      ])
      expect(pushHandler.next(pushAction)).to.select(selectRegistrationId)
      expect(pushHandler.next('reg_id')).to.select(selectBundleId)
      expect(pushHandler.next('bundle_id')).to.put(unregisterForGCM('reg_id', 'bundle_id'))
    })
  })
})

