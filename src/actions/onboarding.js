import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'

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

export default relationshipBatchSave

