import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { selectPathname } from './routing'

// state.profile.xxx
export const selectAllowsAnalytics = state => state.getIn(['profile', 'allowsAnalytics'])
export const selectAnalyticsId = state => state.getIn(['profile', 'analyticsId'])
export const selectAvailability = state => state.getIn(['profile', 'availability'])
export const selectAvatar = state => state.getIn(['profile', 'avatar'])
export const selectBlockedCount = state => state.getIn(['profile', 'blockedCount'])
export const selectBuildVersion = state => state.getIn(['profile', 'buildVersion'])
export const selectBundleId = state => state.getIn(['profile', 'bundleId'])
export const selectCoverImage = state => state.getIn(['profile', 'coverImage'])
export const selectCreatedAt = state => state.getIn(['profile', 'createdAt'])
export const selectEmail = state => state.getIn(['profile', 'email'])
export const selectExternalLinksList = state => state.getIn(['profile', 'externalLinksList'], Immutable.List())
export const selectHasAutoWatchEnabled = state => state.getIn(['profile', 'hasAutoWatchEnabled'])
export const selectHasAvatarPresent = state => state.getIn(['profile', 'hasAvatarPresent'], false)
export const selectHasCoverImagePresent = state => state.getIn(['profile', 'hasCoverImagePresent'], false)
export const selectId = state => state.getIn(['profile', 'id'])
export const selectIsPublic = state => state.getIn(['profile', 'isPublic'])
export const selectLocation = state => state.getIn(['profile', 'location'], '')
export const selectMarketingVersion = state => state.getIn(['profile', 'marketingVersion'])
export const selectMutedCount = state => state.getIn(['profile', 'mutedCount'])
export const selectName = state => state.getIn(['profile', 'name'], '')
export const selectRegistrationId = state => state.getIn(['profile', 'registrationId'])
export const selectShortBio = state => state.getIn(['profile', 'shortBio'], '')
export const selectUsername = state => state.getIn(['profile', 'username'])
export const selectViewsAdultContent = state => state.getIn(['profile', 'viewsAdultContent'])
export const selectWebOnboardingVersion = state => state.getIn(['profile', 'webOnboardingVersion'])

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
    const links = externalLinksList || ''
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

