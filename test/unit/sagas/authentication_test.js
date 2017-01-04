import { push } from 'react-router-redux'
import { AUTHENTICATION } from '../../../src/constants/action_types'
import { loginSaga, logoutSaga } from '../../../src/sagas/authentication'

import {
  cancelAuthRefresh,
  clearAuthStore,
  signIn,
  getUserCredentials,
} from '../../../src/actions/authentication'

describe('authentication saga', function () {
  const email = 'email'
  const password = 'password'

  describe('the saga itself', function () {
    it('clears the authentication store before logging in', function () {
      const loginAction = signIn(email, password)
      const loginHandler = loginSaga()
      expect(loginHandler).to.take(AUTHENTICATION.SIGN_IN)
      expect(loginHandler.next(loginAction)).to.put(clearAuthStore())
      expect(loginHandler).to.put(getUserCredentials(email, password))
    })
  })

  describe('*logoutSaga', () => {
    const logoutFn = logoutSaga()

    it('handles logout', () => {
      expect(logoutFn).to.take([
        AUTHENTICATION.LOGOUT_SUCCESS,
        AUTHENTICATION.LOGOUT_FAILURE,
        AUTHENTICATION.REFRESH_FAILURE,
      ])
      expect(logoutFn.next({ type: AUTHENTICATION.LOGOUT_SUCCESS })).to.put(cancelAuthRefresh())
      expect(document.cookie).to.equal('ello_skip_prerender=false')
      expect(logoutFn).to.put(push('/enter'))
    })
  })
})

