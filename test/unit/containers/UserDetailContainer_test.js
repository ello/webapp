import { getStreamAction } from '../../../src/containers/UserDetailContainer'

describe('UserDetailContainer', () => {
  context('#getStreamAction', () => {
    it('returns the correct stream action for following', () => {
      const vo = { type: 'following', username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.query).to.contain('userNetworkStream')
      expect(action.payload.variables.username).to.equal('archer')
      expect(action.payload.variables.kind).to.equal('FOLLOWING')
    })

    it('returns the correct stream action for followers', () => {
      const vo = { type: 'followers', username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.query).to.contain('userNetworkStream')
      expect(action.payload.variables.username).to.equal('archer')
      expect(action.payload.variables.kind).to.equal('FOLLOWERS')
    })

    it('returns the correct stream action for loves', () => {
      const vo = { type: 'loves', username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.query).to.contain('userLoveStream')
      expect(action.payload.variables.username).to.equal('~archer')
    })

    it('returns the correct graphql stream action for posts', () => {
      const vo = { username: 'archer' }
      const action = getStreamAction(vo)
      expect(action.payload.query).to.contain('userPostStream')
      expect(action.payload.variables.username).to.equal('~archer')
    })
  })
})

