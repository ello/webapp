import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { selectPosts, selectPropsPostId, selectPropsPostIds } from './post'
import { selectComments, selectPropsCommentIds } from './comment'
import { selectArtistInviteSubmissions, selectPropsSubmissionIds } from './artist_invites'

/* eslint-disable import/prefer-default-export */

// Requires `postIds`, `postId`, `commentIds`, or `submissionIds` to be found in props
// returns a [`postId`, `assetId`] array pair inside a larger array
export const selectPostsAssetIds = createSelector(
  [
    selectPropsPostIds,
    selectPropsPostId,
    selectPosts,
    selectPropsCommentIds,
    selectComments,
    selectPropsSubmissionIds,
    selectArtistInviteSubmissions,
  ],
  (
    propsPostIds,
    singlePostId,
    posts,
    propsCommentIds,
    comments,
    propsSubmissionIds,
    submissions,
  ) => {
    // standard posts stream
    let postIds = propsPostIds
    let postsToMap = posts

    // single post
    if (!postIds && singlePostId) {
      postIds = []
      postIds.push(singlePostId)
    }

    // comments stream
    if (!postIds && propsCommentIds) {
      postsToMap = comments
      postIds = propsCommentIds
    }

    // artist invites stream
    // need to retrieve actual posts Ids from submissions
    // submissions have no post content, so we still use `posts` as `postsToMap`
    if (!postIds && propsSubmissionIds) {
      postIds = []
      propsSubmissionIds.map((submissionId) => {
        const submission = submissions.get(submissionId, Immutable.Map())
        if (submission) {
          return postIds.push(submission.getIn(['links', 'post', 'id']))
        }
        return null
      })
    }

    // iterate posts in state and return associated assetIds as array
    const combinedPostsAssetIds = []
    postIds.map((postId) => {
      const post = postsToMap.get(postId, Immutable.Map())
      const postContent = post.get('content')
      const postRepostContent = post.get('repostContent')

      // accomodate reposts (if available)
      // retrieve repost `postId` + original post `assetId` pairing
      if (postRepostContent) {
        postRepostContent.map((region) => {
          const assetId = region.getIn(['links', 'assets'])
          if (assetId) {
            return combinedPostsAssetIds.push([postId, assetId])
          }
          return null
        })
      }

      // retrieve `postId` + `assetId` pairing
      postContent.map((region) => {
        const assetId = region.getIn(['links', 'assets'])
        if (assetId) {
          return combinedPostsAssetIds.push([postId, assetId])
        }
        return null
      })

      return combinedPostsAssetIds
    })

    return combinedPostsAssetIds
  },
)