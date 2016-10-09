import { stub } from '../../support/stubs'
import { getStreamAction, mapStateToProps } from '../../../src/containers/UserDetailContainer'

describe('UserDetailContainer', () => {
  context('#getStreamAction', () => {
    it('returns the correct stream action for following', () => {
      const vo = { activeUserFollowingType: 'noise', type: 'following', username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.endpoint.path).to.contain('/~archer/following')
    })

    it('returns the correct stream action for followers', () => {
      const vo = { type: 'followers', username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.endpoint.path).to.contain('/~archer/followers')
    })

    it('returns the correct stream action for loves', () => {
      const vo = { type: 'loves', username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.endpoint.path).to.contain('/~archer/loves')
    })

    it('returns the correct stream action for posts', () => {
      const vo = { username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.endpoint.path).to.contain('/~archer/posts')
    })
  })

  context('#mapStateToProps (new user)', () => {
    const user = stub('user', {
      followersCount: 0,
      postsCount: 0,
      relationshipPriority: 'friend',
      username: 'damian',
    })
    const state = {
      authentication: { isLoggedIn: true },
      gui: {
        activeUserFollowingType: 'friend',
        saidHelloTo: ['phillip', 'damian'],
      },
      json: { users: { 1: { ...user } } },
      stream: { type: 'USER.DETAIL_SUCCESS', error: {} },
    }
    const props = { params: { type: 'posts', username: 'damian' } }
    const action = getStreamAction({ username: 'damian' })
    const nextProps = mapStateToProps(state, props)

    it('sets hasSaidHelloTo to true', () => {
      expect(nextProps.hasSaidHelloTo).to.be.true
    })

    it('sets hasZeroFollowers to true', () => {
      expect(nextProps.hasZeroFollowers).to.be.true
    })

    it('sets hasZeroPosts to true', () => {
      expect(nextProps.hasZeroPosts).to.be.true
    })

    it('sets isSelf to false', () => {
      expect(nextProps.isSelf).to.be.false
    })

    it('sets a nice looking key', () => {
      expect(nextProps.viewKey).to.equal('userDetail/damian/posts')
    })

    it('sets the correct stream action', () => {
      expect(nextProps.streamAction).to.deep.equal(action)
    })

    it('sets tabs to null', () => {
      expect(nextProps.tabs).to.be.null
    })
  })

  context('#mapStateToProps (self)', () => {
    const user = stub('user', {
      followersCount: 666,
      postsCount: 1,
      relationshipPriority: 'self',
      username: 'nikki',
    })
    const state = {
      authentication: { isLoggedIn: true },
      gui: {
        activeUserFollowingType: 'friend',
        saidHelloTo: ['phillip', 'damian'],
      },
      json: { users: { 1: { ...user } } },
      stream: { type: 'USER.DETAIL_SUCCESS', error: {} },
    }
    const props = { params: { type: 'following', username: 'nikki' } }
    const action = getStreamAction({ username: 'nikki', type: 'following' })
    const nextProps = mapStateToProps(state, props)
    const tabs = [
      { type: 'friend', children: 'Following' },
      { type: 'noise', children: 'Starred' },
    ]

    it('sets hasSaidHelloTo to false', () => {
      expect(nextProps.hasSaidHelloTo).to.be.false
    })

    it('sets hasZeroFollowers to false', () => {
      expect(nextProps.hasZeroFollowers).to.be.false
    })

    it('sets hasZeroPosts to false', () => {
      expect(nextProps.hasZeroPosts).to.be.false
    })

    it('sets isSelf to true', () => {
      expect(nextProps.isSelf).to.be.true
    })

    it('sets a nice looking key', () => {
      expect(nextProps.viewKey).to.equal('userDetail/nikki/following/friend')
    })

    it('sets the correct stream action', () => {
      expect(nextProps.streamAction).to.deep.equal(action)
    })

    it('sets tabs to the expected group', () => {
      expect(nextProps.tabs).to.deep.equal(tabs)
    })
  })
})

