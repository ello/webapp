import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamFilters from '../components/streams/StreamFilters'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function getCategories() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.categories() },
    meta: {
      mappingType: MAPPING_TYPES.CATEGORIES,
      renderStream: {
        asList: StreamRenderables.categoriesAsGrid,
        asGrid: StreamRenderables.categoriesAsGrid,
      },
      resultKey: 'all-categories',
    },
  }
}

export function loadCategoryPosts(type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.categoryPosts(type) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadDiscoverUsers(type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.discoverUsers(type) },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
      resultFilter: StreamFilters.mostRecentPostsFromUsers,
    },
  }
}

export function loadDiscoverPosts(type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.discoverPosts(type) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadCommunities() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.communitiesPath() },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

export function loadFeaturedUsers() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.awesomePeoplePath() },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

export function bindDiscoverKey(type) {
  return {
    type: ACTION_TYPES.GUI.BIND_DISCOVER_KEY,
    payload: { type },
  }
}
