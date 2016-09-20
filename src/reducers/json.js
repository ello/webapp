/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { LOCATION_CHANGE } from 'react-router-redux'
import { REHYDRATE } from 'redux-persist/constants'
import { get, isEqual, merge, setWith, union, uniq, values } from 'lodash'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../constants/relationship_types'
import { findModel } from '../helpers/json_helper'
import commentMethods from './experience_updates/comments'
import postMethods from './experience_updates/posts'
import relationshipMethods from './experience_updates/relationships'
import { emptyPagination } from '../components/streams/Paginator'

// adding methods and accessing them from this object
// allows the unit tests to stub methods in this module
const methods = {}
let path = '/'
let hasLoadedFirstStream = false

methods.updateUserCount = (newState, userId, prop, delta) => {
  const count = newState[MAPPING_TYPES.USERS][userId][prop] || 0
  if (count === '∞') { return newState }

  const obj = { id: userId }
  obj[prop] = parseInt(count, 10) + delta
  return methods.mergeModel(
    newState,
    MAPPING_TYPES.USERS,
    obj,
  )
}

methods.updatePostCount = (newState, postId, prop, delta) => {
  const count = newState[MAPPING_TYPES.POSTS][postId][prop] || 0
  if (count === '∞') { return newState }

  const obj = { id: postId }
  obj[prop] = parseInt(count, 10) + delta
  return methods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    obj,
  )
}

methods.appendPageId = (newState, pageName, mappingType, id, addNewResult = true) => {
  let page = get(newState, ['pages', pageName])
  if (page) {
    const ids = get(page, 'ids', [])
    if (ids.indexOf(`${id}`) === -1) {
      ids.unshift(`${id}`)
      page.ids = ids
    }
  } else if (addNewResult) {
    page = {
      ids: [`${id}`], type: mappingType, pagination: emptyPagination(),
    }
  }
  setWith(newState, ['pages', pageName], page, Object)
  return newState
}

methods.removePageId = (newState, pageName, id) => {
  const existingIds = get(newState, ['pages', pageName, 'ids'])
  if (existingIds) {
    const index = existingIds.indexOf(`${id}`)
    if (index !== -1) {
      existingIds.splice(index, 1)
    }
    setWith(newState, ['pages', pageName, 'ids'], existingIds, Object)
  }
  return newState
}

methods.getCurrentUser = (state) => {
  let currentUser = null
  values(state[MAPPING_TYPES.USERS]).forEach((user) => {
    if (user.relationshipPriority === RELATIONSHIP_PRIORITY.SELF) {
      currentUser = user
    }
  })
  return currentUser
}

methods.mergeModel = (state, type, params) => {
  if (params.id) {
    // make the model's id a string for later comparisons
    // sometimes the API sends them back as a number
    params.id = `${params.id}`
    state[type][params.id] = merge(state[type][params.id], params)
  }
  return state
}

methods.findPostFromIdOrToken = (state, postIdOrToken) => {
  const id = parseInt(postIdOrToken, 10)
  return id > 0 ?
    state[MAPPING_TYPES.POSTS][id] :
    findModel(state, {
      collection: MAPPING_TYPES.POSTS,
      findObj: { token: postIdOrToken },
    })
}

methods.addParentPostIdToComments = (state, action) => {
  // Kludge to abort for some tests
  const mappingType = get(action, 'meta.mappingType')
  if (mappingType !== MAPPING_TYPES.COMMENTS) { return null }
  const { response, postIdOrToken } = action.payload

  if (postIdOrToken) {
    const post = methods.findPostFromIdOrToken(state, postIdOrToken)
    if (post) {
      for (const model of response[MAPPING_TYPES.COMMENTS]) {
        if (!state[MAPPING_TYPES.POSTS][model.postId]) {
          // need this to determine if a user can
          // delete comments on their own repost
          model.originalPostId = model.postId
          model.postId = post.id
        }
      }
    }
  }
  return null
}

