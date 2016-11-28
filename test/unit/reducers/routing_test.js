/* eslint-disable new-cap */
import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import reducer from '../../../src/reducers/routing'

describe('routing reducer', () => {
  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(reducer(undefined, {})).to.have.keys(
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
      previousPath: undefined,
    })

    it('LOCATION_CHANGE updates the routing', () => {
      const action = { type: LOCATION_CHANGE, payload: { locationBeforeTransitions: { pathname: '/discover/trending' } } }
      const result = reducer(initialState, action)
      expect(result).to.equal(subject)
    })

    it('A non LOCATION_CHANGE action type does not update the routing', () => {
      const action = { type: LOCATION_CHANGE, payload: { locationBeforeTransitions: { pathname: '/discover/trending' } } }
      const result = reducer(initialState, action)
      expect(result).to.deep.equal(subject)
      const nextResult = reducer(result, { type: 'PHONY.ACTION_TYPE' })
      expect(nextResult).to.equal(subject)
    })
  })
})

