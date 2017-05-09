import Immutable from 'immutable'
import { clearJSON, json, stubEditorial } from '../../support/stubs'
import * as selector from '../../../src/selectors/editorial'

describe('editorial selectors', () => {
  let editorialPost
  let editorialCurated
  let editorialExternal
  let state
  beforeEach(() => {
    editorialPost = stubEditorial('post', { id: 'editorialPost' })
    editorialCurated = stubEditorial('post_stream', { id: 'editorialCurated' })
    editorialExternal = stubEditorial('external', { id: 'editorialExternal' })
    state = { json }
  })

  afterEach(() => {
    editorialPost = {}
    editorialCurated = {}
    editorialExternal = {}
    clearJSON()
  })

  context('#selectPropsEditorialId', () => {
    it('returns the correct props editorial id from a editorialId', () => {
      const props = { editorialId: 'editorialPost' }
      expect(selector.selectPropsEditorialId(state, props)).to.equal('editorialPost')
    })

    it('returns the correct props editorial id from a editorial', () => {
      const props = { editorial: editorialCurated }
      expect(selector.selectPropsEditorialId(state, props)).to.equal('editorialCurated')
    })
  })

  context('#selectEditorials', () => {
    it('returns editorials model out of json', () => {
      expect(selector.selectEditorials(state)).to.deep.equal(state.json.get('editorials'))
    })
  })

  context('#selectEditorial', () => {
    it('returns a editorial from a editorialId', () => {
      const props = { editorialId: 'editorialPost' }
      const editorial = selector.selectEditorial(state, props)
      expect(editorial).to.deep.equal(editorialPost)
    })

    it('returns an empty Map if editorialId is not found', () => {
      const props = { editorialId: '666' }
      const editorial = selector.selectEditorial(state, props)
      expect(editorial).to.deep.equal(Immutable.Map())
    })

    it('returns a editorial from a editorial.id', () => {
      const props = { editorial: editorialExternal }
      const editorial = selector.selectEditorial(state, props)
      expect(editorial).to.deep.equal(editorialExternal)
    })

    it('returns an empty Map if editorial.id is not found', () => {
      const props = { editorial: stubEditorial() }
      const editorial = selector.selectEditorial(state, props)
      expect(editorial).to.deep.equal(Immutable.Map())
    })

    it('returns an empty Map if either editorial or editorialId is not found', () => {
      const props = {}
      const editorial = selector.selectEditorial({ json: Immutable.Map() }, props)
      expect(editorial).to.deep.equal(Immutable.Map())
    })
  })

  context('#selectEditorialPostId', () => {
    it('returns the correct linked post id', () => {
      const props = { editorialId: 'editorialPost' }
      expect(selector.selectEditorialPostId(state, props)).to.equal('1')
    })
  })
})

