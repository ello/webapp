import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectPathname } from './routing'
import { selectJson } from './store'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { emptyPagination } from '../reducers/json'

// props.xxx
const selectMeta = (state, props) => get(props, 'action.meta', {})

// state.stream.xxx
export const selectStreamType = state => state.stream.get('type')

// state.stream.meta.xxx
export const selectStreamMappingType = state => state.stream.getIn(['meta', 'mappingType'])

// state.stream.payload.xxx
export const selectStreamPostIdOrToken = state => state.stream.getIn(['payload', 'postIdOrToken'])

const selectStreamResult = (state, props) => {
  const meta = selectMeta(state, props)
  const resultPath = meta.resultKey || selectPathname(state)
  return state.json.getIn(['pages', resultPath], Immutable.Map({ ids: Immutable.List(), pagination: emptyPagination() }))
}

const selectStreamResultPath = (state, props) => {
  const meta = selectMeta(state, props)
  return meta.resultKey || selectPathname(state)
}

const selectStreamDeletions = (state, props) => {
  const meta = selectMeta(state, props)
  const resultPath = meta.resultKey || selectPathname(state)
  const result = state.json.getIn(['pages', resultPath], Immutable.Map({ ids: [] }))
  return (result && result.get('type') === meta.mappingType) ||
    (meta.resultFilter && result.get('type') !== meta.mappingType)
}

const selectPagingPath = (state, props) => get(props, 'action.payload.endpoint.pagingPath')

// Memoized selectors
// TODO: We need to test this :(
export const makeSelectStreamProps = () =>
  createSelector(
    [
      selectStreamResult,
      selectStreamResultPath,
      selectStreamDeletions,
      selectJson,
      selectPathname,
      selectPagingPath,
    ],
    (
      result,
      resultPath,
      shouldRemoveDeletions,
      json,
      path,
      pagingPath,
    ) => {
      const renderObj = { data: [], nestedData: [] }
      if (result.get('type') === MAPPING_TYPES.NOTIFICATIONS) {
        result.get('ids').forEach((model) => {
          renderObj.data.push(model)
        })
        if (result.get('next')) {
          result.getIn(['next', 'ids']).forEach((model) => {
            renderObj.data.push(model)
          })
        }
      } else if (shouldRemoveDeletions) {
        const delTypes = json.get(`deleted_${result.get('type')}`)
        // don't filter out blocked ids if we are in settings
        // since you can unblock/unmute them from here
        result.get('ids').forEach((id) => {
          const model = json.getIn([result.get('type'), id])
          if (model && (path === '/settings' || (!delTypes || !delTypes.includes(id)))) {
            renderObj.data.push(model)
          }
        })
        if (result.get('next')) {
          const nDelTypes = json.get(`deleted_${result.getIn('next', 'type')}`)
          const dataProp = pagingPath ? 'nestedData' : 'data'
          result.getIn(['next', 'ids']).forEach((nextId) => {
            const model = json.getIn([result.getIn(['next', 'type']), nextId])
            if (model && (path === '/settings' ||
                (!nDelTypes || !nDelTypes.includes(nextId)))) {
              renderObj[dataProp].push(model)
            }
          })
        }
      }
      return { renderObj, result, resultPath }
    },
  )

