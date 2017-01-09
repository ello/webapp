/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import { REHYDRATE } from 'redux-persist/constants'
import { camelize } from 'humps'
import get from 'lodash/get'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../constants/relationship_types'
import { findModel } from '../helpers/json_helper'
import commentMethods from './experience_updates/comments'
import postMethods from './experience_updates/posts'
import relationshipMethods from './experience_updates/relationships'

// adding methods and accessing them from this object
// allows the unit tests to stub methods in this module
const methods = {}
let path = '/'
let hasLoadedFirstStream = false

const initialState = Immutable.Map({
  pages: Immutable.Map(),
})

export function emptyPagination() {
  return Immutable.Map({
    totalPages: 0,
    totalPagesRemaining: 0,
  })
}

methods.addNewIdsToResult = (state) => {
  const result = state.getIn(['pages', path])
  if (!result || !result.get('morePostIds')) { return state }
  // if you have created a post it gets prepended to the result ids
  // when we come back with additional ids we want them to be unique
  // and in descending order, which fills in the gaps and is what union does
  // unfortunately it is not very performant to use the `toSet` and `toList`
  return state.setIn(['pages', path, 'ids'], result.get('morePostIds').toSet().union(result.get('ids').toSet()).toList())
    .deleteIn(['pages', path, 'morePostIds'])
}

methods.updateUserCount = (state, userId, prop, delta) => {
  const count = state.getIn([MAPPING_TYPES.USERS, userId, prop], 0)
  if (count === '∞') { return state }
  return state.setIn([MAPPING_TYPES.USERS, userId, prop], parseInt(count, 10) + delta)
}

methods.updatePostCount = (state, postId, prop, delta) => {
  const count = state.getIn([MAPPING_TYPES.POSTS, postId, prop], 0)
  if (count === '∞') { return state }
  return state.setIn([MAPPING_TYPES.POSTS, postId, prop], parseInt(count, 10) + delta)
}

methods.appendPageId = (state, pageName, mappingType, id) => {
  const page = state.getIn(['pages', pageName])
  if (page) {
    const ids = page.get('ids', Immutable.List())
    if (!ids.includes(`${id}`)) {
      return state.setIn(['pages', pageName, 'ids'], ids.unshift(`${id}`))
    }
  }
  return state.setIn(['pages', pageName], Immutable.fromJS({
    ids: [`${id}`], type: mappingType, pagination: emptyPagination(),
  }))
}

methods.removePageId = (state, pageName, id) => {
  let existingIds = state.getIn(['pages', pageName, 'ids'])
  if (existingIds) {
    const index = existingIds.indexOf(`${id}`)
    if (index !== -1) {
      existingIds = existingIds.splice(index, 1)
      return state.setIn(['pages', pageName, 'ids'], existingIds)
    }
  }
  return state
}

methods.mergeModel = (state, type, params) => {
  if (params.id) {
    // make the model's id a string for later comparisons
    // the API sent them back as a number at one point
    params.id = `${params.id}`
    return state.setIn(
      [type, params.id],
      state.getIn([type, params.id], Immutable.Map()).mergeDeep(params),
    )
  }
  return state
}

methods.addModels = (state, type, data) => {
  // add state['modelType']
  const camelType = camelize(type)
  let ids = Immutable.List()
  if (camelType === MAPPING_TYPES.CATEGORIES || camelType === MAPPING_TYPES.PAGE_PROMOTIONALS) {
    data[camelType].forEach((item) => {
      const id = `${item.id}`
      state = state.setIn(
        [camelType, id],
        state.getIn([camelType, id], Immutable.Map()).mergeDeep(item),
      )
      ids = ids.push(id)
    })
  } else if (camelType === MAPPING_TYPES.SETTINGS) {
    data[camelType].forEach((item, index) => {
      const id = index + 1
      state = state.setIn([camelType, id], Immutable.fromJS(item))
      ids = ids.push(id)
    })
  } else if (data[camelType] && data[camelType].length) {
    // add arrays of models to state['modelType']['id']
    data[camelType].forEach((model) => {
      state = methods.mergeModel(state, camelType, model)
      ids = ids.push(`${model.id}`)
    })
  } else if (data[camelType] && typeof data[camelType] === 'object') {
    // add single model objects to state['modelType']['id']
    const model = data[camelType]
    state = methods.mergeModel(state, camelType, model)
    ids = ids.push(`${model.id}`)
  }
  return { ids, state }
}

