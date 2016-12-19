import Immutable from 'immutable'
import { REHYDRATE } from 'redux-persist/constants'
import { AUTHENTICATION, PROFILE } from '../../../src/constants/action_types'
import reducer, { initialState } from '../../../src/reducers/authentication'

describe('authentication reducer', () => {
  let state
  let stubbedResponse
  beforeEach(() => {
    state = initialState
    stubbedResponse = {
      accessToken: '1234',
      createdAt: 1468968055,
      expiresIn: 7200,
      isLoggedIn: false,
      refreshToken: '5678',
      scope: 'public scoped_refresh_token',
      tokenType: 'bearer',
    }
  })

  afterEach(() => {
    state = Immutable.Map()
    stubbedResponse = {}
  })

  context('initial state', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {}),
      ).to.have.keys(
        'accessToken',
        'createdAt',
        'expirationDate',
        'expiresIn',
        'isLoggedIn',
        'refreshToken',
        'tokenType',
      )
    })
  })

  context('AUTHENTICATION', () => {
    it('AUTHENTICATION.CLEAR_STORE resets to initialState', () => {
      const clearAction = { type: AUTHENTICATION.CLEAR_STORE }
      expect(reducer(state, clearAction)).to.deep.equal(state)
    })

    it('AUTHENTICATION.LOGOUT_SUCCESS resets to initialState', () => {
      const clearAction = { type: AUTHENTICATION.LOGOUT_SUCCESS }
      expect(reducer(state, clearAction)).to.deep.equal(state)
    })

    it('AUTHENTICATION.LOGOUT_FAILURE resets to initialState', () => {
      const clearAction = { type: AUTHENTICATION.LOGOUT_FAILURE }
      expect(reducer(state, clearAction)).to.deep.equal(state)
    })

    it('AUTHENTICATION.USER_SUCCESS updates with response items', () => {
      const action = {
        type: AUTHENTICATION.USER_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      state = reducer(state, action)
      expect(state.get('expirationDate').getTime()).to.equal(newDate.getTime())
      expect(state.get('isLoggedIn')).to.be.true
    })

    it('AUTHENTICATION.REFRESH_SUCCESS updates with response items', () => {
      const action = {
        type: AUTHENTICATION.REFRESH_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      state = reducer(state, action)
      expect(state.get('expirationDate').getTime()).to.equal(newDate.getTime())
      expect(state.get('isLoggedIn')).to.be.true
    })
  })

  context('PROFILE', () => {
    it('PROFILE.DELETE_SUCCESS resets to initialState', () => {
      const clearAction = { type: PROFILE.DELETE_SUCCESS }
      expect(reducer(state, clearAction)).to.deep.equal(state)
    })

    it('PROFILE.SIGNUP_SUCCESS updates with response items', () => {
      const action = {
        type: PROFILE.SIGNUP_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      state = reducer(state, action)
      expect(state.get('expirationDate').getTime()).to.equal(newDate.getTime())
      expect(state.get('isLoggedIn')).to.be.true
    })
  })

  context('REHYDRATE', () => {
    it('updates with authentication from persisted data', () => {
      const action = {
        type: REHYDRATE,
        payload: { authentication: Immutable.fromJS(stubbedResponse) },
      }
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      state = reducer(state, action)
      expect(state.get('expirationDate').getTime()).to.equal(newDate.getTime())
    })
  })
})

