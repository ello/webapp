import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectPathname } from './routing'

// state.profile.xxx
export const selectAllowsAnalytics = state => get(state, 'profile.allowsAnalytics')
export const selectAnalyticsId = state => get(state, 'profile.analyticsId')
export const selectAvailability = state => get(state, 'profile.availability')
export const selectAvatar = state => get(state, 'profile.avatar')
export const selectBlockedCount = state => get(state, 'profile.blockedCount')
export const selectBuildVersion = state => get(state, 'profile.buildVersion')
export const selectBundleId = state => get(state, 'profile.bundleId')
export const selectCoverImage = state => get(state, 'profile.coverImage')
export const selectCreatedAt = state => get(state, 'profile.createdAt')
export const selectEmail = state => get(state, 'profile.email')
export const selectExternalLinksList = state => get(state, 'profile.externalLinksList', [])
export const selectHasAutoWatchEnabled = state => get(state, 'profile.hasAutoWatchEnabled')
export const selectHasAvatarPresent = state => get(state, 'profile.hasAvatarPresent', false)
export const selectHasCoverImagePresent = state => get(state, 'profile.hasCoverImagePresent', false)
export const selectId = state => state.getIn(['profile', 'id'])
export const selectIsPublic = state => get(state, 'profile.isPublic')
export const selectLocation = state => get(state, 'profile.location', '')
export const selectMarketingVersion = state => get(state, 'profile.marketingVersion')
export const selectMutedCount = state => get(state, 'profile.mutedCount')
export const selectName = state => get(state, 'profile.name', '')
export const selectRegistrationId = state => get(state, 'profile.registrationId')
export const selectShortBio = state => get(state, 'profile.shortBio', '')
export const selectUsername = state => get(state, 'profile.username')
export const selectViewsAdultContent = state => get(state, 'profile.viewsAdultContent')
export const selectWebOnboardingVersion = state => get(state, 'profile.webOnboardingVersion')

// Memoized selectors
export const selectIsAvatarBlank = createSelector(
  [selectHasAvatarPresent, selectAvatar], (hasAvatarPresent, avatar) => {
    // if we have a tmp we have an avatar locally
    if (avatar && avatar.tmp) { return false }
    return !hasAvatarPresent || !(avatar && (avatar.tmp || avatar.original))
  },
)

export const selectIsCoverImageBlank = createSelector(
  [selectHasCoverImagePresent, selectCoverImage], (hasCoverImagePresent, coverImage) => {
    // if we have a tmp we have a coverImage locally
    if (coverImage && coverImage.tmp) { return false }
    return !hasCoverImagePresent || !(coverImage && (coverImage.tmp || coverImage.original))
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
    const links = externalLinksList || ''
    if (typeof links === 'string') {
      return links
    }
    return links.map(link => link.text).join(', ')
  },
)

export const selectIsOwnPage = createSelector(
  [selectUsername, selectPathname], (username, pathname) => {
    const re = new RegExp(`/${username}$`)
    return re.test(pathname)
  },
)

