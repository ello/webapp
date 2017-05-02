import { LOAD_STREAM } from '../constants/action_types'
import { EDITORIALS } from '../constants/mapping_types'
import { editorials as editorialsApi } from '../networking/api'
import { editorials as editorialRenderable } from '../components/streams/StreamRenderables'

export function editorials() { // eslint-disable-line
  return {
    type: LOAD_STREAM,
    payload: { endpoint: editorialsApi() },
    meta: {
      mappingType: EDITORIALS,
      renderStream: {
        asList: editorialRenderable,
        asGrid: editorialRenderable,
      },
    },
  }
}

