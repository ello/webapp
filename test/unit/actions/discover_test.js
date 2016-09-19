import { isFSA, isFSAName } from '../../support/test_helpers'
import * as subject from '../../../src/actions/discover'
import { mostRecentPostsFromUsers } from '../../../src/components/streams/StreamFilters'
import {
  postsAsGrid,
  postsAsList,
  usersAsCards,
  usersAsGrid,
} from '../../../src/components/streams/StreamRenderables'

describe('discover actions', () => {
  context('#loadDiscoverUsers', () => {
    const action = subject.loadDiscoverUsers('featured')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadDiscoverUsers)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/discover/users/featured?per_page=25')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
    })

    it('has the correct resultFilter in the action', () => {
      expect(action.meta.resultFilter).to.equal(mostRecentPostsFromUsers)
    })
  })

  context('#loadDiscoverPosts', () => {
    const action = subject.loadDiscoverPosts('trending')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadDiscoverPosts)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/discover/posts/trending?per_page=25')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('posts')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
    })
  })

  context('#loadCommunities', () => {
    const action = subject.loadCommunities()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadCommunities)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      const testPath = '/interest_categories/members?name=onboarding&per_page=25'
      expect(action.payload.endpoint.path).to.contain(testPath)
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsCards)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsCards)
    })
  })

  context('#loadFeaturedUsers', () => {
    const action = subject.loadFeaturedUsers()

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.loadFeaturedUsers)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/discover/users/onboarding?per_page=25')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsGrid)
    })
  })

  context('#bindDiscoverKey', () => {
    const action = subject.bindDiscoverKey('trending')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.bindDiscoverKey)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.type).to.equal('trending')
    })
  })
})