methods.addModels = (state, type, data) => {
  // add state['modelType']
  if (!state[type]) { state[type] = {} }
  const ids = []
  if (type === MAPPING_TYPES.CATEGORIES) {
    data[type].forEach((item) => {
      const newType = { ...state[type] }
      const id = `${item.id}`
      newType[id] = item
      state[type] = newType
      ids.push(id)
    })
  } else if (type === MAPPING_TYPES.SETTINGS) {
    data[type].forEach((item, index) => {
      const newType = { ...state[type] }
      const id = index + 1
      newType[id] = item
      state[type] = newType
      ids.push(id)
    })
  } else if (data[type] && data[type].length) {
    // add arrays of models to state['modelType']['id']
    data[type].forEach((model) => {
      methods.mergeModel(state, type, model)
      ids.push(`${model.id}`)
    })
  } else if (data[type] && typeof data[type] === 'object') {
    // add single model objects to state['modelType']['id']
    const model = data[type]
    methods.mergeModel(state, type, model)
    ids.push(`${model.id}`)
  }
  return ids
}

methods.addNewIdsToResult = (state, newState) => {
  const result = newState.pages[path]
  if (!result || !result.morePostIds) { return state }
  // if you have created a post it gets prepended to the result ids
  // when we come back with additional ids we want them to be unique
  // and in descending order, which fills in the gaps and is what union does
  result.ids = union(result.morePostIds, result.ids)
  delete result.morePostIds
  return newState
}

methods.setLayoutMode = (action, state, newState) => {
  const result = newState.pages[path]
  if (!result || (result && result.mode === action.payload.mode)) { return state }
  result.mode = action.payload.mode
  return newState
}

// parses the 'linked' node of the JSON
// api responses into the json store
methods.parseLinked = (linked, newState) => {
  if (!linked) { return }
  Object.keys(linked).forEach((linkedType) => {
    methods.addModels(newState, linkedType, linked)
  })
}

// parse main part of request into the state and
// pull out the ids as this is the main payload
methods.getResult = (response, newState, action) => {
  const { mappingType, resultFilter } = action.meta
  const ids = methods.addModels(newState, mappingType, response)
  // set the result to the resultFilter if it exists
  const result = (typeof resultFilter === 'function') ? resultFilter(response[mappingType]) : { type: mappingType, ids }
  result.pagination = action.payload.pagination
  return result
}

methods.pagesKey = (action) => {
  const pathname = action.payload && action.payload.pathname ? action.payload.pathname : path
  const { resultKey } = action.meta || {}
  return resultKey || pathname
}

// TODO: need to test the existingResult conditional logic!!!!
methods.updateResult = (response, newState, action) => {
  const result = methods.getResult(response, newState, action)
  const { resultKey } = action.meta
  // the action payload pathname comes from before the fetch so that
  // we can be sure that the result is being assigned to the proper page
  const pathname = action.payload && action.payload.pathname ? action.payload.pathname : path
  const resultPath = methods.pagesKey(action)
  const existingResult = newState.pages[resultPath]
  if (existingResult && action.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
    existingResult.pagination = result.pagination
    if (existingResult.next) {
      existingResult.next.ids = uniq(existingResult.next.ids.concat(result.ids))
    } else {
      existingResult.next = result
    }
    // need to check agianst the typeof the result ids since we hack this for
    // notifications and the ids is actually an array of notificaitons not ids
  } else if (existingResult && typeof existingResult.ids[0] === 'string') {
    // only do this for top level streams, nested ones like lovers/reposters
    // should just update with the new results
    if (existingResult.ids.indexOf(result.ids[result.ids.length - 1]) === -1) {
      newState.pages[resultPath] = result
    } else if (hasLoadedFirstStream && !resultKey && !pathname.match(/\/(find|search)/)) {
      if (existingResult.morePostIds && existingResult.morePostIds.length) {
        existingResult.morePostIds = union(result.ids, existingResult.morePostIds)
      } else if (existingResult.ids[0] !== result.ids[0] && !existingResult.morePostIds) {
        existingResult.morePostIds = result.ids
      }
    } else {
      newState.pages[resultPath] = result
    }
  } else if (existingResult && !isEqual(existingResult.pagination, emptyPagination())) {
    // make sure we don't have an empty pagination object
    // which usually results from clearing out the search result
    // keeping the existingResult pagination keeps
    // the results correct when refreshing a page
    newState.pages[resultPath] = { ...result, pagination: existingResult.pagination, next: existingResult.next }
  } else {
    newState.pages[resultPath] = result
  }
}

