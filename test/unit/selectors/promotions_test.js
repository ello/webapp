import Immutable from 'immutable'
import { stubAuthPromotion } from '../../support/stubs'
import { selectAuthPromotionals } from '../../../src/selectors/promotions'

describe('promotions selectors', () => {
  let authentication
  let promotions
  let state
  beforeEach(() => {
    authentication = Immutable.Map({ isLoggedIn: true })
    promotions = Immutable.fromJS({
      authentication: stubAuthPromotion(),
    })
    state = { authentication, promotions }
  })

  afterEach(() => {
    authentication = {}
    promotions = {}
  })

  context('#selectAuthPromotionals', () => {
    it('returns the promotions.authentication', () => {
      expect(selectAuthPromotionals(state)).to.deep.equal(promotions.get('authentication'))
    })
  })
})

