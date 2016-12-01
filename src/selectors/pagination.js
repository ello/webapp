/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect'
import { selectPages, selectPagesResult } from './pages'
import { selectParamsToken } from './params'
import { selectPropsPathname } from './routing'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'

const selectJson = state => state.get('json')

const PAGING_BLACKLIST = [
  /^\/enter\b/,
  /^\/forgot-password\b/,
  /^\/join\b/,
  /^\/signup\b/,
  /^\/following$/,
  /^\/starred$/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
  /^\/invitations\b/,
]

// Memoized selectors
export const selectPagination = createSelector(
  [selectJson, selectPages, selectPropsPathname, selectPagesResult, selectParamsToken],
  (json, pages, pathname, pagingResult, paramsToken) => {
    let result = pagingResult
    const isPagingEnabled = !(PAGING_BLACKLIST.every(re => re.test(pathname)))
    if (pages && isPagingEnabled) {
      if (!pagingResult && paramsToken) {
        const post = findModel(json, {
          collection: MAPPING_TYPES.POSTS,
          findObj: { token: paramsToken },
        })
        result = post ? pages.get(`/posts/${post.get('id')}/comments`) : null
      }
    }
    return result.get('pagination')
  },
)

