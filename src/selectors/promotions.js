import { createSelector } from 'reselect'
import get from 'lodash/get'
import sample from 'lodash/sample'
import { selectPathname, selectViewNameFromRoute } from './routing'
import { getLinkArray } from '../helpers/json_helper'

const selectJson = state => get(state, 'json')
const selectCats = state => get(state, 'json.categories', {})
export const selectAuthPromotionals = state => get(state, 'promotions.authentication')
export const selectPagePromotionals = state => get(state, 'json.pagePromotionals', {})

export const selectCategoryData = createSelector(
  [selectPathname, selectJson, selectCats], (pathname, json, categories) => {
    const slug = pathname.replace('/discover/', '')
    let cat = {}
    Object.keys(categories).map(key => categories[key]).forEach((category) => {
      if (category.slug === slug) { cat = category }
    })
    return {
      category: cat,
      promotionals: getLinkArray(cat, 'promotionals', json) || [],
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
  [selectAuthPromotionals], authPromos =>
    sample(authPromos)
)

