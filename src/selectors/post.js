import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import trunc from 'trunc-html'
import { selectParamsToken } from './params'
import { selectId as selectProfileId } from './profile'
import { selectJson } from './store'
import { findModel } from '../helpers/json_helper'
import * as MAPPING_TYPES from '../constants/mapping_types'

// props.post.xxx
export const selectPropsPost = (state, props) => get(props, 'post')
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

export const selectAuthorFromPost = createSelector(
  [selectJson, selectPostFromToken], (json, post) =>
    (post ? json.getIn([MAPPING_TYPES.USERS, post.get('authorId')], Immutable.Map()) : null),
)

export const selectPostBlocks = createSelector(
  [selectPostFromToken], (post) => {
    if (!post) { return null }
    return (post.get('repostContent') || post.get('content')) || post.get('summary')
  },
)

export const selectPostEmbedContent = createSelector(
  [selectPostBlocks], (blocks) => {
    if (!blocks) { return Immutable.List() }
    return blocks.filter(block => /embed/.test(block.get('kind')) && block.getIn(['data', 'thumbnailLargeUrl']))
      .map(block => block.getIn(['data', 'thumbnailLargeUrl']))
  },
)

export const selectPostImageContent = createSelector(
  [selectPostBlocks], (blocks) => {
    if (!blocks) { return Immutable.List() }
    return blocks.filter(block => /image/.test(block.get('kind')) && block.getIn(['data', 'url']))
      .map(block => block.getIn(['data', 'url']))
  },
)

export const selectPostImageAndEmbedContent = createSelector(
  [selectPostEmbedContent, selectPostImageContent], (embeds, images) =>
    images.concat(embeds),
)

export const selectPostTextContent = createSelector(
  [selectPostBlocks], (blocks) => {
    if (!blocks) { return null }
    const text = blocks.map(block => (/text/.test(block.get('kind')) ? block.get('data') : '')).join('')
    return text.length ? trunc(text, 200).text : ''
  },
)

export const selectPostMetaDescription = createSelector(
  [selectPostTextContent], text =>
    (text && text.length ? text : 'Discover more amazing work like this on Ello.'),
)

export const selectPostMetaRobots = createSelector(
  [selectAuthorFromPost], (author) => {
    if (!author) { return null }
    return (author.get('badForSeo') ? 'noindex, follow' : 'index, follow')
  },
)

export const selectPostMetaTitle = createSelector(
  [selectPostTextContent, selectAuthorFromPost], (text, author) => {
    if (!author) { return null }
    if (text && text.length) {
      const paragraphs = text.split('\n')
      const title = paragraphs[0].split('.')[0]
      if (title && title.length) {
        return `${title} - from @${author.get('username')} on Ello.`
      }
    }
    return `A post from @${author.get('username')} on Ello.`
  },
)

export const selectPostMetaUrl = createSelector(
  [selectPostFromToken, selectAuthorFromPost], (post, author) => {
    if (!post || !author) { return null }
    return `${ENV.AUTH_DOMAIN}/${author.get('username')}/post/${post.get('token')}`
  },
)

export const selectPostMetaCanonicalUrl = createSelector(
  [selectPostFromToken], (post) => {
    if (!post) { return null }
    return (
      post.get('repostContent') ? `${ENV.AUTH_DOMAIN}${post.get('repostPath')}` : null
    )
  },
)

export const selectPostMetaImages = createSelector(
  [selectPostImageAndEmbedContent], (images) => {
    const openGraphImages = images.toArray().map(image => ({ property: 'og:image', content: image }))
    const schemaImages = images.toArray().map(image => ({ name: 'image', itemprop: 'image', content: image }))
    return { openGraphImages, schemaImages }
  },
)

