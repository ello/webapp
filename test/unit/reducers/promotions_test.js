import Immutable from 'immutable'
import { stubAuthPromotion } from '../../support/stubs'
import reducer from '../../../src/reducers/promotions'
import { PROMOTIONS } from '../../../src/constants/action_types'


describe('promotions reducer', () => {
  const authentication = Immutable.List(['archer', 'pam', 'malory'].map(username => stubAuthPromotion(username)))

  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(reducer(undefined, {})).to.have.keys(
        'authentication',
      )
    })
  })

  context('PROMOTIONS', () => {
    it('PROMOTIONS.AUTHENTICATION_SUCCESS sets the list of authentication in promotions', () => {
      const action = {
        type: PROMOTIONS.AUTHENTICATION_SUCCESS,
        payload: { response: authentication },
      }
      const result = reducer(undefined, action)
      expect(result.get('authentication')).to.equal(authentication)
    })
  })
})