// parses the 'linked' node of the JSON
// api responses into the json store
methods.parseLinked = (linked, state) => {
  if (!linked) { return state }
  Object.keys(linked).forEach((linkedType) => {
    state = methods.addModels(state, linkedType, linked).state
  })
  return state
}

// parse main part of request into the state and
// pull out the ids as this is the main payload
methods.getResult = (response, state, action) => {
  const { mappingType, resultFilter } = action.meta
  const { ids, state: newState } = methods.addModels(state, mappingType, response)
  // set the result to the resultFilter if it exists
  const result = (typeof resultFilter === 'function') ? resultFilter(response[mappingType]) : { type: mappingType, ids }
  result.pagination = action.payload.pagination
  return { newState, result: Immutable.fromJS(result) }
}

methods.getCurrentUser = state =>
  state.get(MAPPING_TYPES.USERS).find(user =>
    user.get('relationshipPriority') === RELATIONSHIP_PRIORITY.SELF,
  )

methods.findPostFromIdOrToken = (state, postIdOrToken) =>
  state.getIn(
    [MAPPING_TYPES.POSTS, postIdOrToken],
    findModel(state, {
      collection: MAPPING_TYPES.POSTS,
      findObj: { token: postIdOrToken },
    }),
  )

methods.addParentPostIdToComments = (state, action) => {
  // Kludge to abort for some tests
  const mappingType = get(action, 'meta.mappingType')
  if (mappingType !== MAPPING_TYPES.COMMENTS) { return null }
  const { response, postIdOrToken } = action.payload

  if (postIdOrToken) {
    const post = methods.findPostFromIdOrToken(state, postIdOrToken)
    if (post) {
      response[MAPPING_TYPES.COMMENTS].forEach((model) => {
        if (!state.getIn([MAPPING_TYPES.POSTS, model.postId])) {
          // need this to determine if a user can
          // delete comments on their own repost
          model.originalPostId = model.postId
          model.postId = post.get('id')
        }
      })
    }
  }
  return response
}

methods.setLayoutMode = (action, state) => {
  const result = state.getIn(['pages', path])
  if (!result || (result.get('mode') === action.payload.mode)) { return state }
  return state.setIn(['pages', path, 'mode'], action.payload.mode)
}

methods.pagesKey = action =>
  get(action, 'meta.resultKey', get(action, 'payload.pathname', path))

// look at json_test to see more documentation for what happens in here
methods.updateResult = (response, state, action) => {
  let { newState, result } = methods.getResult(response, state, action) // eslint-disable-line
  state = newState
  const { resultKey } = action.meta || {}
  const resultPath = methods.pagesKey(action)
  const existingResult = state.getIn(['pages', resultPath])
  if (existingResult) {
    if (action.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      state = state.setIn(['pages', resultPath, 'pagination'], result.get('pagination'))
      if (existingResult.get('next')) {
        result = result.set('ids', existingResult.getIn(['next', 'ids']).concat(result.get('ids')))
      }
      return state.setIn(['pages', resultPath, 'next'], result)
    } else if (typeof existingResult.getIn(['ids', 0]) === 'string') {
      if ((!existingResult.get('ids').includes(result.get('ids').last()) && existingResult.get('morePostIds', Immutable.List()).isEmpty()) ||
          (!existingResult.get('morePostIds', Immutable.List()).isEmpty() && !existingResult.get('morePostIds').includes(result.get('ids').last()))) {
        return state.setIn(['pages', resultPath], result)
      } else if (hasLoadedFirstStream && !resultKey) {
        if (!existingResult.get('morePostIds', Immutable.List()).isEmpty()) {
          return state.setIn(
            ['pages', resultPath, 'morePostIds'],
            result.get('ids').toSet().union(existingResult.get('morePostIds').toSet()).toList(),
          )
        } else if (existingResult.get('ids').first() !== result.get('ids').first()) {
          return state.setIn(['pages', resultPath, 'morePostIds'], result.get('ids'))
        }
      }
    }
  }
  return state.setIn(['pages', resultPath], result)
}

