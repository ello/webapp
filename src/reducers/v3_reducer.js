import Immutable from 'immutable'
import { camelizeKeys } from 'humps'
import * as ACTION_TYPES from '../constants/action_types'

// Like .getIn but for regular JS objects
// Does not break if object is missing a key in the middle
function deepGet(object, [head, ...tail], fallback = null) {
  const val = object[head]
  if (val === undefined || val === null) { return fallback }
  if (tail.length === 0) { return val }
  return deepGet(val, tail, fallback)
}

// Merge two Immutable maps while preferring data over nulls and never returning undefined.
function smartMergeDeep(oldMap, newMap) {
  return oldMap.mergeDeepWith((oldVal, newVal) => {
    if (oldVal === undefined && newVal === undefined) { return null }
    if (oldVal === null || oldVal === undefined) { return newVal }
    if (newVal === null || newVal === undefined) { return oldVal }
    return newVal
  }, newMap)
}

// Given state (immutable), a key path (array[string]), and map merge the map in.
// If a value on either side is null or undefined it "loses" the merge - we always prefer data.
function smartMergeDeepIn(state, keyPath, newMap) {
  const oldMap = state.getIn(keyPath, Immutable.Map())
  const mergedMap = smartMergeDeep(oldMap, newMap)
  return state.setIn(keyPath, mergedMap)
}

function parseList(state, list, parser) {
  if (!Array.isArray(list)) { return state }
  return list.reduce(parser, state)
}

function parsePagination(state, stream, pathname, query, variables) {
  const { posts: models, next, isLastPage } = stream
  const mergedState = state.mergeDeepIn(['pages', pathname], Immutable.fromJS({
    pagination: Immutable.fromJS({ next, query, variables, isLastPage }),
  }))
  return mergedState.updateIn(['pages', pathname, 'ids'], ids =>
    (ids || Immutable.List()).concat(models.map(m => m.id)),
  )
}

function parseAsset(state, asset) {
  if (!asset) { return state }
  return smartMergeDeepIn(state, ['assets', asset.id], Immutable.fromJS({
    id: asset.id,
    attachment: asset.attachment,
  }))
}

function parseCategory(state, category) {
  if (!category) { return state }
  return smartMergeDeepIn(state, ['categories', category.id], Immutable.fromJS({
    id: category.id,
  }))
}

function parseUser(state, user) {
  if (!user) { return state }

  const state1 = smartMergeDeepIn(state, ['users', user.id], Immutable.fromJS({
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
  }))
  const state2 = parseList(state1, user.categories, parseCategory)
  return state2
}

function postLinks(post) {
  const links = {}
  const authorId = deepGet(post, ['author', 'id'])
  if (authorId) { links.author = { id: authorId, type: 'user' } }

  const repostAuthorId = deepGet(post, ['repostedSource', 'author', 'id'])
  if (repostAuthorId) { links.repostAuthor = { id: repostAuthorId, type: 'user' } }

  const repostId = deepGet(post, ['repostedSource', 'id'])
  if (repostId) { links.repostedSource = { id: repostId, type: 'post' } }

  return links
}

function parseRegion(post, type) {
  return (post[type] || []).map((region, index) => {
    let data = null
    if (typeof region.data === 'object') {
      data = camelizeKeys(region.data)
    } else {
      data = region.data
    }
    return { ...region, data, id: `${post.id}-${index}` }
  })
}

function parsePost(state, post) {
  if (!post) { return state }

  const state1 = parseUser(state, post.author)
  const state2 = parseList(state1, post.assets, parseAsset)
  const state3 = parsePost(state2, post.repostedSource)

  const state4 = smartMergeDeepIn(state3, ['posts', post.id], Immutable.fromJS({
    // ids
    id: post.id,
    authorId: deepGet(post, ['author', 'id']), // We don't use links for this

    // Properties
    token: post.token,
    createdAt: post.createdAt,

    // Content
    summary: parseRegion(post, 'summary'),
    content: parseRegion(post, 'content'),
    repostContent: parseRegion(post, 'repostContent'),

    // Stats
    lovesCount: deepGet(post, ['postStats', 'lovesCount']),
    commentsCount: deepGet(post, ['postStats', 'commentsCount']),
    viewsCount: deepGet(post, ['postStats', 'viewsCount']),
    repostsCount: deepGet(post, ['postStats', 'repostsCount']),

    // Current user state
    watching: deepGet(post, ['currentUserState', 'watching']),
    loved: deepGet(post, ['currentUserState', 'loved']),
    reposted: deepGet(post, ['currentUserState', 'reposted']),

    // Links
    links: postLinks(post),
  }))

  return state4
}

function parseQueryType(state, stream, pathname, query, variables) {
  const { posts } = stream
  const state1 = parseList(state, posts, parsePost)
  return parsePagination(state1, stream, pathname, query, variables)
}

function parseStream(state, { payload: { response: { data }, pathname, query, variables } }) {
  return Object.keys(data).reduce((s, key) =>
    parseQueryType(s, data[key], pathname, query, variables),
    state,
  )
}

// Dispatch different graphql response types for parsing (reducing)
export default function (state, action) {
  const { type } = action
  switch (type) {
    case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.V3.LOAD_NEXT_CONTENT_SUCCESS:
      return parseStream(state, action)
    default:
      return state
  }
}
