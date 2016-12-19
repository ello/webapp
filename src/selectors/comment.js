import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectId as selectProfileId } from './profile'
import { selectJson } from './store'
import * as MAPPING_TYPES from '../constants/mapping_types'

// props.comment.xxx
export const selectPropsComment = (state, props) => get(props, 'comment', Immutable.Map())
export const selectPropsCommentId = (state, props) => selectPropsComment(state, props).get('id')
export const selectPropsCommentAuthorId = (state, props) => selectPropsComment(state, props).get('authorId')

// Memoized selectors
export const selectIsOwnComment = createSelector(
  [selectPropsComment, selectPropsCommentAuthorId, selectProfileId],
  (comment, authorId, profileId) =>
    comment && `${authorId}` === `${profileId}`,
)

export const selectCommentFromPropsCommentId = createSelector(
  [selectJson, selectPropsCommentId], (json, commentId) =>
    json.getIn([MAPPING_TYPES.COMMENTS, commentId], null),
)

