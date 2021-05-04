import Immutable from 'immutable'
import { isFSA, isFSAName } from '../../support/test_helpers'
import * as subject from '../../../src/actions/user'
import { postsAsGrid, postsAsList, usersAsGrid } from '../../../src/components/streams/StreamRenderables'
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
    const action = subject.loadUserDetail({ username: 'archer' })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct query in the action', () => {
      expect(action.payload.query).to.contain('findUser')
      expect(action.payload.variables.username).to.equal('archer')
    })
  })

  context('#loadUserPostsV3', () => {
    const action = subject.loadUserPostsV3('archer', 'posts')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct query in the action', () => {
      expect(action.payload.query).to.contain('userPostStream')
      expect(action.payload.variables.username).to.equal('archer')
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

    it('has the correct query in the action', () => {
      expect(action.payload.query).to.contain('userLoveStream')
      expect(action.payload.variables.username).to.equal('archer')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
    })
  })

  context('#loadUserNetwork', () => {
    const action = subject.loadUserNetwork('archer', 'FOLLOWING')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct query in the action', () => {
      expect(action.payload.query).to.contain('userNetworkStream')
    })

    it('has the correct variables in the action', () => {
      expect(action.payload.variables.username).to.eq('archer')
      expect(action.payload.variables.kind).to.eq('FOLLOWING')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsGrid)
    })
  })

  context('#loadUserDrawer', () => {
    const post = Immutable.fromJS({ id: '666' })
    const action = subject.loadUserDrawer(postLovers(post.get('id')), post.get('id'), 'loves')

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
      expect(action.meta.renderStream.asList).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asError).to.exist
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/posts/666/loves')
    })

    it('has the correct updateKey in the action', () => {
      expect(action.meta.updateKey).to.equal('/posts/666/')
    })
  })

  context('#hireUser', () => {
    const action = subject.hireUser('1', 'message body')

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

  context('#collabWithUser', () => {
    const action = subject.collabWithUser('1', 'message body')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/users/1/collaborate')
    })

    it('send the message via post', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the expected body for sending a message', () => {
      expect(action.payload.body.body).to.equal('message body')
    })
  })
})

