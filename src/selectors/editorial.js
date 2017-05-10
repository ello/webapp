// @flow
import { Map } from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { EDITORIALS } from '../constants/mapping_types'
import type { EditorialProps } from '../types/flowtypes'

const selectPropsSize = (state, props) =>
  get(props, 'size', '1x1')

export const selectPropsEditorialId = (state: any, props: EditorialProps) =>
  get(props, 'editorialId') || get(props, 'editorial', Map()).get('id')

export const selectEditorials = (state: any) => state.json.get(EDITORIALS, Map())

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

export const selectEditorialImageSource = createSelector(
  [selectEditorial, selectPropsSize], (editorial, size) => {
    switch (size) {
      case '2x2': return editorial.get('twoByTwoImage', Map())
      case '2x1': return editorial.get('twoByOneImage', Map())
      case '1x2': return editorial.get('oneByTwoImage', Map())
      case '1x1': return editorial.get('oneByOneImage', Map())
      default: return editorial.get('oneByOneImage', Map())
    }
  },
)

