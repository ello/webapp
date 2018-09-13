import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { COMMENTS } from '../constants/mapping_types'
import { selectId as selectProfileId, selectIsStaff } from '../selectors/profile'
import { selectPosts, selectPost, selectPostLinks, selectPostCategories } from '../selectors/post'
import { selectUsers, selectUserCategories } from './user'

export const selectPropsCommentId = (state, props) =>
  get(props, 'commentId') || get(props, 'comment', Immutable.Map()).get('id')
export const selectPropsCommentIds = (state, props) => get(props, 'commentIds')

export const selectComments = state => state.json.get(COMMENTS, Immutable.Map())

// Memoized selectors

// Requires `commentId` or `comment` to be found in props
export const selectComment = createSelector(
  [selectPropsCommentId, selectComments], (id, comments) => comments.get(id, Immutable.Map()),
)

// Properties on the comments reducer
export const selectCommentAuthorId = createSelector([selectComment], comment => comment.get('authorId'))
export const selectCommentBody = createSelector([selectComment], comment => comment.get('body'))
export const selectCommentContent = createSelector([selectComment], comment => comment.get('content', Immutable.Map()))
export const selectCommentCreatedAt = createSelector([selectComment], comment => comment.get('createdAt'))
export const selectCommentOriginalPostId = createSelector([selectComment], comment => comment.get('originalPostId'))
export const selectCommentPostId = createSelector([selectComment], comment => comment.get('postId'))
export const selectCommentRepostId = createSelector([selectComment], comment => comment.get('repostId'))

// Derived or additive properties
export const selectCommentAuthor = createSelector(
  [selectUsers, selectCommentAuthorId], (users, authorId) =>
    users.get(authorId, Immutable.Map()),
)

export const selectCommentPost = createSelector(
  [selectPosts, selectCommentPostId], (posts, postId) => posts.get(postId, Immutable.Map()),
)

export const selectCommentPostCategories = (state, props) =>
  selectPostCategories(state, { postId: selectCommentPostId(state, props) })

export const selectCommentAuthorCategories = (state, props) =>
  selectUserCategories(state, { userId: selectCommentAuthorId(state, props) })

export const selectProps = (state, props) => props
export const selectState = state => state

export const selectCommentBadge = createSelector(
  [selectCommentAuthorCategories, selectCommentPostCategories, selectState, selectProps], (authorCategories, postCategories, state, props) => {
    const commentId = props.commentId
    const comment = state.json.getIn(['comments', props.commentId]).toJS()
    const postId = selectCommentPostId(state, props)
    const post = selectPost(state, props).toJS()
    const links = selectPostLinks(state, props).toJS()
    const postCategoryIds = state.json.getIn(['posts', postId, 'links', 'categories'], Immutable.Map()).toJS()
    const authorId = comment.authorId
    const categoryUsers = state.json.get('categoryUsers')
      .filter(cu => cu.get('userId') === authorId)
      .valueSeq()
      .toList()
      .toJS()
    if (authorId === '548729') {
      console.log('=============== comment.js at line 49 ===============');
      console.log({
        postId,
        post,
        links,
        postCategoryIds,
        props,
        commentId,
        comment,
        authorId,
        categoryUsers,
        authorCategories: authorCategories.toJS(),
        postCategories: postCategories.toJS(),
      })
    }
    return '' // authorCategories.get('')
  },
)

export const selectCommentPostAuthorId = createSelector(
  [selectCommentPost], post => post.get('authorId'),
)

export const selectCommentPostAuthor = createSelector(
  [selectUsers, selectCommentPostAuthorId], (users, authorId) =>
    users.get(authorId, Immutable.Map()),
)

export const selectCommentPostDetailPath = createSelector(
  [selectCommentPost, selectCommentPostAuthor], (post, author) =>
    `/${author.get('username')}/post/${post.get('token')}`,
)

export const selectCommentIsEditing = createSelector([selectComment], comment =>
  comment.get('isEditing', false),
)

export const selectCommentIsOwn = createSelector(
  [selectCommentAuthorId, selectProfileId], (authorId, profileId) =>
    `${authorId}` === `${profileId}`,
)

export const selectCommentIsOwnPost = createSelector(
  [selectCommentPostAuthorId, selectProfileId], (authorId, profileId) =>
    `${authorId}` === `${profileId}`,
)

export const selectCommentCanBeDeleted = createSelector(
  [selectCommentIsOwnPost, selectCommentPostId, selectCommentOriginalPostId,
    selectCommentRepostId, selectIsStaff],
  (isOwnPost, postId, originalPostId, repostId, isStaff) =>
    isStaff || (repostId ? (isOwnPost && postId === originalPostId) : isOwnPost),
)
