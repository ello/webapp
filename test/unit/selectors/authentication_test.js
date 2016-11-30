import Immutable from 'immutable'
import { stubAuthenticationStore } from '../../support/stubs'
import {
  selectAccessToken,
  selectExpirationDate,
  selectIsLoggedIn,
  selectRefreshToken,
  selectShouldUseAccessToken,
  selectShouldUseRefreshToken,
} from '../../../src/selectors/authentication'

describe.only('authentication selectors', () => {
  let state
  beforeEach(() => {
    state = Immutable.Map({ authentication: stubAuthenticationStore() })
  })

  afterEach(() => {
    state = {}
  })

  context('#selectAccessToken', () => {
    it('returns the correct accessToken', () => {
      expect(selectAccessToken(state)).to.equal('authenticationAccessToken')
    })
  })

  context('#selectExpirationDate', () => {
    it('returns the correct expirationDate', () => {
      expect(selectExpirationDate(state)).to.equal('authenticationExpirationDate')
    })
  })

  context('#selectIsLoggedIn', () => {
    it('returns the correct isLoggedIn', () => {
      expect(selectIsLoggedIn(state)).to.equal(true)
    })
  })

  context('#selectRefreshToken', () => {
    it('returns the correct refreshToken', () => {
      expect(selectRefreshToken(state)).to.equal('authenticationRefreshToken')
    })
  })

  context('#selectShouldUseAccessToken', () => {
    const n = new Date()
    const twentyfour = (24 * 60 * 60 * 1000)
    const future = new Date(n.getTime() + twentyfour)
    const past = new Date(n.getTime() - twentyfour)
    it('returns whether to use the access token or not', () => {
      state = state.set('expirationDate', future).set('change', false)
      expect(selectShouldUseAccessToken(state)).to.equal(true)

      state = state.set('change', true)
      expect(selectShouldUseAccessToken.recomputations()).to.equal(1)

      state = state.set('expirationDate', past).set('change', true)
      expect(selectShouldUseAccessToken(state)).to.equal(false)
      expect(selectShouldUseAccessToken.recomputations()).to.equal(2)
    })
  })

  context('#selectShouldUseRefreshToken', () => {
    const n = new Date()
    const twentyfour = (24 * 60 * 60 * 1000)
    const future = new Date(n.getTime() + twentyfour)
    const past = new Date(n.getTime() - twentyfour)
    it('returns whether to use the refreshToken or not', () => {
      state = state.set('expirationDate', future).set('change', false)
      expect(selectShouldUseRefreshToken(state)).to.equal(false)

      state = Immutable.fromJS({ authentication: { ...state, change: true } })
      expect(selectShouldUseRefreshToken.recomputations()).to.equal(1)

      state = state.set('expirationDate', past).set('change', true)
      expect(selectShouldUseRefreshToken(state)).to.equal(true)
      expect(selectShouldUseRefreshToken.recomputations()).to.equal(2)
    })
  })
})

