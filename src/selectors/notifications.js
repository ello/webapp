import Immutable from 'immutable'
import { createSelector } from 'reselect'

export const selectAnnouncementCollection = state => state.json.get('announcements', Immutable.Map())

export const selectAnnouncement = createSelector(
  [selectAnnouncementCollection], collection =>
    collection.first() || Immutable.Map(),
)

export const selectIsAnnouncementUnread = createSelector(
  [selectAnnouncementCollection], collection => Boolean(collection && Object.keys(collection)[0]),
)

