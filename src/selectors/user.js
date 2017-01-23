import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import trunc from 'trunc-html'
import { selectParamsUsername } from './params'
import { selectJson } from './store'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'

// props.user.xxx
export const selectPropsUser = (state, props) => get(props, 'user')
export const selectPropsUserId = (state, props) => get(props, 'userId') || get(props, 'user').get('id')

// state.json.users.xxx
export const selectUsers = state => state.json.get('users')

// Memoized selectors
export const selectUser = createSelector(
  [selectUsers, selectPropsUserId], (users, userId) =>
    (users ? users.get(`${userId}`, Immutable.Map()) : Immutable.Map()),
)

export const selectUserFromPropsUserId = createSelector(
  [selectJson, selectPropsUserId], (json, userId) =>
    json.getIn([MAPPING_TYPES.USERS, userId], null),
)

export const selectUserFromUsername = createSelector(
  [selectJson, selectParamsUsername], (json, username) =>
    findModel(json, { collection: MAPPING_TYPES.USERS, findObj: { username } }) || Immutable.Map(),
)

export const selectRelationshipPriority = createSelector(
  [selectUser], user => user.get('relationshipPriority'),
)

export const selectTruncatedShortBio = createSelector(
  [selectUserFromPropsUserId], user =>
    trunc(user ? user.get('formattedShortBio') || '' : '', 160, { sanitizer:
      { allowedAttributes: { img: ['align', 'alt', 'class', 'height', 'src', 'width'] } },
    }),
)

export const selectUserMetaAttributes = createSelector(
  [selectUserFromUsername], user => user.get('metaAttributes'),
)

export const selectUserMetaDescription = createSelector(
  [selectUserMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('description') : null),
)

export const selectUserMetaImage = createSelector(
  [selectUserMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('image') : null),
)

export const selectUserMetaRobots = createSelector(
  [selectUserMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('robots') : null),
)

export const selectUserMetaTitle = createSelector(
  [selectUserMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('title') : null),
)

