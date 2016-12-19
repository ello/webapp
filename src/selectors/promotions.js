import Immutable from 'immutable'
import { createSelector } from 'reselect'
import sample from 'lodash/sample'
import { selectPathname, selectViewNameFromRoute } from './routing'
import { selectJson } from './store'
import { getLinkArray } from '../helpers/json_helper'

const selectCats = state => state.json.get('categories', Immutable.Map())
export const selectAuthPromotionals = state => state.promotions.get('authentication')
export const selectPagePromotionals = state => state.json.get('pagePromotionals', Immutable.Map())

export const selectCategoryData = createSelector(
  [selectPathname, selectJson, selectCats], (pathname, json, categories) => {
    const slug = pathname.replace('/discover/', '')
    const cat = categories.valueSeq().find(category => category.get('slug') === slug) || Immutable.Map()
    return {
      category: cat,
      promotionals: getLinkArray(cat, 'promotionals', json) || Immutable.List(),
    }
  },
)

export const selectIsPagePromotion = createSelector(
  [selectViewNameFromRoute, selectPathname], (viewName, pathname) =>
    (viewName === 'search') ||
    (viewName === 'discover' && pathname === '/') ||
    (viewName === 'discover' && pathname === '/discover') ||
    (viewName === 'discover' && pathname === '/discover/all') ||
    (viewName === 'discover' && /\/featured\b|\/trending\b|\/recent\b/.test(pathname)),
)

export const selectIsCategoryPromotion = createSelector(
  [selectViewNameFromRoute, selectIsPagePromotion], (viewName, isPagePromotion) =>
    (viewName === 'discover' && !isPagePromotion),
)

export const selectRandomAuthPromotion = createSelector(
  [selectAuthPromotionals], (authPromos) => {
    sample(authPromos)
  },
)

