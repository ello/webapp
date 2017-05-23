import Immutable from 'immutable'
import * as selector from 'ello-brains/selectors/editorial'
import { clearJSON, json, stubEditorial } from '../../support/stubs'

describe('editorial selectors', () => {
  let editorialPost
  let editorialCurated
  let editorialExternal
  let state
  beforeEach(() => {
    editorialPost = stubEditorial('post')
    editorialCurated = stubEditorial('post_stream')
    editorialExternal = stubEditorial('external')
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
      const props = { editorialId: 'editorialPostId' }
      expect(selector.selectPropsEditorialId(state, props)).to.equal('editorialPostId')
    })

    it('returns the correct props editorial id from a editorial', () => {
      const props = { editorial: editorialCurated }
      expect(selector.selectPropsEditorialId(state, props)).to.equal('editorialCuratedId')
    })
  })

  context('#selectEditorials', () => {
    it('returns editorials model out of json', () => {
      expect(selector.selectEditorials(state)).to.deep.equal(state.json.get('editorials'))
    })
  })

  context('#selectEditorial', () => {
    it('returns a editorial from a editorialId', () => {
      const props = { editorialId: 'editorialPostId' }
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
      const props = { editorial: stubEditorial('post', { id: '666' }) }
      const editorial = selector.selectEditorial(state, props)
      expect(editorial).to.deep.equal(Immutable.Map())
    })

    it('returns an empty Map if either editorial or editorialId is not found', () => {
      const props = {}
      const editorial = selector.selectEditorial({ json: Immutable.Map() }, props)
      expect(editorial).to.deep.equal(Immutable.Map())
    })
  })

  context('#selectEditorialImageSource', () => {
    it('returns the correct image source based on a size of 1x1', () => {
      const props = { editorialId: 'editorialPostId', size: '1x1' }
      const expected = editorialPost.get('oneByOneImage')
      const result = selector.selectEditorialImageSource(state, props)
      expect(expected).to.equal(result)
    })

    it('returns the correct image source based on a size of 1x2', () => {
      const props = { editorialId: 'editorialPostId', size: '1x2' }
      const expected = editorialPost.get('oneByTwoImage')
      const result = selector.selectEditorialImageSource(state, props)
      expect(expected).to.equal(result)
    })

    it('returns the correct image source based on a size of 2x1', () => {
      const props = { editorialId: 'editorialPostId', size: '2x1' }
      const expected = editorialPost.get('twoByOneImage')
      const result = selector.selectEditorialImageSource(state, props)
      expect(expected).to.equal(result)
    })

    it('returns the correct image source based on a size of 2x2', () => {
      const props = { editorialId: 'editorialPostId', size: '2x2' }
      const expected = editorialPost.get('twoByTwoImage')
      const result = selector.selectEditorialImageSource(state, props)
      expect(expected).to.equal(result)
    })
  })

  context('#selectEditorialKind', () => {
    it('returns the correct editorial kind', () => {
      let expected = 'post'
      let result = selector.selectEditorialKind(state, { editorialId: 'editorialPostId' })
      expect(expected).to.equal(result)

      expected = 'post_stream'
      result = selector.selectEditorialKind(state, { editorialId: 'editorialCuratedId' })
      expect(expected).to.equal(result)

      expected = 'external'
      result = selector.selectEditorialKind(state, { editorialId: 'editorialExternalId' })
      expect(expected).to.equal(result)
    })
  })

  context('#selectEditorialPostId', () => {
    it('returns the correct linked post id', () => {
      const props = { editorialId: 'editorialPostId' }
      expect(selector.selectEditorialPostId(state, props)).to.equal('1')
    })
  })

  context('#selectEditorialPostStreamHref', () => {
    it('returns the correct linked post id', () => {
      const props = { editorialId: 'editorialCuratedId' }
      expect(selector.selectEditorialPostStreamHref(state, props)).to.equal('/postStream/href')
    })
  })

  context('#selectEditorialUrl', () => {
    it('returns the url property on a ExternalEditorial', () => {
      const expected = '/external/url'
      const result = selector.selectEditorialUrl(state, { editorialId: 'editorialExternalId' })
      expect(expected).to.equal(result)
    })

    it('returns undefined for url on a non ExternalEditorial', () => {
      const expected = undefined
      const result = selector.selectEditorialUrl(state, { editorialId: 'editorialCuratedId' })
      expect(expected).to.equal(result)
    })
  })

  context('#selectEditorialAnalyticsOptions', () => {
    it('returns the correct editorial analytics options', () => {
      let expected = { kind: 'post', postId: '1', parent: 'editorial', position: 2, size: '2x1' }
      let result = selector.selectEditorialAnalyticsOptions(state, {
        editorialId: 'editorialPostId',
        position: 2,
        size: '2x1',
      })
      expect(expected).to.deep.equal(result)

      expected = { kind: 'post_stream', parent: 'editorial', position: 1, size: '2x2' }
      result = selector.selectEditorialAnalyticsOptions(state, {
        editorialId: 'editorialCuratedId',
        position: 1,
        size: '2x2',
      })
      expect(expected).to.deep.equal(result)

      expected = { kind: 'external', parent: 'editorial', position: 12, size: '1x1' }
      result = selector.selectEditorialAnalyticsOptions(state, {
        editorialId: 'editorialExternalId',
        position: 12,
        size: '1x1',
      })
      expect(expected).to.deep.equal(result)
    })
  })
})

