import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { selectPathname } from './routing'

// state.profile.xxx
export const selectAllowsAnalytics = state => state.profile.get('allowsAnalytics')
export const selectAnalyticsId = state => state.profile.get('analyticsId')
export const selectAvailability = state => state.profile.get('availability')
export const selectAvatar = state => state.profile.get('avatar')
export const selectBlockedCount = state => state.profile.get('blockedCount')
export const selectBuildVersion = state => state.profile.get('buildVersion')
export const selectBundleId = state => state.profile.get('bundleId')
export const selectCoverImage = state => state.profile.get('coverImage')
export const selectCreatedAt = state => state.profile.get('createdAt')
export const selectEmail = state => state.profile.get('email')
export const selectExternalLinksList = state => state.profile.get('externalLinksList', Immutable.List())
export const selectHasAutoWatchEnabled = state => state.profile.get('hasAutoWatchEnabled')
export const selectHasAvatarPresent = state => state.profile.get('hasAvatarPresent', false)
export const selectHasCoverImagePresent = state => state.profile.get('hasCoverImagePresent', false)
export const selectId = state => state.profile.get('id')
export const selectIsPublic = state => state.profile.get('isPublic')
export const selectLocation = state => state.profile.get('location', '')
export const selectMarketingVersion = state => state.profile.get('marketingVersion')
export const selectMutedCount = state => state.profile.get('mutedCount')
export const selectName = state => state.profile.get('name', '')
export const selectRegistrationId = state => state.profile.get('registrationId')
export const selectShortBio = state => state.profile.get('shortBio', '')
export const selectUsername = state => state.profile.get('username')
export const selectViewsAdultContent = state => state.profile.get('viewsAdultContent')
export const selectWebOnboardingVersion = state => state.profile.get('webOnboardingVersion')

// Memoized selectors
export const selectIsAvatarBlank = createSelector(
  [selectHasAvatarPresent, selectAvatar], (hasAvatarPresent, avatar) => {
    // if we have a tmp we have an avatar locally
    if (avatar && avatar.get('tmp')) { return false }
    return !hasAvatarPresent || !(avatar && (avatar.get('tmp') || avatar.get('original')))
  },
)

export const selectIsCoverImageBlank = createSelector(
  [selectHasCoverImagePresent, selectCoverImage], (hasCoverImagePresent, coverImage) => {
    // if we have a tmp we have a coverImage locally
    if (coverImage && coverImage.get('tmp')) { return false }
    return !hasCoverImagePresent || !(coverImage && (coverImage.get('tmp') || coverImage.get('original')))
  },
)

export const selectIsInfoFormBlank = createSelector(
  [selectExternalLinksList, selectName, selectShortBio], (externalLinksList, name, shortBio) => {
    const hasLinks = externalLinksList && externalLinksList.length
    const hasName = name && name.length
    const hasShortBio = shortBio && shortBio.length
    return !hasLinks && !hasName && !hasShortBio
  },
)

export const selectLinksAsText = createSelector(
  [selectExternalLinksList], (externalLinksList) => {
    const links = externalLinksList.size ? externalLinksList : ''
    if (typeof links === 'string') {
      return links
    }
    return links.map(link => link.get('text')).join(', ')
  },
)

export const selectIsOwnPage = createSelector(
  [selectUsername, selectPathname], (username, pathname) => {
    const re = new RegExp(`/${username}$`)
    return re.test(pathname)
  },
)

