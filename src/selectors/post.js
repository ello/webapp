import { createSelector } from 'reselect'
import get from 'lodash/get'
import trunc from 'trunc-html'
import { selectParamsToken } from './params'
import { selectId as selectProfileId } from './profile'
import { findModel } from '../helpers/json_helper'
import * as MAPPING_TYPES from '../constants/mapping_types'

const selectJson = state => get(state, 'json')

// props.post.xxx
export const selectPropsPost = (state, props) => get(props, 'post')
export const selectPropsPostId = (state, props) => get(props, 'post.id')
export const selectPropsPostToken = (state, props) => get(props, 'post.token')
export const selectPropsPostAuthorId = (state, props) => get(props, 'post.authorId')

// Memoized selectors
export const selectIsOwnPost = createSelector(
  [selectPropsPost, selectPropsPostAuthorId, selectProfileId], (post, authorId, profileId) =>
    post && `${authorId}` === `${profileId}`
)

export const selectPostFromPropsPostId = createSelector(
  [selectJson, selectPropsPostId], (json, postId) =>
    (postId ? json[MAPPING_TYPES.POSTS][postId] : null)
)

export const selectPostFromToken = createSelector(
  [selectJson, selectParamsToken], (json, token) =>
    findModel(json, { collection: MAPPING_TYPES.POSTS, findObj: { token } })
)

export const selectAuthorFromPost = createSelector(
  [selectJson, selectPostFromToken], (json, post) =>
    (post ? json[MAPPING_TYPES.USERS][post.authorId] : null)
)

export const selectPostBlocks = createSelector(
  [selectPostFromToken], (post) => {
    if (!post) { return null }
    return (post.repostContent || post.content) || post.summary
  }
)

export const selectPostEmbedContent = createSelector(
  [selectPostBlocks], (blocks) => {
    if (!blocks) { return [] }
    const embedUrls = []
    for (const block of blocks) {
      if (/embed/.test(block.kind) && block.data && block.data.thumbnailLargeUrl) {
        embedUrls.push(block.data.thumbnailLargeUrl)
      }
    }
    return embedUrls
  }
)

export const selectPostImageContent = createSelector(
  [selectPostBlocks], (blocks) => {
    if (!blocks) { return [] }
    const imageUrls = []
    for (const block of blocks) {
      if (/image/.test(block.kind) && block.data && block.data.url) {
        imageUrls.push(block.data.url)
      }
    }
    return imageUrls
  }
)

export const selectPostImageAndEmbedContent = createSelector(
  [selectPostEmbedContent, selectPostImageContent], (embeds, images) =>
    images.concat(embeds)
)

export const selectPostTextContent = createSelector(
  [selectPostBlocks], (blocks) => {
    if (!blocks) { return null }
    let text = ''
    for (const block of blocks) {
      if (/text/.test(block.kind)) {
        text += block.data
      }
    }
    return text.length ? trunc(text, 200).text : ''
  }
)

export const selectPostMetaDescription = createSelector(
  [selectPostTextContent], (text) =>
    (text && text.length ? text : 'Discover more amazing work like this on Ello.')
)

export const selectPostMetaRobots = createSelector(
  [selectAuthorFromPost], (author) => {
    if (!author) { return null }
    return (author.badForSeo ? 'noindex, follow' : 'index, follow')
  }
)

export const selectPostMetaTitle = createSelector(
  [selectPostTextContent, selectAuthorFromPost], (text, author) => {
    if (!author) { return null }
    if (text && text.length) {
      const paragraphs = text.split('\n')
      const title = paragraphs[0].split('.')[0]
      if (title && title.length) {
        return `${title} - from @${author.username} on Ello.`
      }
    }
    return `A post from @${author.username} on Ello.`
  }
)

export const selectPostMetaUrl = createSelector(
  [selectPostFromToken, selectAuthorFromPost], (post, author) => {
    if (!post || !author) { return null }
    return `${ENV.AUTH_DOMAIN}/${author.username}/post/${post.token}`
  }
)

export const selectPostMetaCanonicalUrl = createSelector(
  [selectPostFromToken], (post) => {
    if (!post) { return null }
    return (
      post.repostContent ? `${ENV.AUTH_DOMAIN}${post.repostPath}` : null
    )
  }
)

export const selectPostMetaImages = createSelector(
  [selectPostImageAndEmbedContent], (images) => {
    const openGraphImages = images.map(image => ({ property: 'og:image', content: image }))
    const schemaImages = images.map(image => ({ name: 'image', itemprop: 'image', content: image }))
    return { openGraphImages, schemaImages }
  }
)

