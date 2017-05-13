import { isFSA, isFSAName } from '../../support/test_helpers'
import { stub } from '../../support/stubs'
import { resetEditor } from '../../../src/actions/editor'
import * as subject from '../../../src/actions/posts'

describe('posts.js', () => {
  context('#createPost', () => {
    const body = [
      { kind: 'text', data: 'what?' },
      { kind: 'image', data: { url: 'uploads.something/ello-something' } },
    ]
    const action = subject.createPost(body, 'editorId')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.createPost)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.body.body).to.deep.equal(body)
      expect(action.payload.endpoint.path).to.contain('/posts')
      expect(action.payload.editorId).to.equal('editorId')
      expect(action.payload.method).to.equal('POST')
    })

    it('sets the appropriate meta', () => {
      expect(action.meta.mappingType).to.equal('posts')
      expect(action.meta.repostId).to.be.undefined
      expect(action.meta.repostedFromId).to.be.undefined
    })

    it('has the results of resetEditor for the successAction', () => {
      expect(action.meta.successAction).to.deep.equal(resetEditor('editorId'))
    })
  })

  context('#deletePost', () => {
    const post = stub('post')
    const action = subject.deletePost(post)

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.deletePost)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.endpoint.path).to.contain('/posts')
      expect(action.payload.method).to.equal('DELETE')
      expect(action.payload.model).to.deep.equal(post)
    })
  })

  context('#flagPost', () => {
    const post = stub('post')
    const action = subject.flagPost(post, 'spam')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.flagPost)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/1/flag/spam')
      expect(action.payload.method).to.equal('POST')
    })
  })

  context('#loadComments', () => {
    const post = stub('post')
    const action = subject.loadComments(post.get('id'))

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadComments)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/1/comments')
      expect(action.payload.postIdOrToken).to.equal('1')
    })

    it('sets the appropriate meta', () => {
      expect(action.meta.resultKey).to.equal('/posts/1/comments')
    })
  })

  context('#loadEditablePost', () => {
    const action = subject.loadEditablePost('1')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.loadEditablePost)).to.be.true
    // })

    it('sets the appropriate payload', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/1?comment_count=false')
    })

    it('sets the appropriate meta', () => {
      expect(action.meta.mappingType).to.equal('posts')
      expect(action.meta.updateResult).to.be.false
    })
  })

  context('#loadPostDetail', () => {
    const action = subject.loadPostDetail('~my_sweet_token')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    // TODO: This could probably have a matching action.type and action.name
    it('has the expected type constant', () => {
      expect(action.type).to.equal('POST.DETAIL')
    })

    it('returns the expected action', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/~my_sweet_token')
      expect(action.meta.mappingType).to.equal('posts')
      expect(action.meta.updateResult).to.be.false
    })
  })

  context('#lovePost', () => {
    const post = stub('post')
    const action = subject.lovePost({ post, trackLabel: 'track-love-post', trackOptions: { f: 1 } })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.lovePost)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/1/love')
      expect(action.payload.method).to.equal('POST')
      expect(action.payload.model).to.deep.equal(post)
      expect(action.payload.trackLabel).to.deep.equal('track-love-post')
      expect(action.payload.trackOptions).to.deep.equal({ f: 1 })
    })

    it('sets the appropriate meta information', () => {
      expect(action.meta.mappingType).to.equal('loves')
      expect(action.meta.resultKey).to.equal('/posts/1/love')
      expect(action.meta.updateKey).to.equal('/posts/1/')
    })
  })

  context('#toggleComments', () => {
    const post = stub('post')
    const action = subject.toggleComments(post, true)

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.toggleComments)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.showComments).to.be.true
      expect(action.payload.model).to.deep.equal(post)
    })
  })

  context('#toggleEditing', () => {
    const post = stub('post')
    const action = subject.toggleEditing(post, true)

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.toggleEditing)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isEditing).to.be.true
      expect(action.payload.model).to.deep.equal(post)
    })
  })

  context('#toggleReposting', () => {
    const post = stub('post')
    const action = subject.toggleReposting(post, true)

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.toggleReposting)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isReposting).to.be.true
      expect(action.payload.model).to.deep.equal(post)
    })
  })

  context('#unlovePost', () => {
    const post = stub('post')
    const action = subject.unlovePost({ post, trackLabel: 'track-unlove-post', trackOptions: { f: 2 } })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.unlovePost)).to.be.true
    // })

    it('sets the appropriate payload', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/1/love')
      expect(action.payload.method).to.equal('DELETE')
      expect(action.payload.model).to.deep.equal(post)
      expect(action.payload.trackLabel).to.deep.equal('track-unlove-post')
      expect(action.payload.trackOptions).to.deep.equal({ f: 2 })
    })

    it('sets the appropriate meta information', () => {
      expect(action.meta.resultKey).to.equal('/posts/1/love')
      expect(action.meta.updateKey).to.equal('/posts/1/')
    })
  })

  context('#updatePost', () => {
    const body = [
      { kind: 'text', data: 'what?' },
      { kind: 'image', data: { url: 'uploads.something/ello-something' } },
    ]
    const post = stub('post')
    const action = subject.updatePost(post, body, 'editorId')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.updatePost)).to.be.true
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.body.body).to.deep.equal(body)
      expect(action.payload.editorId).to.equal('editorId')
      expect(action.payload.endpoint.path).to.contain('/posts')
      expect(action.payload.method).to.equal('PATCH')
      expect(action.payload.model).to.deep.equal(post)
    })

    it('sets the appropriate meta', () => {
      expect(action.meta.mappingType).to.equal('posts')
    })
  })
})

