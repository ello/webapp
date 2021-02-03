import { isFSA, isFSAName } from '../../support/test_helpers'
import * as subject from '../../../src/actions/profile'
import { userResults } from '../../../src/components/streams/StreamFilters'
import {
  usersAsCompact, profileToggles,
} from '../../../src/components/streams/StreamRenderables'

describe('profile actions', () => {
  context('#loadProfile', () => {
    const action = subject.loadProfile()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.loadProfile)).to.be.true
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has updateResult set to false in the action', () => {
      expect(action.meta.updateResult).to.be.false
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile')
    })
  })

  context('#signUpUser', () => {
    const action = subject.signUpUser('vader@ello.co', 'vader', '12345678',
      'confirmation-code', 'i-am-your-father')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.signUpUser)).to.be.true
    // })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/signup')
    })

    it('has the correct body in the action', () => {
      expect(action.payload.body).to.deep.equal({
        code: 'confirmation-code',
        email: 'vader@ello.co',
        username: 'vader',
        password: '12345678',
        invitation_code: 'i-am-your-father',
      })
    })
  })

  context('#saveProfile', () => {
    const params = { email: 'yoda@ello.co', password: '12345678', username: 'yoda' }
    const action = subject.saveProfile(params)

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.saveProfile)).to.be.true
    })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('PATCH')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile')
    })

    it('has the correct body in the action', () => {
      expect(action.payload.body).to.deep.equal(params)
    })
  })

  context('#deleteProfile', () => {
    const action = subject.deleteProfile()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.deleteProfile)).to.be.true
    })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('DELETE')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile')
    })
  })

  context('#availableToggles', () => {
    const action = subject.availableToggles()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.availableToggles)).to.be.true
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('settings')
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/settings')
    })

    it('has asList, asGrid and asError properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(profileToggles)
      expect(action.meta.renderStream.asGrid).to.equal(profileToggles)
      expect(action.meta.renderStream.asError).to.exist
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile/settings')
    })
  })

  context('#checkAvailability', () => {
    const vo = { username: 'vader' }
    const action = subject.checkAvailability(vo)

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has a top level action.type', () => {
    //   expect(isFSAName(action, subject.checkAvailability)).to.be.true
    // })

    it('has the original vo in the action... ??', () => {
      expect(action.meta.original).to.deep.equal(vo)
    })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/availability')
    })
  })

  context('#resetAvailability', () => {
    const action = subject.resetAvailability()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has a top level action.type', () => {
    //   expect(isFSAName(action, subject.resetAvailability)).to.be.true
    // })
  })

  context('#requestInvite', () => {
    const action = subject.requestInvite('jabba@ello.co')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.requestInvite)).to.be.true
    })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the body as a stringified version of the email', () => {
      expect(action.payload.body).to.equal('{"email":"jabba@ello.co"}')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/invitations')
    })
  })

  context('#temporaryAssetCreated', () => {
    const action = subject.temporaryAssetCreated('PROFILE.TMP_AVATAR_CREATED', 'file://image.jpg')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.tmp.url).to.equal('file://image.jpg')
    })
  })

  context('#saveAvatar', () => {
    const action = subject.saveAvatar('file://avatar.jpg')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.saveAvatar)).to.be.true
    })

    it('has the file included in the action', () => {
      expect(action.payload.file).to.equal('file://avatar.jpg')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile')
    })
  })

  context('#saveCover', () => {
    const action = subject.saveCover('file://cover.jpg')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.saveCover)).to.be.true
    })

    it('has the file included in the action', () => {
      expect(action.payload.file).to.equal('file://cover.jpg')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile')
    })
  })

  context('#blockedUsers', () => {
    const action = subject.blockedUsers()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.saveCover)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile/blocked')
    })

    it('has the correct defaultMode in the action', () => {
      expect(action.meta.defaultMode).to.equal('list')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsCompact)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsCompact)
    })

    it('has the correct resultFilter in the action', () => {
      expect(action.meta.resultFilter).to.equal(userResults)
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/settings/blocked')
    })

    it('has the correct updateKey in the action', () => {
      expect(action.meta.updateKey).to.equal('/profile/blocked')
    })
  })

  context('#mutedUsers', () => {
    const action = subject.mutedUsers()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.mutedUsers)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile/muted')
    })

    it('has the correct defaultMode in the action', () => {
      expect(action.meta.defaultMode).to.equal('list')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList and asGrid properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsCompact)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsCompact)
    })

    it('has the correct resultFilter in the action', () => {
      expect(action.meta.resultFilter).to.equal(userResults)
    })

    it('has the correct resultKey in the action', () => {
      expect(action.meta.resultKey).to.equal('/settings/muted')
    })

    it('has the correct updateKey in the action', () => {
      expect(action.meta.updateKey).to.equal('/profile/muted')
    })
  })

  context('#exportData', () => {
    const action = subject.exportData()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.exportData)).to.be.true
    // })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile/export')
    })
  })

  context('#registerForGCM', () => {
    const action = subject.registerForGCM('123', '45666', 'marketing', 'v1.0')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct method in the action', () => {
      expect(action.payload.method).to.equal('POST')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/profile/push_subscriptions/gcm/123')
    })

    it('has the correct body in the action', () => {
      expect(action.payload.body).to.deep.equal({
        bundle_identifier: '45666',
        marketing_version: 'marketing',
        build_version: 'v1.0',
      })
    })
  })

  context('#requestPushSubscription', () => {
    const action = subject.requestPushSubscription('123', '45666', 'marketing', 'v1.0')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has the correct body in the action', () => {
      expect(action.payload).to.deep.equal({
        registrationId: '123',
        bundleId: '45666',
        marketingVersion: 'marketing',
        buildVersion: 'v1.0',
      })
    })
  })
})

