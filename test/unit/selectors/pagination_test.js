import Immutable from 'immutable'
import { clearJSON, json, stubJSONStore } from '../../support/stubs'
import { selectPagination } from '../../../src/selectors/pagination'

describe('pagination selectors', () => {
  beforeEach(() => {
    stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  context('#selectPagination', () => {
    it('returns the pagination object related to the /discover page with memoization', () => {
      let state = Immutable.fromJS({ json, routing: { location: { pathname: '/discover' } } })
      const props = { token: 'paramsToken', type: 'paramsType' }
      expect(selectPagination(state, props)).to.deep.equal(json.getIn(['pages', '/discover', 'pagination']))
      state = state.set('blah', 1)
      expect(selectPagination(state, props)).to.deep.equal(json.getIn(['pages', '/discover', 'pagination']))
      expect(selectPagination.recomputations()).to.equal(1)
    })
  })
})

