import Immutable from 'immutable'
import { clearJSON, json, stub, stubEmbedRegion, stubImageRegion, stubTextRegion } from '../../support/stubs'
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

  context('#selectAuthorFromPost', () => {
    it('returns the author from the post', () => {
      stub('post', { id: '1', authorId: '1' })
      const user = stub('user', { id: '1' })
      state = { json }
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      expect(selector.selectAuthorFromPost(state, props)).to.equal(user)
      state.change = 1
      expect(selector.selectAuthorFromPost(state, props)).to.equal(user)
      expect(selector.selectAuthorFromPost.recomputations()).to.equal(1)
    })
  })

  context('#selectPostBlocks', () => {
    it('returns one of the post blocks', () => {
      const regions = Immutable.List([
        stubTextRegion({ data: 'Text Region 1 ' }),
        stubTextRegion({ data: 'Text Region 2 ' }),
        stubTextRegion({ data: 'Text Region 3 ' }),
        stubTextRegion({ data: 'Text Region 4' }),
      ])
      const post = stub('post', {
        content: Immutable.List([regions.get(0), regions.get(1), regions.get(2)]),
        id: '1',
        repostContent: regions,
        summary: Immutable.List([regions.get(0), regions.get(1)]),
      })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostBlocks(state, props)).to.equal(regions)
      state.change = 1
      expect(selector.selectPostBlocks(state, props)).to.equal(regions)
      expect(selector.selectPostBlocks.recomputations()).to.equal(1)

      state = { json: state.json.setIn(['posts', '1', 'repostContent'], null) }
      expect(selector.selectPostBlocks(state, props)).to.equal(post.get('content'))
      expect(selector.selectPostBlocks.recomputations()).to.equal(2)

      state = { json: state.json.setIn(['posts', '1', 'content'], null) }
      expect(selector.selectPostBlocks(state, props)).to.equal(post.get('summary'))
      expect(selector.selectPostBlocks.recomputations()).to.equal(3)
    })
  })

  context('#selectPostEmbedContent', () => {
    it('returns the content for only embed blocks', () => {
      const i0 = stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } })
      const e0 = stubEmbedRegion({ data: { thumbnailLargeUrl: 'embed-thumbnailLargeUrl-0' } })
      const t1 = stubTextRegion({ data: 'Text Region 1 ' })
      const i1 = stubImageRegion({ data: { alt: 'image-alt-1', url: 'image-url-1' } })
      const e1 = stubEmbedRegion({ data: { thumbnailLargeUrl: 'embed-thumbnailLargeUrl-1' } })
      const t2 = stubTextRegion({ data: 'Text Region 2 ' })
      const i2 = stubImageRegion({ data: { alt: 'image-alt-2', url: 'image-url-2' } })

      const regions = Immutable.List([i0, e0, t1, i1, e1, t2, i2])
      let result = Immutable.List(['embed-thumbnailLargeUrl-0', 'embed-thumbnailLargeUrl-1'])
      stub('post', { id: '1', content: regions, summary: Immutable.List([regions.get(0), regions.get(1)]) })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }

      expect(selector.selectPostEmbedContent(state, props)).to.deep.equal(result)

      state.change = 1
      expect(selector.selectPostEmbedContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostEmbedContent.recomputations()).to.equal(1)

      result = Immutable.List(['embed-thumbnailLargeUrl-0'])
      state = { json: state.json.setIn(['posts', '1', 'content'], null) }
      expect(selector.selectPostEmbedContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostEmbedContent.recomputations()).to.equal(2)
    })
  })

  context('#selectPostImageContent', () => {
    it('returns the content for only image blocks', () => {
      const i0 = stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } })
      const t1 = stubTextRegion({ data: 'Text Region 1 ' })
      const i1 = stubImageRegion({ data: { alt: 'image-alt-1', url: 'image-url-1' } })
      const t2 = stubTextRegion({ data: 'Text Region 2 ' })
      const i2 = stubImageRegion({ data: { alt: 'image-alt-2', url: 'image-url-2' } })

      const regions = Immutable.List([i0, t1, i1, t2, i2])
      let result = Immutable.List(['image-url-0', 'image-url-1', 'image-url-2'])
      stub('post', { id: '1', content: regions, summary: Immutable.List([regions.get(0), regions.get(1)]) })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }

      expect(selector.selectPostImageContent(state, props)).to.deep.equal(result)

      state.change = 1
      expect(selector.selectPostImageContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostImageContent.recomputations()).to.equal(1)

      result = Immutable.List(['image-url-0'])
      state = { json: state.json.setIn(['posts', '1', 'content'], null) }
      expect(selector.selectPostImageContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostImageContent.recomputations()).to.equal(2)
    })
  })

  context('#selectPostImageAndEmbedContent', () => {
    it('returns the content for image and embed blocks', () => {
      const i0 = stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } })
      const e0 = stubEmbedRegion({ data: { thumbnailLargeUrl: 'embed-thumb-0' } })
      const t1 = stubTextRegion({ data: 'Text Region 1 ' })
      const i1 = stubImageRegion({ data: { alt: 'image-alt-1', url: 'image-url-1' } })
      const e1 = stubEmbedRegion({ data: { thumbnailLargeUrl: 'embed-thumb-1' } })
      const t2 = stubTextRegion({ data: 'Text Region 2 ' })
      const i2 = stubImageRegion({ data: { alt: 'image-alt-2', url: 'image-url-2' } })

      const regions = Immutable.List([i0, e0, t1, i1, e1, t2, i2])
      let result = Immutable.List(['image-url-0', 'image-url-1', 'image-url-2', 'embed-thumb-0', 'embed-thumb-1'])
      stub('post', { id: '1', content: regions, summary: [i0, i1] })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }

      expect(selector.selectPostImageAndEmbedContent(state, props)).to.deep.equal(result)

      state.change = 1
      expect(selector.selectPostImageAndEmbedContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostImageAndEmbedContent.recomputations()).to.equal(1)

      result = Immutable.List(['image-url-0', 'image-url-1'])
      state = { json: state.json.setIn(['posts', '1', 'content'], null) }
      expect(selector.selectPostImageAndEmbedContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostImageAndEmbedContent.recomputations()).to.equal(2)
    })
  })

  context('#selectPostTextContent', () => {
    it('returns the content for only text blocks', () => {
      const regions = Immutable.List([
        stubTextRegion({ data: 'Text Region 1 ' }),
        stubTextRegion({ data: 'Text Region 2 ' }),
        stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } }),
        stubTextRegion({ data: 'Text Region 3 ' }),
        stubTextRegion({ data: 'Text Region 4' }),
      ])
      let result = 'Text Region 1 Text Region 2 Text Region 3 Text Region 4'
      stub('post', { id: '1', content: regions, summary: Immutable.List([regions.get(0), regions.get(1)]) })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostTextContent(state, props)).to.equal(result)
      state.change = 1
      expect(selector.selectPostTextContent(state, props)).to.equal(result)
      expect(selector.selectPostTextContent.recomputations()).to.equal(1)

      result = 'Text Region 1 Text Region 2 '
      state = { json: state.json.setIn(['posts', '1', 'content'], null) }
      expect(selector.selectPostTextContent(state, props)).to.equal(result)
      expect(selector.selectPostTextContent.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaDescription', () => {
    it('returns the post meta description', () => {
      const regions = Immutable.List([
        stubTextRegion({ data: 'Text Region 1 ' }),
        stubTextRegion({ data: 'Text Region 2 ' }),
        stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } }),
        stubTextRegion({ data: 'Text Region 3 ' }),
        stubTextRegion({ data: 'Text Region 4' }),
      ])
      let result = 'Text Region 1 Text Region 2 Text Region 3 Text Region 4'
      stub('post', { id: '1', content: regions, summary: Immutable.List([regions.get(0), regions.get(1)]) })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      state.change = 1
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaDescription.recomputations()).to.equal(1)

      result = 'Text Region 1 Text Region 2 '
      state = { json: state.json.setIn(['posts', '1', 'content'], null) }
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaDescription.recomputations()).to.equal(2)

      result = 'Discover more amazing work like this on Ello.'
      const newRegions = Immutable.List([stubImageRegion()])
      state = { json: state.json.setIn(['posts', '1', 'content'], newRegions)
        .setIn(['posts', '1', 'summary'], newRegions) }
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaDescription.recomputations()).to.equal(3)
    })
  })

  context('#selectPostMetaRobots', () => {
    it('returns the post meta robot instructions', () => {
      stub('post', { id: '1', authorId: '1' })
      stub('user', { id: '1' })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaRobots(state, props)).to.deep.equal('index, follow')
      state.change = 1
      expect(selector.selectPostMetaRobots(state, props)).to.deep.equal('index, follow')
      expect(selector.selectPostMetaRobots.recomputations()).to.equal(1)

      state = { json: state.json.setIn(['users', '1', 'badForSeo'], true) }
      expect(selector.selectPostMetaRobots(state, props)).to.deep.equal('noindex, follow')
      expect(selector.selectPostMetaRobots.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaTitle', () => {
    it('returns the post meta title', () => {
      const regions = Immutable.List([stubTextRegion({ data: 'Text Region. 1 \n Next paragraph' })])
      stub('post', { id: '1', authorId: '1', content: regions, summary: regions })
      stub('user', { id: '1' })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      let result = 'Text Region - from @username on Ello.'
      expect(selector.selectPostMetaTitle(state, props)).to.deep.equal(result)
      state.change = 1
      expect(selector.selectPostMetaTitle(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaTitle.recomputations()).to.equal(1)

      result = 'A post from @username on Ello.'
      const newRegions = Immutable.List([stubImageRegion()])
      state = { json: state.json.setIn(['posts', '1', 'content'], newRegions)
        .setIn(['posts', '1', 'summary'], newRegions) }
      expect(selector.selectPostMetaTitle(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaTitle.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaUrl', () => {
    it('returns the post meta url', () => {
      stub('post', { id: '1', authorId: '1' })
      stub('user', { id: '1' })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      const result = `${ENV.AUTH_DOMAIN}/username/post/token`
      expect(selector.selectPostMetaUrl(state, props)).to.deep.equal(result)
      state.change = 1
      expect(selector.selectPostMetaUrl(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaUrl.recomputations()).to.equal(1)
    })
  })

  context('#selectPostMetaCanonicalUrl', () => {
    it('returns the post canonical url', () => {
      stub('post', { id: '1', authorId: '1' })
      stub('user', { id: '1' })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal(null)
      state.change = 1
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal(null)
      expect(selector.selectPostMetaCanonicalUrl.recomputations()).to.equal(1)

      const result = `${ENV.AUTH_DOMAIN}/username/post/token`
      state = { json: state.json.setIn(['posts', '1', 'repostContent'], 's')
        .setIn(['posts', '1', 'repostPath'], '/username/post/token') }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaCanonicalUrl.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaImages', () => {
    it('returns the meta images (image/embed) for a post', () => {
      const i0 = stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } })
      const e0 = stubEmbedRegion({ data: { thumbnailLargeUrl: 'embed-thumb-0' } })
      const t1 = stubTextRegion({ data: 'Text Region 1 ' })
      const i1 = stubImageRegion({ data: { alt: 'image-alt-1', url: 'image-url-1' } })
      const e1 = stubEmbedRegion({ data: { thumbnailLargeUrl: 'embed-thumb-1' } })
      const t2 = stubTextRegion({ data: 'Text Region 2 ' })
      const i2 = stubImageRegion({ data: { alt: 'image-alt-2', url: 'image-url-2' } })

      const regions = Immutable.List([i0, e0, t1, i1, e1, t2, i2])
      let result = {
        openGraphImages: [
          { property: 'og:image', content: 'image-url-0' },
          { property: 'og:image', content: 'image-url-1' },
          { property: 'og:image', content: 'image-url-2' },
          { property: 'og:image', content: 'embed-thumb-0' },
          { property: 'og:image', content: 'embed-thumb-1' },
        ],
        schemaImages: [
          { name: 'image', itemprop: 'image', content: 'image-url-0' },
          { name: 'image', itemprop: 'image', content: 'image-url-1' },
          { name: 'image', itemprop: 'image', content: 'image-url-2' },
          { name: 'image', itemprop: 'image', content: 'embed-thumb-0' },
          { name: 'image', itemprop: 'image', content: 'embed-thumb-1' },
        ],
      }

      stub('post', { content: regions, id: '1', summary: [i0, i1] })
      const props = { post: Immutable.Map({ id: '1' }), params: { token: 'token' } }
      state = { json }

      expect(selector.selectPostMetaImages(state, props)).to.deep.equal(result)

      state.change = 1
      expect(selector.selectPostMetaImages(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaImages.recomputations()).to.equal(1)

      result = {
        openGraphImages: [
          { property: 'og:image', content: 'image-url-0' },
          { property: 'og:image', content: 'image-url-1' },
        ],
        schemaImages: [
          { name: 'image', itemprop: 'image', content: 'image-url-0' },
          { name: 'image', itemprop: 'image', content: 'image-url-1' },
        ],
      }
      state = { json: state.json.setIn(['posts', '1', 'content'], null) }
      expect(selector.selectPostMetaImages(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaImages.recomputations()).to.equal(2)
    })
  })
})

