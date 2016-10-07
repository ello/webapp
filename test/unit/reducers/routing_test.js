import { LOCATION_CHANGE } from 'react-router-redux'
import { default as reducer } from '../../../src/reducers/routing'

describe('promotions reducer', () => {
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
    const subject = {
      location: {
        pathname: '/discover/trending',
        state: undefined,
      },
      locationBeforeTransitions: {
        pathname: '/discover/trending',
      },
      previousPath: undefined,
    }

    it('LOCATION_CHANGE updates the routing', () => {
      const action = { type: LOCATION_CHANGE, payload: { pathname: '/discover/trending' } }
      const result = reducer(initialState, action)
      expect(result).to.deep.equal(subject)
    })

    it('A non LOCATION_CHANGE action type does not update the routing', () => {
      const action = { type: LOCATION_CHANGE, payload: { pathname: '/discover/trending' } }
      const result = reducer(initialState, action)
      expect(result).to.deep.equal(subject)
      const nextResult = reducer(result, { type: 'PHONY.ACTION_TYPE' })
      expect(nextResult).to.deep.equal(subject)
    })
  })
})

