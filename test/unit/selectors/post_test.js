import Immutable from 'immutable'
import { clearJSON, json, stub } from '../../support/stubs'
import * as selector from '../../../src/selectors/post'

describe('post selectors', () => {
  let propsPost
  let state
  beforeEach(() => {
    stub('post', { authorId: 'statePost' })
    propsPost = stub('post', { authorId: 'propPost', id: '666', links: { repostAuthor: { id: '9' } } })
    state = { json }
  })

  afterEach(() => {
    clearJSON()
  })

  context('#selectPropsPost', () => {
    it('returns the correct props post', () => {
      const props = { post: propsPost }
      expect(selector.selectPropsPost(state, props)).to.equal(propsPost)
    })
  })

  context('#selectPropsPostId', () => {
    it('returns the correct props post id', () => {
      const props = { post: propsPost }
      expect(selector.selectPropsPostId(state, props)).to.equal('666')
    })
  })

  context('#selectPropsPostToken', () => {
    it('returns the correct props post token', () => {
      const props = { post: propsPost }
      expect(selector.selectPropsPostToken(state, props)).to.equal('token')
    })
  })

  context('#selectPropsPostAuthorId', () => {
    it('returns the correct props post author id', () => {
      const props = { post: propsPost }
      expect(selector.selectPropsPostAuthorId(state, props)).to.equal('propPost')
    })
  })

  context('#selectPropsRepostAuthorId', () => {
    it('returns the correct props post repost author id', () => {
      const props = { post: propsPost }
      expect(selector.selectPropsRepostAuthorId(state, props)).to.equal('9')
    })
  })

  context('#selectIsOwnOriginalPost', () => {
    it('returns if the post is the users own', () => {
      state = { profile: Immutable.Map({ id: '9' }) }
      const props = { post: propsPost }
      expect(selector.selectIsOwnOriginalPost(state, props)).to.equal(true)
      state.change = 1
      expect(selector.selectIsOwnOriginalPost(state, props)).to.equal(true)
      expect(selector.selectIsOwnOriginalPost.recomputations()).to.equal(1)
    })

    it('returns if the post is not the users own', () => {
      state = { profile: Immutable.Map({ id: 'statePost' }) }
      const props = { post: propsPost }
      expect(selector.selectIsOwnOriginalPost(state, props)).to.equal(false)
      state.change = 1
      expect(selector.selectIsOwnOriginalPost(state, props)).to.equal(false)
      // 2 since the memoization is from the context block
      expect(selector.selectIsOwnOriginalPost.recomputations()).to.equal(2)
    })
  })

  context('#selectIsOwnPost', () => {
    it('returns if the post is the users own', () => {
      state = { profile: Immutable.Map({ id: 'propPost' }) }
      const props = { post: propsPost }
      expect(selector.selectIsOwnPost(state, props)).to.equal(true)
      state.change = 1
      expect(selector.selectIsOwnPost(state, props)).to.equal(true)
      expect(selector.selectIsOwnPost.recomputations()).to.equal(1)
    })

    it('returns if the post is not the users own', () => {
      state = { profile: Immutable.Map({ id: 'statePost' }) }
      const props = { post: propsPost }
      expect(selector.selectIsOwnPost(state, props)).to.equal(false)
      state.change = 1
      expect(selector.selectIsOwnPost(state, props)).to.equal(false)
      // 2 since the memoization is from the context block
      expect(selector.selectIsOwnPost.recomputations()).to.equal(2)
    })
  })

  context('#selectPostFromPropsPostId', () => {
    it('returns the post from json', () => {
      const pst = stub('post')
      state = { json }
      const props = { post: Immutable.Map({ id: '1' }) }
      expect(selector.selectPostFromPropsPostId(state, props)).to.deep.equal(pst)
      state.change = 1
      expect(selector.selectPostFromPropsPostId(state, props)).to.deep.equal(pst)
      expect(selector.selectPostFromPropsPostId.recomputations()).to.equal(1)
    })
  })

  context('#selectPostFromToken', () => {
    it('returns the post from json', () => {
      const pst = stub('post', { id: '1' })
      state = { json }
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      expect(selector.selectPostFromToken(state, props)).to.deep.equal(pst)
    })
  })

  context('#selectPostMetaDescription', () => {
    it('returns the post meta description', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaDescription(state, props)).to.equal('meta description')
    })
  })

  context('#selectPostMetaRobots', () => {
    it('returns the post meta robot instructions', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaRobots(state, props)).to.deep.equal('index, follow')
    })
  })

  context('#selectPostMetaTitle', () => {
    it('returns the post meta title', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaTitle(state, props)).to.equal('meta title')
    })
  })

  context('#selectPostMetaUrl', () => {
    it('returns the post meta url', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaUrl(state, props)).to.equal('https://ello.co/author/post/meta-url')
    })
  })

  context('#selectPostMetaCanonicalUrl', () => {
    it('returns the post canonical url', () => {
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal(null)
      state = { json: state.json.setIn(['posts', '1', 'metaAttributes', 'canonicalUrl'], 'meta-canonicalUrl') }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal('meta-canonicalUrl')
    })
  })

  context('#selectPostMetaImages', () => {
    it('returns the meta images (image/embed) for a post', () => {
      const result = {
        openGraphImages: [
          { property: 'og:image', content: 'meta-image-0.jpg' },
          { property: 'og:image', content: 'meta-image-1.jpg' },
        ],
        schemaImages: [
          { name: 'image', itemprop: 'image', content: 'meta-image-0.jpg' },
          { name: 'image', itemprop: 'image', content: 'meta-image-1.jpg' },
        ],
      }

      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaImages(state, props)).to.deep.equal(result)
    })
  })
})

