import { REHYDRATE } from 'redux-persist/constants'
import { AUTHENTICATION, PROFILE } from '../../../src/constants/action_types'
import { default as reducer } from '../../../src/reducers/authentication'

describe('authentication reducer', () => {
  const initialState = reducer(undefined, {})
  const stubbedResponse = {
    accessToken: '1234',
    createdAt: 1468968055,
    expiresIn: 7200,
    isLoggedIn: false,
    refreshToken: '5678',
    scope: 'public scoped_refresh_token',
    tokenType: 'bearer',
  }

  context('initial state', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {})
      ).to.have.keys(
        'accessToken',
        'createdAt',
        'expirationDate',
        'expiresIn',
        'isLoggedIn',
        'refreshToken',
        'tokenType'
      )
    })
  })

  context('AUTHENTICATION', () => {
    it('AUTHENTICATION.CLEAR_STORE resets to initialState', () => {
      const clearAction = { type: AUTHENTICATION.CLEAR_STORE }
      expect(reducer({ archer: 'phrasing' }, clearAction)).to.deep.equal(initialState)
    })

    it('AUTHENTICATION.LOGOUT_SUCCESS resets to initialState', () => {
      const clearAction = { type: AUTHENTICATION.LOGOUT_SUCCESS }
      expect(reducer({ archer: 'phrasing' }, clearAction)).to.deep.equal(initialState)
    })

    it('AUTHENTICATION.LOGOUT_FAILURE resets to initialState', () => {
      const clearAction = { type: AUTHENTICATION.LOGOUT_FAILURE }
      expect(reducer({ archer: 'phrasing' }, clearAction)).to.deep.equal(initialState)
    })

    it('AUTHENTICATION.USER_SUCCESS updates with response items', () => {
      const action = {
        type: AUTHENTICATION.USER_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const reducedState = reducer(undefined, action)
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      expect(reducedState).to.deep.equal({
        ...stubbedResponse,
        isLoggedIn: true,
        expirationDate: newDate,
      })
    })

    it('AUTHENTICATION.REFRESH_SUCCESS updates with response items', () => {
      const action = {
        type: AUTHENTICATION.REFRESH_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const reducedState = reducer(undefined, action)
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      expect(reducedState).to.deep.equal({
        ...stubbedResponse,
        isLoggedIn: true,
        expirationDate: newDate,
      })
    })
  })

  context('PROFILE', () => {
    it('PROFILE.DELETE_SUCCESS resets to initialState', () => {
      const clearAction = { type: PROFILE.DELETE_SUCCESS }
      expect(reducer({ archer: 'phrasing' }, clearAction)).to.deep.equal(initialState)
    })

    it('PROFILE.SIGNUP_SUCCESS updates with response items', () => {
      const action = {
        type: PROFILE.SIGNUP_SUCCESS,
        payload: { response: stubbedResponse },
      }
      const reducedState = reducer(undefined, action)
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      expect(reducedState).to.deep.equal({
        ...stubbedResponse,
        isLoggedIn: true,
        expirationDate: newDate,
      })
    })
  })

  context('REHYDRATE', () => {
    it('updates with authentication from persisted data', () => {
      const action = {
        type: REHYDRATE,
        payload: { authentication: stubbedResponse },
      }
      const reducedState = reducer(undefined, action)
      const newDate = new Date((stubbedResponse.createdAt + stubbedResponse.expiresIn) * 1000)
      expect(reducedState).to.deep.equal({
        ...stubbedResponse,
        expirationDate: newDate,
      })
    })
  })
})

