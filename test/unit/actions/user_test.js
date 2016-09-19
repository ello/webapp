import { isFSA, isFSAName } from '../../support/test_helpers'
import * as subject from '../../../src/actions/user'
import {
  postsAsGrid, postsAsList, userAvatars, usersAsGrid,
} from '../../../src/components/streams/StreamRenderables'
import { postsFromLoves } from '../../../src/components/streams/StreamFilters'
import { postLovers } from '../../../src/networking/api'

describe('user actions', () => {
  context('#flagUser', () => {
    const action = subject.flagUser('mk', 'awesome')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.flagUser)).to.be.true
    })

    it('has an api endpoint with the username in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/users/~mk')
    })

    it('has an api endpoint with the flag kind in the action', () => {
      expect(action.payload.endpoint.path).to.contain('awesome')
    })
  })

  context('#loadUserDetail', () => {
    const action = subject.loadUserDetail('archer')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.loadUserDetail)).to.be.true
    // })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/archer')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('sets updateResult to false in the action', () => {
      expect(action.meta.updateResult).to.be.false
    })
  })

  context('#loadUserPosts', () => {
    const action = subject.loadUserPosts('archer', 'posts')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadUserPosts)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/archer/posts')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('posts')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
    })
  })

  context('#loadUserLoves', () => {
    const action = subject.loadUserLoves('archer', 'loves')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadUserLoves)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/archer/loves')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('loves')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
    })

    it('has the correct resultFilter in the action', () => {
      expect(action.meta.resultFilter).to.equal(postsFromLoves)
    })
  })

  context('#loadUserFollowing', () => {
    const action = subject.loadUserFollowing('archer', 'friend')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadUserFollowing)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/archer/following')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsGrid)
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/archer/following?per_page=10&priority=friend')
    })
  })

  context('#loadUserUsers', () => {
    const action = subject.loadUserUsers('archer', 'followers')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadUserUsers)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/archer/followers')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsGrid)
    })
  })

  context('#loadUserDrawer', () => {
    const post = { id: '666' }
    const action = subject.loadUserDrawer(postLovers(post.id), post, 'loves')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadUserDrawer)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/posts/666/lovers?per_page=10')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList, asGrid and asError properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(userAvatars)
      expect(action.meta.renderStream.asGrid).to.equal(userAvatars)
      expect(action.meta.renderStream.asError).to.exist
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/posts/666/loves')
    })

    it('has the correct updateKey in the action', () => {
      expect(action.meta.updateKey).to.equal('/posts/666/')
    })
  })

  context('#sendMessage', () => {
    const action = subject.sendMessage('1', 'message body')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/users/1/hire_me')
    })

    it('send the message via post', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the expected body for sending a message', () => {
      expect(action.payload.body.body).to.equal('message body')
    })
  })
})

