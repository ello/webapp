import Immutable from 'immutable'
import { stubJSONStore, stubUser } from '../../support/stubs'
import { RELATIONSHIP_PRIORITY as PRIORITY } from '../../../src/constants/relationship_types'
import {
  getNextBlockMutePriority,
  mapStateToProps,
} from '../../../src/containers/RelationshipContainer'

describe('RelationshipContainer', () => {
  context('#getNextBlockMutePriority', () => {
    it('returns a INACTIVE priority if it is BLOCK', () => {
      expect(getNextBlockMutePriority(PRIORITY.BLOCK)).to.equal(PRIORITY.INACTIVE)
    })

    it('returns a INACTIVE priority if it is MUTE', () => {
      expect(getNextBlockMutePriority(PRIORITY.MUTE)).to.equal(PRIORITY.INACTIVE)
    })

    it('returns a BLOCK priority if it is FRIEND and it is requested to be block', () => {
      expect(getNextBlockMutePriority(PRIORITY.FRIEND, 'block')).to.equal(PRIORITY.BLOCK)
    })

    it('returns a MUTE priority if it is NOISE and it is requested to be mute', () => {
      expect(getNextBlockMutePriority(PRIORITY.NOISE, 'mute')).to.equal(PRIORITY.MUTE)
    })

    it('returns a INACTIVE priority if it is NOISE and it hits the inner default', () => {
      expect(getNextBlockMutePriority(PRIORITY.NOISE)).to.equal(PRIORITY.INACTIVE)
    })
  })

  context('#mapStateToProps', () => {
    const json = stubJSONStore()
    const user = stubUser({ id: '1', username: 'archer' })
    const props = {
      user,
      hasBlockMuteButton: true,
    }
    const state = {
      authentication: Immutable.Map({ isLoggedIn: true }),
      gui: Immutable.Map({ deviceSize: 'mobile' }),
      json,
      routing: Immutable.fromJS({ location: { pathname: '/discover' }, previousPath: '/onboarding' }),
    }

    const expected = {
      deviceSize: 'mobile',
      onClickCallback: 'onRelationshipUpdate',
      pathname: '/discover',
      previousPath: '/onboarding',
      relationshipPriority: null,
      shouldRenderBlockMute: true,
      userId: '1',
      username: 'archer',
    }

    const mapped = mapStateToProps(state, props)

    it('should deep equal the expected properties', () => {
      expect(mapped).to.deep.equal(expected)
    })
  })
})

