/* eslint-disable new-cap */
import Immutable from 'immutable'
import { REHYDRATE } from 'redux-persist/constants'
import { default as reducer, editorMethods, initialState } from '../../../src/reducers/editor'
import { AUTHENTICATION, EDITOR, PROFILE } from '../../../src/constants/action_types'

describe('editor reducer', () => {
  describe('@initialState', () => {
    it('should have the correct default properties', () => {
      expect(initialState.completions).to.be.empty
    })
  })

  describe('#editor', () => {
    let action = null
    let state = null

    context('with an editorId', () => {
      it('calls #getEditorObject', () => {
        const spy = sinon.stub(editorMethods, 'getEditorObject')
        action = { payload: { editorId: 666 } }
        state = reducer(undefined, action)
        expect(spy.calledWith(undefined, action)).to.be.true
        expect(state['666']).not.to.be.null
        spy.restore()
      })

      context('action.type === EDITOR.INITIALIZE', () => {
        it('defaults shouldPersist to false', () => {
          action = { payload: { editorId: 666 }, type: EDITOR.INITIALIZE }
          state = reducer(undefined, action)
          expect(state.getIn(['666', 'shouldPersist'])).to.be.false
        })

        it('sets shouldPersist to true', () => {
          action = { payload: { editorId: 666, shouldPersist: true }, type: EDITOR.INITIALIZE }
          state = reducer(undefined, action)
          expect(state.getIn(['666', 'shouldPersist'])).to.be.true
        })
      })

      context('editor exists', () => {
        it('calls #hasContent, #hasMedia, #hasMention, and #isLoading', () => {
          action = { payload: { editorId: 666 } }
          const contentSpy = sinon.stub(editorMethods, 'hasContent')
          const mediaSpy = sinon.stub(editorMethods, 'hasMedia')
          const mentionSpy = sinon.stub(editorMethods, 'hasMention')
          const loadingSpy = sinon.stub(editorMethods, 'isLoading')
          state = reducer(Immutable.Map({ 666: Immutable.Map() }), action)
          expect(contentSpy.called).to.be.true
          expect(mediaSpy.called).to.be.true
          expect(mentionSpy.called).to.be.true
          expect(loadingSpy.called).to.be.true
        })
      })
    })

    context('without an editorId', () => {
      it('returns the initialState with AUTHENTICATION.LOGOUT', () => {
        action = { type: AUTHENTICATION.LOGOUT }
        state = reducer(undefined, action)
        expect(state).to.deep.equal(initialState)
      })

      it('returns the initialState with PROFILE.DELETE_SUCCESS', () => {
        action = { type: PROFILE.DELETE_SUCCESS }
        state = reducer(undefined, action)
        expect(state).to.deep.equal(initialState)
      })

      it('clears out completions with EDITOR.CLEAR_AUTO_COMPLETERS', () => {
        action = { type: EDITOR.CLEAR_AUTO_COMPLETERS }
        state = reducer(Immutable.Map({ completions: Immutable.List(['1', '2', '3']) }), action)
        expect(state.completions).to.be.undefined
      })

      it('calls #getCompletions with EDITOR.EMOJI_COMPLETER_SUCCESS', () => {
        const spy = sinon.stub(editorMethods, 'getCompletions')
        action = { type: EDITOR.EMOJI_COMPLETER_SUCCESS }
        state = reducer(Immutable.Map({ completions: Immutable.List(['1', '2', '3']) }), action)
        expect(spy.called).to.be.true
        spy.restore()
      })

      it('calls #getCompletions with EDITOR.USER_COMPLETER_SUCCESS', () => {
        const spy = sinon.stub(editorMethods, 'getCompletions')
        action = { type: EDITOR.USER_COMPLETER_SUCCESS }
        state = reducer(Immutable.Map({ completions: Immutable.List(['1', '2', '3']) }), action)
        expect(spy.called).to.be.true
        spy.restore()
      })

      it('calls #rehydrateEditors with REHYDRATE', () => {
        const spy = sinon.stub(editorMethods, 'rehydrateEditors')
        action = { type: REHYDRATE, payload: { editor: 'yo' } }
        state = reducer({}, action)
        expect(spy.calledWith('yo')).to.be.true
        spy.restore()
      })

      it('returns the original state if action.type is not supported', () => {
        const newState = { prop1: '1', prop2: '2' }
        state = reducer(newState, {})
        expect(state).to.equal(newState)
      })
    })
  })
})

