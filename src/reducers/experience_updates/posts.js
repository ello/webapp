/* eslint-disable no-param-reassign */
import _ from 'lodash'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as jsonReducer from '../../reducers/json'

const methods = {}

methods.updatePostLoves = (state, newState, action) => {
  const { method, model } = action.payload

  const newPost = {
    id: model ? model.id : '',
  }

  let delta = 0
  let idAdded = false
  switch (action.type) {
    case ACTION_TYPES.POST.LOVE_REQUEST:
      if (method === 'POST') {
        delta = 1
        newPost.loved = true
      } else {
        delta = -1
        newPost.loved = false
      }
      break
    case ACTION_TYPES.POST.LOVE_SUCCESS:
      if (method === 'POST') {
        newPost.showLovers = true
        idAdded = true
      } else {
        newPost.showLovers = false
      }
      break
    case ACTION_TYPES.POST.LOVE_FAILURE:
      if (method === 'POST') {
        delta = -1
        newPost.loved = false
      } else {
        delta = 1
        newPost.loved = true
        idAdded = true
      }
      break
    default:
      return state
  }

  // since we pull `model` out of payload, not state, we don't want to set
  // or update the lovesCount during a LOVE_SUCCESS.
  //
  // During LOVE_REQUEST, model.lovesCount is incremented.
  // In LOVE_SUCCESS, model.lovesCount is the *old* value, so just ignore it.
  if (delta !== 0) {
    newPost.lovesCount = Number(model.lovesCount) + delta
  }

  const resultPath = jsonReducer.methods.pagesKey(action)
  const currentUser = jsonReducer.methods.getCurrentUser(newState)
  if (currentUser) {
    if (idAdded) {
      jsonReducer.methods.appendPageId(
        newState, resultPath,
        MAPPING_TYPES.USERS, currentUser.id)
    } else {
      jsonReducer.methods.removePageId(
        newState, resultPath,
        currentUser.id)
    }
  }

  if (currentUser.id === model.authorId) {
    jsonReducer.methods.updateUserCount(newState, model.authorId, 'lovesCount', delta)
  }
  jsonReducer.methods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    newPost
  )

  return newState
}

methods.updatePostWatch = (state, newState, action) => {
  const { method, model } = action.payload
  const newPost = {
    id: model ? model.id : '',
    watching: method === 'POST',
  }
  if (action.type === ACTION_TYPES.POST.WATCH_FAILURE) {
    if (method === 'POST') {
      newPost.watching = false
    } else {
      newPost.watching = true
    }
  }
  jsonReducer.methods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    newPost
  )
  return newState
}

methods.addOrUpdatePost = (newState, action) => {
  const { model, response } = action.payload
  const user = model ?
    newState[MAPPING_TYPES.USERS][model.authorId] :
    jsonReducer.methods.getCurrentUser(newState)
  switch (action.type) {
    case ACTION_TYPES.POST.CREATE_SUCCESS:
    case ACTION_TYPES.POST.UPDATE_SUCCESS:
      _.setWith(newState,
                [MAPPING_TYPES.POSTS, response[MAPPING_TYPES.POSTS].id],
                response[MAPPING_TYPES.POSTS],
                Object)
      if (action.type === ACTION_TYPES.POST.UPDATE_SUCCESS) { return newState }
      jsonReducer.methods.appendPageId(
        newState, '/following',
        MAPPING_TYPES.POSTS, response[MAPPING_TYPES.POSTS].id, false)

      if (action.meta.repostId) {
        jsonReducer.methods.updatePostCount(newState, action.meta.repostId, 'repostsCount', 1)
        jsonReducer.methods.appendPageId(
          newState, `/posts/${action.meta.repostId}/repost`,
          MAPPING_TYPES.USERS, user.id)
        jsonReducer.methods.mergeModel(
          newState,
          MAPPING_TYPES.POSTS,
          { id: action.meta.repostId, reposted: true }
        )
      }
      if (action.meta.repostedFromId) {
        jsonReducer.methods.updatePostCount(newState, action.meta.repostedFromId, 'repostsCount', 1)
        jsonReducer.methods.appendPageId(
          newState, `/posts/${action.meta.repostedFromId}/repost`,
          MAPPING_TYPES.USERS, user.id)
        jsonReducer.methods.mergeModel(
          newState,
          MAPPING_TYPES.POSTS,
          { id: action.meta.repostedFromId, reposted: true }
        )
      }
      if (user) {
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', 1)
        jsonReducer.methods.appendPageId(
          newState, `/${user.username}`,
          MAPPING_TYPES.POSTS, response[MAPPING_TYPES.POSTS].id, false)
      }
      return newState
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      if (user) {
        jsonReducer.methods.removePageId(newState, '/following', model.id)
        jsonReducer.methods.removePageId(newState, `/${user.username}`, model.id)
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', -1)
      }
      return newState
    case ACTION_TYPES.POST.CREATE_FAILURE:
      if (user) {
        jsonReducer.methods.updateUserCount(newState, user.id, 'postsCount', -1)
      }
      return newState
    default:
      return newState
  }
}

methods.toggleComments = (newState, action) => {
  const { model, showComments } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showComments = showComments
  return newState
}

methods.toggleEditing = (newState, action) => {
  const { model, isEditing } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isEditing = isEditing
  return newState
}

methods.toggleLovers = (newState, action) => {
  const { model, showLovers } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showLovers = showLovers
  return newState
}

methods.toggleReposting = (newState, action) => {
  const { model, isReposting } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].isReposting = isReposting
  return newState
}

methods.toggleReposters = (newState, action) => {
  const { model, showReposters } = action.payload
  newState[MAPPING_TYPES.POSTS][model.id].showReposters = showReposters
  return newState
}

export default methods

