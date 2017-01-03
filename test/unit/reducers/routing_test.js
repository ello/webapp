import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import reducer from '../../../src/reducers/routing'

describe('routing reducer', () => {
  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(reducer(undefined, {})).to.have.keys(
        'locationBeforeTransitions',
        'previousPath',
      )
    })
  })

  context('LOCATION', () => {
    const initialState = reducer(undefined, {})
    const subject = Immutable.fromJS({
      location: {
        pathname: '/discover/trending',
        state: undefined,
      },
      locationBeforeTransitions: { pathname: '/discover/trending' },
      previousPath: undefined,
    })

    it('LOCATION_CHANGE updates the routing', () => {
      const action = { type: LOCATION_CHANGE, payload: { locationBeforeTransitions: { pathname: '/discover/trending' } } }
      const state = reducer(initialState, action)
      expect(state).to.equal(subject)
    })

    it('A non LOCATION_CHANGE action type does not update the routing', () => {
      const action = { type: LOCATION_CHANGE, payload: { locationBeforeTransitions: { pathname: '/discover/trending' } } }
      let state = reducer(initialState, action)
      expect(state).to.deep.equal(subject)
      state = reducer(state, { type: 'PHONY.ACTION_TYPE' })
      expect(state).to.equal(subject)
    })
  })
})

