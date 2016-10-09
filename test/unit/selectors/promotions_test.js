import { stubPromotion, stubAuthPromotion } from '../../support/stubs'
import {
  selectIsAuthenticationView,
  selectPromotionsAuthentication,
  selectPromotionsLoggedIn,
  selectPromotionsLoggedOut,
  selectPromotions,
  selectCurrentPromotions,
} from '../../../src/selectors/promotions'

describe('promotions selectors', () => {
  let authentication
  let promotions
  beforeEach(() => {
    authentication = { isLoggedIn: true }
    promotions = {
      authentication: stubAuthPromotion(),
      loggedIn: stubPromotion('loggedIn'),
      loggedOut: stubPromotion('loggedOut'),
    }
  })

  afterEach(() => {
    authentication = {}
    promotions = {}
  })

  context('#selectPromotionsAuthentication', () => {
    it('returns the promotions.authentication', () => {
      const state = { authentication, promotions }
      expect(selectPromotionsAuthentication(state)).to.deep.equal(promotions.authentication)
    })
  })

  context('#selectPromotionsLoggedIn', () => {
    it('returns the promotions.loggedIn', () => {
      const state = { authentication, promotions }
      expect(selectPromotionsLoggedIn(state)).to.deep.equal(promotions.loggedIn)
    })
  })

  context('#selectPromotionsLoggedOut', () => {
    it('returns the promotions.loggedOut', () => {
      const state = { authentication, promotions }
      expect(selectPromotionsLoggedOut(state)).to.deep.equal(promotions.loggedOut)
    })
  })

  context('#selectPromotions', () => {
    it('returns the promotions.loggedIn when logged in', () => {
      const state = { authentication, promotions }
      expect(selectPromotions(state)).to.deep.equal(promotions.loggedIn)
      const nextState = { ...state, change: 1 }
      expect(selectPromotions(nextState)).to.deep.equal(promotions.loggedIn)
      expect(selectPromotions.recomputations()).to.equal(1)
    })

    it('returns the promotions.loggedOut when logged out', () => {
      const state = { authentication: { isLoggedIn: false }, promotions }
      expect(selectPromotions(state)).to.deep.equal(promotions.loggedOut)
      const nextState = { ...state, change: 1 }
      expect(selectPromotions(nextState)).to.deep.equal(promotions.loggedOut)
      // Scoped to 2 since recomputations are part of the context block
      expect(selectPromotions.recomputations()).to.equal(2)
    })
  })

  context('#selectIsAuthenticationView', () => {
    it('returns true for the /join page', () => {
      const state = {
        routing: { location: { pathname: '/join' } },
      }
      expect(selectIsAuthenticationView(state)).to.equal(true)
    })

    it('returns true for an auth template', () => {
      const state = {
        routing: { location: { pathname: '/enter' } },
      }
      expect(selectIsAuthenticationView(state)).to.equal(true)
    })

    it('returns false for discover', () => {
      const state = {
        routing: { location: { pathname: '/discover' } },
      }
      expect(selectIsAuthenticationView(state)).to.equal(false)
    })
  })

  context('#selectCurrentPromotions', () => {
    it('returns the promotions.loggedIn when logged in', () => {
      const state = { authentication, promotions, routing: { location: { pathname: '/discover' } } }
      expect(selectCurrentPromotions(state)).to.deep.equal(promotions.loggedIn)
      const nextState = { ...state, change: 1 }
      expect(selectCurrentPromotions(nextState)).to.deep.equal(promotions.loggedIn)
      expect(selectCurrentPromotions.recomputations()).to.equal(1)
    })

    it('returns the promotions.loggedOut when logged out', () => {
      const state = {
        authentication: { isLoggedIn: false },
        promotions,
        routing: { location: { pathname: '/discover' } },
      }
      expect(selectCurrentPromotions(state)).to.deep.equal(promotions.loggedOut)
      const nextState = { ...state, change: 1 }
      expect(selectCurrentPromotions(nextState)).to.deep.equal(promotions.loggedOut)
      // Scoped to 2 since recomputations are part of the context block
      expect(selectCurrentPromotions.recomputations()).to.equal(2)
    })

    it('returns the promotions.authentication when logged out on an auth page', () => {
      const state = {
        authentication: { isLoggedIn: false },
        promotions,
        routing: { location: { pathname: '/enter' } },
      }
      expect(selectCurrentPromotions(state)).to.deep.equal(promotions.authentication)
      const nextState = { ...state, change: 1 }
      expect(selectCurrentPromotions(nextState)).to.deep.equal(promotions.authentication)
      // Scoped to 3 since recomputations are part of the context block
      expect(selectCurrentPromotions.recomputations()).to.equal(3)
    })

    it('returns the promotions.authentication when logged out on the join page', () => {
      const state = {
        authentication: { isLoggedIn: false },
        promotions,
        routing: { location: { pathname: '/join' } },
      }
      expect(selectCurrentPromotions(state)).to.deep.equal(promotions.authentication)
      const nextState = { ...state, change: 1 }
      expect(selectCurrentPromotions(nextState)).to.deep.equal(promotions.authentication)
      // Scoped to 4 since recomputations are part of the context block
      expect(selectCurrentPromotions.recomputations()).to.equal(4)
    })
  })
})

