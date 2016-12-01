import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { selectPathname } from './routing'
import { emptyPagination } from '../components/streams/Paginator'

const selectMeta = (state, props) => get(props, 'action.meta', {})

// state.json.pages.xxx
export const selectPages = state => state.getIn(['json', 'pages'])
export const selectAllCategoriesPage = state => state.getIn(['json', 'pages', 'all-categories'])

export const selectPagesResult = createSelector(
  [selectMeta, selectPathname, selectPages], (meta, pathname, pages) =>
    pages.get(
      meta.resultKey || pathname,
      Immutable.fromJS({ ids: [], pagination: emptyPagination() }),
    ),
)

// Memoized selectors
export const selectPage = createSelector(
  [selectPages, selectPathname], (pages, pathname) =>
    pages.get(pathname, null),
)