methods.deleteModel = (state, newState, action, mappingType) => {
  const { model } = action.payload
  switch (action.type) {
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      newState = commentMethods.addOrUpdateComment(newState, { ...action, payload: { ...action.payload, postId: model.postId } })
      break
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      newState = postMethods.addOrUpdatePost(newState, action)
      break
    default:
      break
  }
  if (!newState[`deleted_${mappingType}`]) {
    newState[`deleted_${mappingType}`] = []
  }
  if (action.type.indexOf('_REQUEST') !== -1 || action.type.indexOf('_SUCCESS') !== -1) {
    if (newState[`deleted_${mappingType}`].indexOf(`${model.id}`) === -1) {
      newState[`deleted_${mappingType}`].push(`${model.id}`)
    }
    return newState
  } else if (action.type.indexOf('_FAILURE') !== -1) {
    // TODO: pop an alert or modal saying 'something went wrong'
    // and we couldn't delete this model?
    newState[mappingType][model.id] = model
    newState[`deleted_${mappingType}`].splice(
      newState[`deleted_${mappingType}`].indexOf(`${model.id}`),
      1
    )
    return newState
  }
  return state
}

methods.updateCurrentUser = (newState, action) => {
  const { response } = action.payload
  if (!newState[MAPPING_TYPES.USERS]) { newState[MAPPING_TYPES.USERS] = {} }
  const curUser = newState[MAPPING_TYPES.USERS][`${response[MAPPING_TYPES.USERS].id}`]
  const newUser = curUser ? { ...curUser, ...response[MAPPING_TYPES.USERS] } : response[MAPPING_TYPES.USERS]
  if (get(curUser, 'avatar.tmp')) {
    newUser.avatar.tmp = curUser.avatar.tmp
  }
  if (get(curUser, 'coverImage.tmp')) {
    newUser.coverImage.tmp = curUser.coverImage.tmp
  }
  newState[MAPPING_TYPES.USERS][`${response[MAPPING_TYPES.USERS].id}`] = newUser
  return newState
}

methods.updateCurrentUserTmpAsset = (newState, action) => {
  const assetType = action.type === ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
  const currentUser = methods.getCurrentUser(newState)
  const modifiedUser = {
    ...currentUser,
    [assetType]: { ...currentUser[assetType], ...action.payload },
  }
  newState[MAPPING_TYPES.USERS][currentUser.id] = modifiedUser
  return newState
}

methods.updatePostDetail = (newState, action) => {
  const post = action.payload.response.posts
  methods.parseLinked(action.payload.response.linked, newState)
  methods.addModels(newState, action.meta.mappingType, action.payload.response)
  return methods.mergeModel(
    newState,
    action.meta.mappingType,
    { id: post.id, showLovers: parseInt(post.lovesCount, 10) > 0, showReposters: parseInt(post.repostsCount, 10) > 0 }
  )
}

