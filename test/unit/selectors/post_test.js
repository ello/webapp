import { stub, stubEmbedRegion, stubImageRegion, stubTextRegion } from '../../support/stubs'
import * as selector from '../../../src/selectors/post'

describe('post selectors', () => {
  let statePost
  let propsPost
  beforeEach(() => {
    statePost = stub('post', { authorId: 'statePost' })
    propsPost = stub('post', { authorId: 'propPost', id: '666' })
  })

  afterEach(() => {
    statePost = {}
    propsPost = {}
  })

  context('#selectPropsPost', () => {
    it('returns the correct props post', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selector.selectPropsPost(state, props)).to.deep.equal(propsPost)
    })
  })

  context('#selectPropsPostId', () => {
    it('returns the correct props post id', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selector.selectPropsPostId(state, props)).to.equal('666')
    })
  })

  context('#selectPropsPostToken', () => {
    it('returns the correct props post token', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selector.selectPropsPostToken(state, props)).to.equal('token')
    })
  })

  context('#selectPropsPostAuthorId', () => {
    it('returns the correct props post author id', () => {
      const state = { json: { posts: statePost } }
      const props = { post: propsPost }
      expect(selector.selectPropsPostAuthorId(state, props)).to.equal('propPost')
    })
  })

  context('#selectIsOwnPost', () => {
    it('returns if the post is the users own', () => {
      const state = { json: { posts: statePost }, profile: { id: 'propPost' } }
      const props = { post: propsPost }
      expect(selector.selectIsOwnPost(state, props)).to.equal(true)
      const nextState = { ...state, change: 1 }
      expect(selector.selectIsOwnPost(nextState, props)).to.equal(true)
      expect(selector.selectIsOwnPost.recomputations()).to.equal(1)
    })

    it('returns if the post is not the users own', () => {
      const state = { json: { posts: statePost }, profile: { id: 'statePost' } }
      const props = { post: propsPost }
      expect(selector.selectIsOwnPost(state, props)).to.equal(false)
      const nextState = { ...state, change: 1 }
      expect(selector.selectIsOwnPost(nextState, props)).to.equal(false)
      // 2 since the memoization is from the context block
      expect(selector.selectIsOwnPost.recomputations()).to.equal(2)
    })
  })

  context('#selectPostFromPropsPostId', () => {
    it('returns the post from json', () => {
      const pst = stub('post')
      const state = { json: { posts: { 1: { ...pst } } } }
      const props = { post: { id: '1' } }
      expect(selector.selectPostFromPropsPostId(state, props)).to.deep.equal(pst)
      const nextState = { ...state, change: 1 }
      expect(selector.selectPostFromPropsPostId(nextState, props)).to.deep.equal(pst)
      expect(selector.selectPostFromPropsPostId.recomputations()).to.equal(1)
    })
  })

  context('#selectPostFromToken', () => {
    it('returns the post from json', () => {
      const pst = stub('post')
      const state = { json: { posts: { 1: { ...pst } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selector.selectPostFromToken(state, props)).to.deep.equal(pst)
    })
  })

  context('#selectAuthorFromPost', () => {
    it('returns the author from the post', () => {
      const post = stub('post', { authorId: '1' })
      const user = stub('user')
      let state = {
        json: {
          posts: { 1: { ...post } },
          users: { 1: { ...user } },
        },
      }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selector.selectAuthorFromPost(state, props)).to.deep.equal(user)
      state = { ...state, change: 1 }
      expect(selector.selectAuthorFromPost(state, props)).to.deep.equal(user)
      expect(selector.selectAuthorFromPost.recomputations()).to.equal(1)
    })
  })

  context('#selectPostBlocks', () => {
    it('returns one of the post blocks', () => {
      const regions = [
        stubTextRegion({ data: 'Text Region 1 ' }),
        stubTextRegion({ data: 'Text Region 2 ' }),
        stubTextRegion({ data: 'Text Region 3 ' }),
        stubTextRegion({ data: 'Text Region 4' }),
      ]
      const post = stub('post', {
        content: [regions[0], regions[1], regions[2]],
        repostContent: regions,
        summary: [regions[0], regions[1]],
      })
      let state = { json: { posts: { 1: { ...post } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selector.selectPostBlocks(state, props)).to.deep.equal(regions)
      state = { ...state, change: 1 }
      expect(selector.selectPostBlocks(state, props)).to.deep.equal(regions)
      expect(selector.selectPostBlocks.recomputations()).to.equal(1)

      state = { json: { posts: { 1: { ...post, repostContent: null } } } }
      expect(selector.selectPostBlocks(state, props)).to.deep.equal(post.content)
      expect(selector.selectPostBlocks.recomputations()).to.equal(2)

      state = { json: { posts: { 1: { ...post, repostContent: null, content: null } } } }
      expect(selector.selectPostBlocks(state, props)).to.deep.equal(post.summary)
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

      const regions = [i0, e0, t1, i1, e1, t2, i2]
      let result = ['embed-thumbnailLargeUrl-0', 'embed-thumbnailLargeUrl-1']
      const post = stub('post', { content: regions, summary: [regions[0], regions[1]] })
      let state = { json: { posts: { 1: { ...post } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }

      expect(selector.selectPostEmbedContent(state, props)).to.deep.equal(result)

      state = { ...state, change: 1 }
      expect(selector.selectPostEmbedContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostEmbedContent.recomputations()).to.equal(1)

      result = ['embed-thumbnailLargeUrl-0']
      state = { json: { posts: { 1: { ...post, content: null } } } }
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

      const regions = [i0, t1, i1, t2, i2]
      let result = ['image-url-0', 'image-url-1', 'image-url-2']
      const post = stub('post', { content: regions, summary: [regions[0], regions[1]] })
      let state = { json: { posts: { 1: { ...post } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }

      expect(selector.selectPostImageContent(state, props)).to.deep.equal(result)

      state = { ...state, change: 1 }
      expect(selector.selectPostImageContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostImageContent.recomputations()).to.equal(1)

      result = ['image-url-0']
      state = { json: { posts: { 1: { ...post, content: null } } } }
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

      const regions = [i0, e0, t1, i1, e1, t2, i2]
      let result = ['image-url-0', 'image-url-1', 'image-url-2', 'embed-thumb-0', 'embed-thumb-1']
      const post = stub('post', { content: regions, summary: [i0, i1] })
      let state = { json: { posts: { 1: { ...post } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }

      expect(selector.selectPostImageAndEmbedContent(state, props)).to.deep.equal(result)

      state = { ...state, change: 1 }
      expect(selector.selectPostImageAndEmbedContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostImageAndEmbedContent.recomputations()).to.equal(1)

      result = ['image-url-0', 'image-url-1']
      state = { json: { posts: { 1: { ...post, content: null } } } }
      expect(selector.selectPostImageAndEmbedContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostImageAndEmbedContent.recomputations()).to.equal(2)
    })
  })

  context('#selectPostTextContent', () => {
    it('returns the content for only text blocks', () => {
      const regions = [
        stubTextRegion({ data: 'Text Region 1 ' }),
        stubTextRegion({ data: 'Text Region 2 ' }),
        stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } }),
        stubTextRegion({ data: 'Text Region 3 ' }),
        stubTextRegion({ data: 'Text Region 4' }),
      ]
      let result = 'Text Region 1 Text Region 2 Text Region 3 Text Region 4'
      const post = stub('post', { content: regions, summary: [regions[0], regions[1]] })
      let state = { json: { posts: { 1: { ...post } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selector.selectPostTextContent(state, props)).to.deep.equal(result)
      state = { ...state, change: 1 }
      expect(selector.selectPostTextContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostTextContent.recomputations()).to.equal(1)

      result = 'Text Region 1 Text Region 2 '
      state = { json: { posts: { 1: { ...post, content: null } } } }
      expect(selector.selectPostTextContent(state, props)).to.deep.equal(result)
      expect(selector.selectPostTextContent.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaDescription', () => {
    it('returns the post meta description', () => {
      const regions = [
        stubTextRegion({ data: 'Text Region 1 ' }),
        stubTextRegion({ data: 'Text Region 2 ' }),
        stubImageRegion({ data: { alt: 'image-alt-0', url: 'image-url-0' } }),
        stubTextRegion({ data: 'Text Region 3 ' }),
        stubTextRegion({ data: 'Text Region 4' }),
      ]
      let result = 'Text Region 1 Text Region 2 Text Region 3 Text Region 4'
      const post = stub('post', { content: regions, summary: [regions[0], regions[1]] })
      let state = { json: { posts: { 1: { ...post } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      state = { ...state, change: 1 }
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaDescription.recomputations()).to.equal(1)

      result = 'Text Region 1 Text Region 2 '
      state = { json: { posts: { 1: { ...post, content: null } } } }
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaDescription.recomputations()).to.equal(2)

      result = 'Discover more amazing work like this on Ello.'
      const newRegions = [stubImageRegion()]
      const newPost = stub('post', { content: newRegions, summary: newRegions })
      state = { json: { posts: { 1: { ...newPost } } } }
      expect(selector.selectPostMetaDescription(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaDescription.recomputations()).to.equal(3)
    })
  })

  context('#selectPostMetaRobots', () => {
    it('returns the post meta robot instructions', () => {
      const post = stub('post', { authorId: '1' })
      const user = stub('user')
      let state = {
        json: {
          posts: { 1: { ...post } },
          users: { 1: { ...user } },
        },
      }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selector.selectPostMetaRobots(state, props)).to.deep.equal('index, follow')
      state = { ...state, change: 1 }
      expect(selector.selectPostMetaRobots(state, props)).to.deep.equal('index, follow')
      expect(selector.selectPostMetaRobots.recomputations()).to.equal(1)

      const newState = {
        json: {
          posts: { 1: { ...post } },
          users: { 1: { ...user, badForSeo: true } },
        },
      }
      expect(selector.selectPostMetaRobots(newState, props)).to.deep.equal('noindex, follow')
      expect(selector.selectPostMetaRobots.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaTitle', () => {
    it('returns the post meta title', () => {
      const regions = [stubTextRegion({ data: 'Text Region. 1 \n Next paragraph' })]
      const post = stub('post', { authorId: '1', content: regions, summary: regions })
      const user = stub('user')
      let state = {
        json: {
          posts: { 1: { ...post } },
          users: { 1: { ...user } },
        },
      }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      let result = 'Text Region - from @username on Ello.'
      expect(selector.selectPostMetaTitle(state, props)).to.deep.equal(result)
      state = { ...state, change: 1 }
      expect(selector.selectPostMetaTitle(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaTitle.recomputations()).to.equal(1)

      result = 'A post from @username on Ello.'
      const newRegions = [stubImageRegion()]
      const newPost = stub('post', { authorId: '1', content: newRegions, summary: newRegions })
      const newState = {
        json: {
          posts: { 1: { ...newPost } },
          users: { 1: { ...user } },
        },
      }
      expect(selector.selectPostMetaTitle(newState, props)).to.deep.equal(result)
      expect(selector.selectPostMetaTitle.recomputations()).to.equal(2)
    })
  })

  context('#selectPostMetaUrl', () => {
    it('returns the post meta url', () => {
      const post = stub('post', { authorId: '1' })
      const user = stub('user')
      let state = {
        json: {
          posts: { 1: { ...post } },
          users: { 1: { ...user } },
        },
      }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      const result = `${ENV.AUTH_DOMAIN}/username/post/token`
      expect(selector.selectPostMetaUrl(state, props)).to.deep.equal(result)
      state = { ...state, change: 1 }
      expect(selector.selectPostMetaUrl(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaUrl.recomputations()).to.equal(1)
    })
  })

  context('#selectPostMetaCanonicalUrl', () => {
    it('returns the post canonical url', () => {
      const post = stub('post', { authorId: '1' })
      const user = stub('user')
      let state = {
        json: {
          posts: { 1: { ...post } },
          users: { 1: { ...user } },
        },
      }
      const props = { post: { id: '1' }, params: { token: 'token' } }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal(null)
      state = { ...state, change: 1 }
      expect(selector.selectPostMetaCanonicalUrl(state, props)).to.deep.equal(null)
      expect(selector.selectPostMetaCanonicalUrl.recomputations()).to.equal(1)

      const result = `${ENV.AUTH_DOMAIN}/username/post/token`
      const newState = {
        json: {
          posts: { 1: { ...post, repostContent: 's', repostPath: '/username/post/token' } },
          users: { 1: { ...user } },
        },
      }
      expect(selector.selectPostMetaCanonicalUrl(newState, props)).to.deep.equal(result)
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

      const regions = [i0, e0, t1, i1, e1, t2, i2]
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

      const post = stub('post', { content: regions, summary: [i0, i1] })
      let state = { json: { posts: { 1: { ...post } } } }
      const props = { post: { id: '1' }, params: { token: 'token' } }

      expect(selector.selectPostMetaImages(state, props)).to.deep.equal(result)

      state = { ...state, change: 1 }
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
      state = { json: { posts: { 1: { ...post, content: null } } } }
      expect(selector.selectPostMetaImages(state, props)).to.deep.equal(result)
      expect(selector.selectPostMetaImages.recomputations()).to.equal(2)
    })
  })
})

