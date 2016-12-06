import Immutable from 'immutable'
import { clearJSON, json, stub, stubJSONStore } from '../../../support/stubs'
import subject from '../../../../src/reducers/experience_updates/posts'
import * as ACTION_TYPES from '../../../../src/constants/action_types'

describe.only('posts experience update', () => {
  let state
  beforeEach(() => {
    stubJSONStore()
    stub('user', { id: 'abc', relationshipPriority: 'self' })
    state = json.setIn(['pages', 'love', 'ids'], Immutable.List(['test']))
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#updatePostLoves', () => {
    it('returns original state if action is not love success or fail', () => {
      expect(subject.updatePostLoves(
        state,
        { payload: {} },
      )).to.equal(state)
    })

    context('on love request', () => {
      let action
      beforeEach(() => {
        const post = state.getIn(['posts', '1'])
        expect(post.get('lovesCount')).to.equal(0)
        expect(post.get('loved')).to.be.false
        action = {
          meta: { resultKey: 'love', updateKey: 'post' },
          payload: { model: post },
          type: ACTION_TYPES.POST.LOVE_REQUEST,
        }
      })

      it('handles POST', () => {
        action.payload.method = 'POST'
        state = subject.updatePostLoves(state, action)
        const updatedPost = state.getIn(['posts', '1'])
        expect(updatedPost.get('lovesCount')).to.equal(1)
        expect(updatedPost.get('loved')).to.be.true
        expect(state.getIn(['pages', 'love', 'ids'])).to.deep.equal(Immutable.List(['test']))
      })

      it('handles DELETE', () => {
        action.payload.method = 'DELETE'
        state = subject.updatePostLoves(state, action)
        const updatedPost = state.getIn(['posts', '1'])
        expect(updatedPost.get('lovesCount')).to.equal(-1)
        expect(updatedPost.get('loved')).to.be.false
      })
    })

    context('on love success', () => {
      let action
      beforeEach(() => {
        const post = state.getIn(['posts', '1'])
        expect(post.get('showLovers')).to.be.undefined
        action = {
          meta: { resultKey: 'love', updateKey: 'post' },
          payload: { model: post },
          type: ACTION_TYPES.POST.LOVE_SUCCESS,
        }
      })

      it('handles POST', () => {
        action.payload.method = 'POST'
        state = subject.updatePostLoves(state, action)
        const updatedPost = state.getIn(['posts', '1'])
        expect(updatedPost.get('showLovers')).to.be.true
        expect(state.getIn(['pages', 'love', 'ids'])).to.deep.equal(Immutable.List(['abc', 'test']))
      })

      it('handles DELETE', () => {
        action.payload.method = 'DELETE'
        state = subject.updatePostLoves(state, action)
        const updatedPost = state.getIn(['posts', '1'])
        expect(updatedPost.get('showLovers')).to.be.false
      })
    })

    context('on love failure', () => {
      let action
      beforeEach(() => {
        const post = state.getIn(['posts', '1'])
        expect(post.get('lovesCount')).to.equal(0)
        expect(post.get('loved')).to.be.false
        action = {
          meta: { resultKey: 'love', updateKey: 'post' },
          payload: { model: post },
          type: ACTION_TYPES.POST.LOVE_FAILURE,
        }
      })

      it('handles POST', () => {
        action.payload.method = 'POST'
        state = subject.updatePostLoves(state, action)
        const updatedPost = state.getIn(['posts', '1'])
        expect(updatedPost.get('lovesCount')).to.equal(-1)
        expect(updatedPost.get('loved')).to.be.false
      })

      it('handles DELETE', () => {
        action.payload.method = 'DELETE'
        state = subject.updatePostLoves(state, action)
        const updatedPost = state.getIn(['posts', '1'])
        expect(updatedPost.get('lovesCount')).to.equal(1)
        expect(updatedPost.get('loved')).to.be.true
      })
    })
  })

  describe('#updatePostWatch', () => {
    it('should be tested')
  })

  describe('#addOrUpdatePost', () => {
    it('should be tested')
  })

  describe('#toggleComments', () => {
    it('should be tested')
  })

  describe('#toggleEditing', () => {
    it('should be tested')
  })

  describe('#toggleLovers', () => {
    it('should be tested')
  })

  describe('#toggleReposting', () => {
    it('should be tested')
  })

  describe('#toggleReposters', () => {
    it('should be tested')
  })
})

