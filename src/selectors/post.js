import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectParamsToken } from './params'
import { selectId as selectProfileId } from './profile'
import { selectJson } from './store'
import { findModel } from '../helpers/json_helper'
import * as MAPPING_TYPES from '../constants/mapping_types'

// props.post.xxx
export const selectPropsPost = (state, props) => get(props, 'post', Immutable.Map())
export const selectPropsPostId = (state, props) => selectPropsPost(state, props).get('id')
export const selectPropsPostToken = (state, props) => selectPropsPost(state, props).get('token')
export const selectPropsPostAuthorId = (state, props) => selectPropsPost(state, props).get('authorId')
export const selectPropsRepostAuthorId = (state, props) => selectPropsPost(state, props).getIn(['links', 'repostAuthor', 'id'])

// Memoized selectors
export const selectIsOwnOriginalPost = createSelector(
  [selectPropsPost, selectPropsRepostAuthorId, selectProfileId],
  (post, repostAuthorId, profileId) =>
    post && `${repostAuthorId}` === `${profileId}`,
)

export const selectIsOwnPost = createSelector(
  [selectPropsPost, selectPropsPostAuthorId, selectProfileId], (post, authorId, profileId) =>
    post && `${authorId}` === `${profileId}`,
)

export const selectPostFromPropsPostId = createSelector(
  [selectJson, selectPropsPostId], (json, postId) =>
    json.getIn([MAPPING_TYPES.POSTS, postId], Immutable.Map()),
)

export const selectPostFromToken = createSelector(
  [selectJson, selectParamsToken], (json, token) =>
    findModel(json, { collection: MAPPING_TYPES.POSTS, findObj: { token } }) || Immutable.Map(),
)

export const selectPostMetaAttributes = createSelector(
  [selectPostFromToken], post => post.get('metaAttributes'),
)

export const selectPostMetaDescription = createSelector(
  [selectPostMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('description') : null),
)

export const selectPostMetaRobots = createSelector(
  [selectPostMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('robots') : null),
)

export const selectPostMetaTitle = createSelector(
  [selectPostMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('title') : null),
)

export const selectPostMetaUrl = createSelector(
  [selectPostMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('url') : null),
)

export const selectPostMetaCanonicalUrl = createSelector(
  [selectPostMetaAttributes], metaAttributes =>
    (metaAttributes ? metaAttributes.get('canonicalUrl') : null),
)

export const selectPostMetaImages = createSelector(
  [selectPostMetaAttributes], (metaAttributes) => {
    if (!metaAttributes) { return null }
    const images = metaAttributes.get('images') ? metaAttributes.get('images').toArray() : []
    const openGraphImages = images.map(image => ({ property: 'og:image', content: image }))
    const schemaImages = images.map(image => ({ name: 'image', itemprop: 'image', content: image }))
    return { openGraphImages, schemaImages }
  },
)

