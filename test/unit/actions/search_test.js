import { isFSA, isFSAName } from '../../support/test_helpers'
import * as subject from '../../../src/actions/search'
import {
  postsAsGrid, postsAsList, usersAsGrid,
} from '../../../src/components/streams/StreamRenderables'

describe('search actions', () => {
  context('#searchForPosts', () => {
    const action = subject.searchForPosts('big doggies')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.searchForPosts)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/posts?per_page=25&terms=big%20doggies')
    })

    it('has the correct per_page count in the action', () => {
      expect(action.payload.endpoint.params.per_page).to.equal(25)
    })

    it('has the correct terms escaped in the action', () => {
      expect(action.payload.endpoint.params.terms).to.equal('big%20doggies')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('posts')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(postsAsList)
      expect(action.meta.renderStream.asGrid).to.equal(postsAsGrid)
      expect(action.meta.renderStream.asZero).to.exist
    })
  })

  context('#searchForUsers', () => {
    const action = subject.searchForUsers('@mansfield')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has a top level action.type', () => {
      expect(isFSAName(action, subject.searchForUsers)).to.be.true
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/users?per_page=25&terms=%40mansfield')
    })

    it('has the correct per_page count in the action', () => {
      expect(action.payload.endpoint.params.per_page).to.equal(25)
    })

    it('has the correct terms escaped in the action', () => {
      expect(action.payload.endpoint.params.terms).to.equal('%40mansfield')
    })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('users')
    })

    it('has asList, asGrid and asZero properties on renderStreams in the action', () => {
      expect(action.meta.renderStream.asList).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asGrid).to.equal(usersAsGrid)
      expect(action.meta.renderStream.asZero).to.exist
    })
  })
})