export default function json(state = {}, action = { type: '' }) {
  let newState = { ...state }
  if (!newState.pages) { newState.pages = {} }
  // whitelist actions
  switch (action.type) {
    case ACTION_TYPES.ADD_NEW_IDS_TO_RESULT:
      return methods.addNewIdsToResult(state, newState)
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
    case ACTION_TYPES.COMMENT.UPDATE_SUCCESS:
      methods.parseLinked(get(action, 'payload.response.linked'), newState)
      return commentMethods.addOrUpdateComment(newState, action)
    case ACTION_TYPES.COMMENT.DELETE_REQUEST:
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
    case ACTION_TYPES.COMMENT.DELETE_FAILURE:
      return methods.deleteModel(state, newState, action, MAPPING_TYPES.COMMENTS)
    case ACTION_TYPES.COMMENT.TOGGLE_EDITING:
      return commentMethods.toggleEditing(newState, action)
    case ACTION_TYPES.COMMENT.EDITABLE_SUCCESS:
    case ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS:
    case ACTION_TYPES.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.POST.EDITABLE_SUCCESS:
    case ACTION_TYPES.USER.DETAIL_SUCCESS:
      // fall through to parse the rest
      break
    case ACTION_TYPES.POST.CREATE_FAILURE:
    case ACTION_TYPES.POST.CREATE_SUCCESS:
    case ACTION_TYPES.POST.UPDATE_SUCCESS:
      methods.parseLinked(get(action, 'payload.response.linked'), newState)
      return postMethods.addOrUpdatePost(newState, action)
    case ACTION_TYPES.POST.DELETE_REQUEST:
    case ACTION_TYPES.POST.DELETE_SUCCESS:
    case ACTION_TYPES.POST.DELETE_FAILURE:
      return methods.deleteModel(state, newState, action, MAPPING_TYPES.POSTS)
    case ACTION_TYPES.POST.DETAIL_SUCCESS:
      return methods.updatePostDetail(newState, action)
    case ACTION_TYPES.POST.LOVE_REQUEST:
    case ACTION_TYPES.POST.LOVE_SUCCESS:
    case ACTION_TYPES.POST.LOVE_FAILURE:
      return postMethods.updatePostLoves(state, newState, action)
    case ACTION_TYPES.POST.WATCH_REQUEST:
    case ACTION_TYPES.POST.WATCH_SUCCESS:
    case ACTION_TYPES.POST.WATCH_FAILURE:
      return postMethods.updatePostWatch(state, newState, action)
    case ACTION_TYPES.PROFILE.LOAD_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_AVATAR_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_COVER_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_SUCCESS:
      methods.parseLinked(get(action, 'payload.response.linked'), newState)
      return methods.updateCurrentUser(newState, action)
    case ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED:
    case ACTION_TYPES.PROFILE.TMP_COVER_CREATED:
      return methods.updateCurrentUserTmpAsset(newState, action)
    case ACTION_TYPES.POST.TOGGLE_COMMENTS:
      return postMethods.toggleComments(newState, action)
    case ACTION_TYPES.POST.TOGGLE_EDITING:
      return postMethods.toggleEditing(newState, action)
    case ACTION_TYPES.POST.TOGGLE_LOVERS:
      return postMethods.toggleLovers(newState, action)
    case ACTION_TYPES.POST.TOGGLE_REPOSTERS:
      return postMethods.toggleReposters(newState, action)
    case ACTION_TYPES.POST.TOGGLE_REPOSTING:
      return postMethods.toggleReposting(newState, action)
    case ACTION_TYPES.RELATIONSHIPS.BATCH_UPDATE_INTERNAL:
      return relationshipMethods.batchUpdateRelationship(newState, action)
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_INTERNAL:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_REQUEST:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS:
      return relationshipMethods.updateRelationship(newState, action)
    case REHYDRATE: {
      // only keep the items that have been deleted
      // so we can still filter them out if needed
      const keepers = {}
      if (action.payload.json) {
        Object.keys(action.payload.json).forEach((collection) => {
          if (/(deleted_|categories)/.test(collection)) {
            keepers[collection] = action.payload.json[collection]
          }
        })
        keepers.pages = { 'all-categories': action.payload.json.pages['all-categories'] }
      }
      if (action.payload.profile) {
        const curUser = action.payload.profile
        if (curUser) {
          if (curUser.avatar && curUser.avatar.tmp) {
            delete curUser.avatar.tmp
          }
          if (curUser.coverImage && curUser.coverImage.tmp) {
            delete curUser.coverImage.tmp
          }
          setWith(keepers, [MAPPING_TYPES.USERS, curUser.id], curUser, Object)
        }
      }
      // hack to keep around the categories
      newState = { ...newState, ...keepers }
      return newState
    }
    case LOCATION_CHANGE:
      path = action.payload.pathname
      return state
    default:
      return state
  }
  const { response } = action.payload
  if (!response) { return state }
  // parse the linked part of the response into the state
  methods.parseLinked(response.linked, newState)
  // parse main part of response into the state
  // and update the paging information
  // unless updateResult is false which is used for
  // user details when you want the result to be for
  // posts/following/followers/loves
  if (action && action.meta && action.meta.updateResult === false) {
    const { mappingType } = action.meta
    methods.addModels(newState, mappingType, response)
  } else {
    methods.addParentPostIdToComments(newState, action)
    methods.updateResult(response, newState, action)
  }
  hasLoadedFirstStream = true
  return newState
}

// only used for testing where results get stored
export function setPath(newPath) {
  path = newPath
}

export { json, methods, commentMethods, postMethods, relationshipMethods }

