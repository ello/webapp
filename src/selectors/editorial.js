import { Map } from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { EDITORIALS } from '../constants/mapping_types'

export const selectPropsEditorialId = (state, props) =>
  get(props, 'editorialId') || get(props, 'editorial', Map()).get('id')

export const selectEditorials = state => state.json.get(EDITORIALS, Map())

// Memoized selectors

// Requires `editorialId` or `editorial` to be found in props
export const selectEditorial = createSelector(
  [selectPropsEditorialId, selectEditorials],
  (editorialId, editorials) =>
    editorials.get(editorialId, Map()),
)

export const selectEditorialPostId = createSelector(
  [selectEditorial], editorial =>
    editorial.getIn(['links', 'post', 'id']),
)

