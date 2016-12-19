import Immutable from 'immutable'
import { json, stub } from '../../support/stubs'
import {
  selectPropsComment,
  selectPropsCommentId,
  selectPropsCommentAuthorId,
  selectIsOwnComment,
  selectCommentFromPropsCommentId,
} from '../../../src/selectors/comment'

describe('comment selectors', () => {
  let stateComment
  let propsComment
  let state
  beforeEach(() => {
    stateComment = stub('comment', { authorId: 'stateComment' })
    propsComment = stub('comment', { authorId: 'propComment', id: '666' })
    state = { json, profile: Immutable.Map() }
  })

  afterEach(() => {
    stateComment = {}
    propsComment = {}
  })

  context('#selectPropsComment', () => {
    it('returns the correct props comment', () => {
      const props = { comment: propsComment }
      expect(selectPropsComment(state, props)).to.deep.equal(propsComment)
    })
  })

  context('#selectPropsCommentId', () => {
    it('returns the correct props comment id', () => {
      const props = { comment: propsComment }
      expect(selectPropsCommentId(state, props)).to.equal('666')
    })
  })

  context('#selectPropsCommentAuthorId', () => {
    it('returns the correct props comment author id', () => {
      const props = { comment: propsComment }
      expect(selectPropsCommentAuthorId(state, props)).to.equal('propComment')
    })
  })

  context('#selectIsOwnComment', () => {
    it('returns if the comment is the users own', () => {
      state = { profile: state.profile.set('id', 'propComment') }
      const props = { comment: propsComment }
      expect(selectIsOwnComment(state, props)).to.equal(true)
    })

    it('returns if the comment is not the users own', () => {
      state = { profile: state.profile.set('id', 'stateComment') }
      const props = { comment: propsComment }
      expect(selectIsOwnComment(state, props)).to.equal(false)
    })
  })

  context('#selectCommentFromPropsCommentId', () => {
    it('returns the comment from json', () => {
      const props = { comment: Immutable.Map({ id: '1' }) }
      expect(selectCommentFromPropsCommentId(state, props)).to.deep.equal(stateComment)
    })
  })
})

