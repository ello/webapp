import Immutable from 'immutable'
import { stubAuthPromotion } from '../../support/stubs'
import { selectAuthPromotionals } from '../../../src/selectors/promotions'

describe('promotions selectors', () => {
  let authentication
  let promotions
  let state
  beforeEach(() => {
    authentication = { isLoggedIn: true }
    promotions = {
      authentication: stubAuthPromotion(),
    }
    state = Immutable.fromJS({ authentication, promotions })
  })

  afterEach(() => {
    authentication = {}
    promotions = {}
  })

  context('#selectAuthPromotionals', () => {
    it('returns the promotions.authentication', () => {
      expect(selectAuthPromotionals(state)).to.deep.equal(promotions.authentication)
    })
  })
})

