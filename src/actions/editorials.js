import { LOAD_STREAM } from '../constants/action_types'
import { EDITORIALS } from '../constants/mapping_types'
import { editorials as editorialsApi } from '../networking/api'
import { editorials as editorialRenderable } from '../components/streams/StreamRenderables'

export const loadEditorials = isPreview => ( // eslint-disable-line
  {
    type: LOAD_STREAM,
    payload: { endpoint: editorialsApi(isPreview) },
    meta: {
      mappingType: EDITORIALS,
      renderStream: {
        asList: editorialRenderable,
        asGrid: editorialRenderable,
      },
    },
  }
)