methods.deleteModel = (state, action, mappingType) => {
  const { model } = action.payload
  switch (action.type) {
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      state = commentMethods.addOrUpdateComment(state, { ...action, payload: { ...action.payload, postId: model.get('postId') } })
      break
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      state = postMethods.addOrUpdatePost(state, action)
      break
    default:
      break
  }
  const deletedType = state.get(`deleted_${mappingType}`, Immutable.List())
  if (action.type.includes('_REQUEST') || action.type.includes('_SUCCESS')) {
    if (!deletedType.includes(`${model.get('id')}`)) {
      return state.set(`deleted_${mappingType}`, deletedType.push(`${model.get('id')}`))
    }
  } else if (action.type.includes('_FAILURE')) {
    // TODO: pop an alert or modal saying 'something went wrong'
    // and we couldn't delete this model?
    return state.setIn([mappingType, model.get('id')], model)
      .set(
        `deleted_${mappingType}`,
        deletedType.splice(deletedType.indexOf(`${model.get('id')}`), 1),
      )
  }
  return state
}

methods.updateCurrentUser = (state, action) => {
  const { response } = action.payload
  const curUser = state.getIn([MAPPING_TYPES.USERS, `${response[MAPPING_TYPES.USERS].id}`])
  const newUser = curUser ?
    curUser.mergeDeep(response[MAPPING_TYPES.USERS]) :
    Immutable.fromJS(response[MAPPING_TYPES.USERS])
  const tmpAvatar = curUser && curUser.getIn(['avatar', 'tmp'])
  const tmpCoverImage = curUser && curUser.getIn(['coverImage', 'tmp'])
  if (tmpAvatar) {
    newUser.setIn(['avatar', 'tmp'], tmpAvatar)
  }
  if (tmpCoverImage) {
    newUser.setIn(['coverImage', 'tmp'], tmpCoverImage)
  }
  return state.setIn([MAPPING_TYPES.USERS, `${response[MAPPING_TYPES.USERS].id}`], newUser)
}

methods.updateCurrentUserTmpAsset = (state, action) => {
  const assetType = action.type === ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
  const currentUser = methods.getCurrentUser(state)
  return state.setIn([MAPPING_TYPES.USERS, currentUser.get('id')],
    currentUser.set(assetType, currentUser.get(assetType).mergeDeep(action.payload)),
  )
}

methods.updatePostDetail = (state, action) => {
  const post = action.payload.response.posts
  state = methods.parseLinked(action.payload.response.linked, state)
  state = methods.addModels(state, action.meta.mappingType, action.payload.response).state
  return methods.mergeModel(
    state,
    action.meta.mappingType,
    {
      id: post.id,
      showLovers: parseInt(post.lovesCount, 10) > 0,
      showReposters: parseInt(post.repostsCount, 10) > 0,
    },
  )
}

methods.markAnnouncementRead = state =>
  state.delete('announcements')

