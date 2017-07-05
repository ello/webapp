import {
  loadCategoryPosts,
  loadDiscoverPosts,
  getCategories,
} from 'ello-brains/actions/discover'
import { getStreamAction } from '../../../src/containers/DiscoverContainer'

describe('DiscoverContainer', () => {
  context('#getStreamAction', () => {
    it('returns the correct stream action for featured and recommended', () => {
      const realAction = loadCategoryPosts()
      const featuredAction = getStreamAction('featured')
      const recommendedAction = getStreamAction('recommended')
      expect(featuredAction).to.deep.equal(realAction)
      expect(recommendedAction).to.deep.equal(realAction)
    })

    it('returns the correct stream action for recent and trending', () => {
      const realRecentAction = loadDiscoverPosts('recent')
      const recentAction = getStreamAction('recent')
      expect(recentAction).to.deep.equal(realRecentAction)
      const realTrendingAction = loadDiscoverPosts('trending')
      const trendingAction = getStreamAction('trending')
      expect(trendingAction).to.deep.equal(realTrendingAction)
    })

    it('returns the correct stream action for all', () => {
      const realAction = getCategories()
      const testAction = getStreamAction('all')
      expect(testAction).to.deep.equal(realAction)
    })
  })
})

