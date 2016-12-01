import Immutable from 'immutable'
import { clearJSON, json, stubUser } from '../../support/stubs'
import {
  selectAllowsAnalytics,
  selectAnalyticsId,
  selectAvailability,
  selectAvatar,
  selectBlockedCount,
  selectBuildVersion,
  selectBundleId,
  selectCoverImage,
  selectCreatedAt,
  selectEmail,
  selectExternalLinksList,
  selectHasAvatarPresent,
  selectHasCoverImagePresent,
  selectId,
  selectIsAvatarBlank,
  selectIsCoverImageBlank,
  selectIsInfoFormBlank,
  selectIsPublic,
  selectLinksAsText,
  selectMarketingVersion,
  selectMutedCount,
  selectName,
  selectRegistrationId,
  selectShortBio,
  selectUsername,
  selectWebOnboardingVersion,
} from '../../../src/selectors/profile'

describe('profile selectors', () => {
  let state
  beforeEach(() => {
    const profile = stubUser({
      allowsAnalytics: true,
      analyticsId: 'analyticsId',
      availability: true,
      blockedCount: 5,
      buildVersion: 'buildVersion',
      bundleId: 'bundleId',
      hasAvatarPresent: true,
      hasCoverImagePresent: true,
      isPublic: true,
      marketingVersion: '1',
      mutedCount: 10,
      registrationId: '1234',
      webOnboardingVersion: '1',
    })
    state = Immutable.fromJS({ json, profile })
  })

  afterEach(() => {
    clearJSON()
  })

  context('#selectAllowsAnalytics', () => {
    it('returns the profile.allowsAnalytics', () => {
      expect(selectAllowsAnalytics(state)).to.equal(true)
    })
  })

  context('#selectAnalyticsId', () => {
    it('returns the profile.analyticsId', () => {
      expect(selectAnalyticsId(state)).to.equal('analyticsId')
    })
  })

  context('#selectAvailability', () => {
    it('returns the profile.availability', () => {
      expect(selectAvailability(state)).to.equal(true)
    })
  })

  context('#selectAvatar', () => {
    it('returns the profile.avatar', () => {
      expect(selectAvatar(state)).to.deep.equal(state.getIn(['profile', 'avatar']))
    })
  })

  context('#selectBlockedCount', () => {
    it('returns the profile.blockedCount', () => {
      expect(selectBlockedCount(state)).to.deep.equal(state.getIn(['profile', 'blockedCount']))
    })
  })

  context('#selectBuildVersion', () => {
    it('returns the profile.buildVersion', () => {
      expect(selectBuildVersion(state)).to.deep.equal(state.getIn(['profile', 'buildVersion']))
    })
  })

  context('#selectBundleId', () => {
    it('returns the profile.bundleId', () => {
      expect(selectBundleId(state)).to.deep.equal(state.getIn(['profile', 'bundleId']))
    })
  })

  context('#selectCoverImage', () => {
    it('returns the profile.coverImage', () => {
      expect(selectCoverImage(state)).to.deep.equal(state.getIn(['profile', 'coverImage']))
    })
  })

  context('#selectCreatedAt', () => {
    it('returns the profile.createdAt', () => {
      expect(selectCreatedAt(state)).to.deep.equal(state.getIn(['profile', 'createdAt']))
    })
  })

  context('#selectEmail', () => {
    it('returns the profile.email', () => {
      expect(selectEmail(state)).to.deep.equal(state.getIn(['profile', 'email']))
    })
  })

  context('#selectExternalLinksList', () => {
    it('returns the profile.externalLinksList', () => {
      expect(selectExternalLinksList(state)).to.deep.equal(state.getIn(['profile', 'externalLinksList']))
    })
  })

  context('#selectHasAvatarPresent', () => {
    it('returns the profile.hasAvatarPresent', () => {
      expect(selectHasAvatarPresent(state)).to.deep.equal(state.getIn(['profile', 'hasAvatarPresent']))
    })
  })

  context('#selectHasCoverImagePresent', () => {
    it('returns the profile.hasCoverImagePresent', () => {
      expect(selectHasCoverImagePresent(state)).to.deep.equal(state.getIn(['profile', 'hasCoverImagePresent']))
    })
  })

  context('#selectId', () => {
    it('returns the profile.id', () => {
      expect(selectId(state)).to.deep.equal(state.getIn(['profile', 'id']))
    })
  })

  context('#selectIsPublic', () => {
    it('returns the profile.isPublic', () => {
      expect(selectIsPublic(state)).to.deep.equal(state.getIn(['profile', 'isPublic']))
    })
  })

  context('#selectMarketingVersion', () => {
    it('returns the profile.marketingVersion', () => {
      expect(selectMarketingVersion(state)).to.deep.equal(state.getIn(['profile', 'marketingVersion']))
    })
  })

  context('#selectMutedCount', () => {
    it('returns the profile.mutedCount', () => {
      expect(selectMutedCount(state)).to.deep.equal(state.getIn(['profile', 'mutedCount']))
    })
  })

  context('#selectName', () => {
    it('returns the profile.name', () => {
      expect(selectName(state)).to.equal(state.getIn(['profile', 'name']))
    })
  })

  context('#selectRegistrationId', () => {
    it('returns the profile.registrationId', () => {
      expect(selectRegistrationId(state)).to.deep.equal(state.getIn(['profile', 'registrationId']))
    })
  })

  context('#selectShortBio', () => {
    it('returns the profile.shortBio', () => {
      expect(selectShortBio(state)).to.deep.equal(state.getIn(['profile', 'shortBio']))
    })
  })

  context('#selectUsername', () => {
    it('returns the profile.username', () => {
      expect(selectUsername(state)).to.deep.equal(state.getIn(['profile', 'username']))
    })
  })

  context('#selectWebOnboardingVersion', () => {
    it('returns the profile.webOnboardingVersion', () => {
      expect(selectWebOnboardingVersion(state)).to.deep.equal(state.getIn(['profile', 'webOnboardingVersion']))
    })
  })

  context('#selectIsAvatarBlank', () => {
    it('returns a memoized version of a blank avatar', () => {
      expect(selectIsAvatarBlank(state)).to.equal(false)
      state = state.set('change', 1)
      expect(selectIsAvatarBlank(state)).to.equal(false)
      expect(selectIsAvatarBlank.recomputations()).to.equal(1)
    })
  })

  context('#selectIsCoverImageBlank', () => {
    it('returns a memoized version of a blank coverImage', () => {
      expect(selectIsCoverImageBlank(state)).to.equal(false)
      state = state.set('change', 1)
      expect(selectIsCoverImageBlank(state)).to.equal(false)
      expect(selectIsCoverImageBlank.recomputations()).to.equal(1)
    })
  })

  context('#selectIsInfoFormBlank', () => {
    it('returns a memoized version of a blank info form', () => {
      expect(selectIsInfoFormBlank(state)).to.equal(false)
      state = state.set('change', 1)
      expect(selectIsInfoFormBlank(state)).to.equal(false)
      expect(selectIsInfoFormBlank.recomputations()).to.equal(1)
    })
  })

  context('#selectLinksAsText', () => {
    it('returns a memoized version of links text', () => {
      expect(selectLinksAsText(state)).to.deep.equal('google.com')
      state = state.set('change', 1)
      expect(selectLinksAsText(state)).to.deep.equal('google.com')
      expect(selectLinksAsText.recomputations()).to.equal(1)
    })
  })
})