export default function json(state = initialState, action = { type: '' }) {
  // whitelist actions
  switch (action.type) {
    case ACTION_TYPES.ADD_NEW_IDS_TO_RESULT:
      return methods.addNewIdsToResult(state)
    case ACTION_TYPES.AUTHENTICATION.LOGOUT_SUCCESS:
    case ACTION_TYPES.AUTHENTICATION.LOGOUT_FAILURE:
    case ACTION_TYPES.PROFILE.DELETE_SUCCESS:
      return initialState
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
    case ACTION_TYPES.COMMENT.CREATE_REQUEST:
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
    case ACTION_TYPES.COMMENT.UPDATE_SUCCESS:
      state = methods.parseLinked(get(action, 'payload.response.linked'), state)
      return commentMethods.addOrUpdateComment(state, action)
    case ACTION_TYPES.COMMENT.DELETE_REQUEST:
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
    case ACTION_TYPES.COMMENT.DELETE_FAILURE:
      return methods.deleteModel(state, action, MAPPING_TYPES.COMMENTS)
    case ACTION_TYPES.COMMENT.TOGGLE_EDITING:
      return commentMethods.toggleEditing(state, action)
    case ACTION_TYPES.COMMENT.EDITABLE_SUCCESS:
    case ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS:
    case ACTION_TYPES.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.POST.EDITABLE_SUCCESS:
    case ACTION_TYPES.USER.DETAIL_SUCCESS:
      // fall through to parse the rest
      break
    case ACTION_TYPES.NOTIFICATIONS.MARK_ANNOUNCEMENT_READ_REQUEST:
      return methods.markAnnouncementRead(state)
    case ACTION_TYPES.POST.CREATE_FAILURE:
    case ACTION_TYPES.POST.CREATE_SUCCESS:
    case ACTION_TYPES.POST.UPDATE_SUCCESS:
      state = methods.parseLinked(get(action, 'payload.response.linked'), state)
      return postMethods.addOrUpdatePost(state, action)
    case ACTION_TYPES.POST.DELETE_REQUEST:
    case ACTION_TYPES.POST.DELETE_SUCCESS:
    case ACTION_TYPES.POST.DELETE_FAILURE:
      return methods.deleteModel(state, action, MAPPING_TYPES.POSTS)
    case ACTION_TYPES.POST.DETAIL_SUCCESS:
      return methods.updatePostDetail(state, action)
    case ACTION_TYPES.POST.LOVE_REQUEST:
    case ACTION_TYPES.POST.LOVE_SUCCESS:
    case ACTION_TYPES.POST.LOVE_FAILURE:
      return postMethods.updatePostLoves(state, action)
    case ACTION_TYPES.POST.WATCH_REQUEST:
    case ACTION_TYPES.POST.WATCH_SUCCESS:
    case ACTION_TYPES.POST.WATCH_FAILURE:
      return postMethods.updatePostWatch(state, action)
    case ACTION_TYPES.POST.TOGGLE_COMMENTS:
      return postMethods.toggleComments(state, action)
    case ACTION_TYPES.POST.TOGGLE_EDITING:
      return postMethods.toggleEditing(state, action)
    case ACTION_TYPES.POST.TOGGLE_LOVERS:
      return postMethods.toggleLovers(state, action)
    case ACTION_TYPES.POST.TOGGLE_REPOSTERS:
      return postMethods.toggleReposters(state, action)
    case ACTION_TYPES.POST.TOGGLE_REPOSTING:
      return postMethods.toggleReposting(state, action)
    case ACTION_TYPES.PROFILE.LOAD_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_AVATAR_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_COVER_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_SUCCESS:
      state = methods.parseLinked(get(action, 'payload.response.linked'), state)
      return methods.updateCurrentUser(state, action)
    case ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED:
    case ACTION_TYPES.PROFILE.TMP_COVER_CREATED:
      return methods.updateCurrentUserTmpAsset(state, action)
    case ACTION_TYPES.RELATIONSHIPS.BATCH_UPDATE_INTERNAL:
      return relationshipMethods.batchUpdateRelationship(state, action)
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_INTERNAL:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_REQUEST:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS:
      return relationshipMethods.updateRelationship(state, action)
    case REHYDRATE: {
      // only keep the items that have been deleted
      // so we can still filter them out if needed
      let keepers = initialState
      if (action.payload.json) {
        if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
          return action.payload.json
        }
        action.payload.json.keySeq().forEach((collection) => {
          if (/deleted_/.test(collection)) {
            keepers = keepers.set(collection, action.payload.json.get(collection))
          }
        })
      }
      if (action.payload.profile) {
        let curUser = action.payload.profile
        if (curUser) {
          curUser = curUser.deleteIn(['avatar', 'tmp'])
            .deleteIn(['coverImage', 'tmp'])
          keepers = keepers.setIn([MAPPING_TYPES.USERS, curUser.get('id')], curUser)
        }
      }
      return keepers
    }
    case LOCATION_CHANGE:
      path = action.payload.pathname
      return state
    default:
      return state
  }
  const { response } = action.payload
  // TODO: Add to immutable branch
  if (!response && get(action, ['meta', 'mappingType'], null) === MAPPING_TYPES.ANNOUNCEMENTS) {
    return methods.markAnnouncementRead(state, action)
  }
  if (!response) { return state }
  // parse the linked part of the response into the state
  state = methods.parseLinked(response.linked, state)
  // parse main part of response into the state
  // and update the paging information
  // unless updateResult is false which is used for
  // user details when you want the result to be for
  // posts/following/followers/loves
  if (action && action.meta && action.meta.updateResult === false) {
    const { mappingType } = action.meta
    state = methods.addModels(state, mappingType, response).state
  } else {
    methods.addParentPostIdToComments(state, action)
    state = methods.updateResult(response, state, action)
  }
  hasLoadedFirstStream = true
  return state
}

// only used for testing where results get stored
export function setPath(newPath) {
  path = newPath
}
export function setHasLoadedFirstStream(bool) {
  hasLoadedFirstStream = bool
}

export { json, methods, commentMethods, postMethods, relationshipMethods }

