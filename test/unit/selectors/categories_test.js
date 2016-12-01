import Immutable from 'immutable'
import { clearJSON, json, stubJSONStore } from '../../support/stubs'
import {
  selectCategories,
  selectOnboardingCategories,
  selectCategoryPageTitle,
  selectCategoryTabs,
  sortCategories,
} from '../../../src/selectors/categories'

describe('categories selectors', () => {
  let params
  let location
  let state
  beforeEach(() => {
    stubJSONStore()
    params = { token: 'paramsToken', type: 'paramsType' }
    location = { pathname: '/discover' }
    state = Immutable.fromJS({ json })
  })

  afterEach(() => {
    clearJSON()
    params = {}
    location = {}
  })

  context('#selectCategories', () => {
    it('returns the category object with memoization', () => {
      const props = { params, location }
      const categories = state.getIn(['json', 'categories'])
      const values = categories.valueSeq()
      let meta = []
      let primary = []
      let secondary = []
      let tertiary = []
      values.forEach((category) => {
        switch (category.get('level')) {
          case 'meta':
            meta.push(category)
            break
          case 'primary':
            primary.push(category)
            break
          case 'secondary':
            secondary.push(category)
            break
          case 'tertiary':
            tertiary.push(category)
            break
          default:
            break
        }
      })
      meta = meta.sort(sortCategories)
      primary = primary.sort(sortCategories)
      secondary = secondary.sort(sortCategories)
      tertiary = tertiary.sort(sortCategories)
      const selected = selectCategories(state, props)
      const compare = { meta, primary, secondary, tertiary }
      expect(selected).to.deep.equal(compare)
    })
  })

  context('#selectOnboardingCategories', () => {
    it('the categories as a concatenated array', () => {
      const cats = selectCategories(state)
      const categoryArray = cats.primary.concat(cats.secondary, cats.tertiary)
      expect(selectOnboardingCategories(state)).to.deep.equal(categoryArray)
    })
  })

  context('#selectCategoryTabs', () => {
    it('returns the correct stream action for featured and recommended', () => {
      const tabs = selectCategoryTabs(state)
      // meta
      expect(tabs[0]).to.have.property('children', 'Featured')
      expect(tabs[0]).to.have.property('to', '/discover')
      expect(tabs[1]).to.have.property('children', 'Trending')
      expect(tabs[1]).to.have.property('to', '/discover/trending')
      expect(tabs[2]).to.have.property('children', 'Recent')
      expect(tabs[2]).to.have.property('to', '/discover/recent')
      // divider
      expect(tabs[3]).to.have.property('kind', 'divider')
      // primary
      expect(tabs[4]).to.have.property('children', 'Metal')
      expect(tabs[4]).to.have.property('to', '/discover/metal')
      expect(tabs[5]).to.have.property('children', 'Art')
      expect(tabs[5]).to.have.property('to', '/discover/art')
      // secondary
      expect(tabs[6]).to.have.property('children', 'Collage')
      expect(tabs[6]).to.have.property('to', '/discover/collage')
      expect(tabs[7]).to.have.property('children', 'Interviews')
      expect(tabs[7]).to.have.property('to', '/discover/interviews')
      // tertiary
      expect(tabs[8]).to.have.property('children', 'Music')
      expect(tabs[8]).to.have.property('to', '/discover/music')
      expect(tabs[9]).to.have.property('children', 'Development')
      expect(tabs[9]).to.have.property('to', '/discover/development')
    })
  })

  context('#selectCategoryPageTitle', () => {
    it('returns the page title related to the /discover page with memoization', () => {
      const props = { params: { token: 'paramsToken', type: 'arktip-x-ello' }, location }
      expect(selectCategoryPageTitle(state, props)).to.equal('Arktip x Ello')
      const nextProps = { ...props, blah: 1 }
      expect(selectCategoryPageTitle(state, nextProps)).to.equal('Arktip x Ello')
      expect(selectCategoryPageTitle.recomputations()).to.equal(1)
      const nextNextProps = { ...nextProps, params: { token: 'paramsToken', type: 'all' } }
      expect(selectCategoryPageTitle(state, nextNextProps)).to.be.null
      const lastProps = { ...nextNextProps, params: { token: 'paramsToken', type: 'recommended' } }
      expect(selectCategoryPageTitle(state, lastProps)).to.equal('Featured')
    })
  })

  context('#selectDiscoverMetaData', () => {
    it('should be tested')
  })
})

