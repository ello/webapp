/* eslint-disable new-cap */
import Immutable from 'immutable'
import { REHYDRATE } from 'redux-persist/constants'
import get from 'lodash/get'
import { AUTHENTICATION, EDITOR, PROFILE } from '../constants/action_types'
import editorMethods from '../helpers/editor_helper'

export const initialState = Immutable.Map({ completions: Immutable.Map() })

export default (state = initialState, action) => {
  const editorId = get(action, 'payload.editorId')
  let updatedState = null
  if (editorId) {
    const editor = editorMethods.getEditorObject(state.get(`${editorId}`), action)
    updatedState = state.set(`${editorId}`, editor)
    if (action.type === EDITOR.INITIALIZE) {
      updatedState = state.setIn([`${editorId}`, 'shouldPersist'], get(action, 'payload.shouldPersist', false))
    } else if (editor) {
      updatedState = state.setIn([`${editorId}`, 'hasContent'], editorMethods.hasContent(editor))
        .setIn([`${editorId}`, 'hasMedia'], editorMethods.hasMedia(editor))
        .setIn([`${editorId}`, 'hasMention'], editorMethods.hasMention(editor))
        .setIn([`${editorId}`, 'isLoading'], editorMethods.isLoading(editor))
    }
    return updatedState
  }
  switch (action.type) {
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return initialState
    case EDITOR.CLEAR_AUTO_COMPLETERS:
      return state.set('completions', null)
    case EDITOR.EMOJI_COMPLETER_SUCCESS:
    case EDITOR.USER_COMPLETER_SUCCESS:
    case PROFILE.LOCATION_AUTOCOMPLETE_SUCCESS:
      return state.set('completions', editorMethods.getCompletions(action))
    case REHYDRATE:
      // if (action.payload.editor) {
      //   return editorMethods.rehydrateEditors(action.payload.editor)
      // }
      return state
    default:
      return state
  }
}

export { editorMethods }

