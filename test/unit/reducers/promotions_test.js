import { stubAuthPromotion, stubPromotion } from '../../support/stubs'
import { default as reducer } from '../../../src/reducers/promotions'
import { PROMOTIONS } from '../../../src/constants/action_types'


describe('promotions reducer', () => {
  const loggedIn = ['mk', '666', 'jayzes'].map(username => stubPromotion(username))
  const loggedOut = ['mansfield', 'potus', 'bear'].map(username => stubPromotion(username))
  const authentication = ['archer', 'pam', 'malory'].map(username => stubAuthPromotion(username))

  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(reducer(undefined, {})).to.have.keys(
        'authentication',
        'loggedIn',
        'loggedOut',
      )
    })
  })

  context('PROMOTIONS', () => {
    it('PROMOTIONS.AUTHENTICATION_SUCCESS sets the list of authentication in promotions', () => {
      const action = {
        type: PROMOTIONS.AUTHENTICATION_SUCCESS,
        payload: { response: authentication },
      }
      const result = reducer(reducer, action)
      expect(result.authentication).to.deep.equal(authentication)
    })

    it('PROMOTIONS.LOGGED_IN_SUCCESS sets the list of logged in promotions', () => {
      const action = {
        type: PROMOTIONS.LOGGED_IN_SUCCESS,
        payload: { response: loggedIn },
      }
      const result = reducer(reducer, action)
      expect(result.loggedIn).to.deep.equal(loggedIn)
    })

    it('PROMOTIONS.LOGGED_OUT_SUCCESS sets the list of logged out promotions', () => {
      const action = {
        type: PROMOTIONS.LOGGED_OUT_SUCCESS,
        payload: { response: loggedOut },
      }
      const result = reducer(reducer, action)
      expect(result.loggedOut).to.deep.equal(loggedOut)
    })
  })
})

