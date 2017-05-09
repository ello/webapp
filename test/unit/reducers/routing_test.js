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
        terms: undefined,
        preview: undefined,
      },
      locationBeforeTransitions: { pathname: '/discover/trending' },
      previousPath: undefined,
    })

    it('LOCATION_CHANGE updates the routing', () => {
      const action = { type: LOCATION_CHANGE, payload: { locationBeforeTransitions: { pathname: '/discover/trending' } } }
      const state = reducer(initialState, action)
      expect(state).to.equal(subject)
    })

    it('LOCATION_CHANGE updates the query.terms when present', () => {
      const action = { type: LOCATION_CHANGE, payload: { locationBeforeTransitions: { query: { terms: 'terms' } } } }
      const state = reducer(initialState, action)
      expect(state.getIn(['location', 'terms'])).to.equal('terms')
    })

    it('LOCATION_CHANGE updates the query.terms from payload', () => {
      const action = { type: LOCATION_CHANGE, payload: { query: { terms: 'terms' } } }
      const state = reducer(initialState, action)
      expect(state.getIn(['location', 'terms'])).to.equal('terms')
    })

    it('LOCATION_CHANGE resets the terms to undefined when missing', () => {
      const action = { type: LOCATION_CHANGE, payload: { query: { terms: 'terms' } } }
      let state = reducer(initialState, action)
      expect(state.getIn(['location', 'terms'])).to.equal('terms')
      state = reducer(state, { type: LOCATION_CHANGE, payload: { locationBeforeTransitions: { pathname: '/discover/trending' } } })
      expect(state.getIn(['location', 'terms'])).to.equal(undefined)
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

