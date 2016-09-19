import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'

export function loadCommunities() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.communitiesPath(), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsCards,
        asGrid: StreamRenderables.usersAsCards,
      },
    },
  }
}

export function loadAwesomePeople() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.awesomePeoplePath(), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

// TODO: Update the `body` and `user_ids`
export function relationshipBatchSave(ids, priority = 'friend') {
  return {
    type: ACTION_TYPES.POST_JSON,
    meta: { mappingType: MAPPING_TYPES.RELATIONSHIPS },
    payload: {
      method: 'POST',
      endpoint: api.relationshipBatchPath(),
      body: { user_ids: ids, priority },
    },
  }
}

