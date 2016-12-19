import Immutable from 'immutable'
import { clearJSON, json, stubJSONStore } from '../../support/stubs'
import { selectPages, selectPagesResult, selectPage } from '../../../src/selectors/pages'

describe('pages selectors', () => {
  let state
  beforeEach(() => {
    stubJSONStore()
    state = { json, routing: Immutable.fromJS({ location: { pathname: '/discover' } }) }
  })

  afterEach(() => {
    clearJSON()
  })

  context('#selectPages', () => {
    it('returns the json.pages', () => {
      expect(selectPages(state)).to.deep.equal(json.get('pages'))
    })
  })

  context('#selectPagesResult', () => {
    it('returns the pages results when the key is supplied', () => {
      const props = { action: { meta: { resultKey: '/discover' } } }
      expect(selectPagesResult(state, props)).to.deep.equal(json.getIn(['pages', '/discover']))
    })

    it('returns the pages results when the key is not supplied', () => {
      expect(selectPagesResult(state)).to.deep.equal(json.getIn(['pages', '/discover']))
    })
  })

  context('#selectPage', () => {
    it('returns the page', () => {
      state.change = true
      expect(selectPage(state)).to.deep.equal(json.getIn(['pages', '/discover']))
      state.change = false
      expect(selectPage(state)).to.deep.equal(json.getIn(['pages', '/discover']))
      expect(selectPage.recomputations()).to.equal(1)
    })
  })
})

