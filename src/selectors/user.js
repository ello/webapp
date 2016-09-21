import { createSelector } from 'reselect'
import get from 'lodash/get'
import trunc from 'trunc-html'
import { selectParamsUsername } from './params'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'

const selectJson = state => get(state, 'json')

// props.user.xxx
export const selectPropsUser = (state, props) => get(props, 'user')
export const selectPropsUserId = (state, props) => get(props, 'userId') || get(props, 'user.id')

// state.json.users.xxx
export const selectUsers = state => get(state, 'json.users')

// Memoized selectors
export const selectUser = createSelector(
  [selectUsers, selectPropsUserId], (users, userId) =>
    users[userId]
)

export const selectUserFromPropsUserId = createSelector(
  [selectJson, selectPropsUserId], (json, userId) =>
    (userId ? json[MAPPING_TYPES.USERS][userId] : null)
)

export const selectUserFromUsername = createSelector(
  [selectJson, selectParamsUsername], (json, username) =>
    findModel(json, { collection: MAPPING_TYPES.USERS, findObj: { username } })
)

export const selectRelationshipPriority = createSelector(
  [selectUser], user => get(user, 'relationshipPriority')
)

export const selectUserMetaDescription = createSelector(
  [selectUserFromUsername], (user) => {
    if (!user) { return null }
    const nickname = user.name || `@${user.username}`
    const backupTitle = `See ${nickname}'s work on Ello.`
    return user.formattedShortBio ? trunc(user.formattedShortBio, 160).text : backupTitle
  }
)

export const selectUserMetaImage = createSelector(
  [selectUserFromUsername], user =>
    get(user, 'coverImage.optimized.url', null)
)

export const selectUserMetaRobots = createSelector(
  [selectUserFromUsername], (user) => {
    if (!user) { return null }
    return (user.badForSeo ? 'noindex, follow' : 'index, follow')
  }
)

export const selectUserMetaTitle = createSelector(
  [selectUserFromUsername], (user) => {
    if (!user) { return null }
    return (user.name ? `${user.name} (@${user.username}) | Ello` : `@${user.username} | Ello`)
  }
)

