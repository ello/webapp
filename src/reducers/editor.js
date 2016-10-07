import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist/constants'
import get from 'lodash/get'
import { AUTHENTICATION, EDITOR, PROFILE } from '../constants/action_types'
import editorMethods from '../helpers/editor_helper'

export const initialState = {
  completions: {},
}
const map = fromJS(initialState)

export default (state = initialState, action) => {
  const editorId = get(action, 'payload.editorId')
  const editor = map.get(editorId) || null
  if (editorId) {
    const editorObj = editorMethods.getEditorObject(editor, action)
    // map.mergeDeep({ editorId:  })
    // newState[editorId] = editorMethods.getEditorObject(newState[editorId], action)
    if (action.type === EDITOR.INITIALIZE) {
      map.setIn([editorId, 'shouldPersist'], get(action, 'payload.shouldPersist', false))
      // newState[editorId].shouldPersist = get(action, 'payload.shouldPersist', false)
    } else if (editor) {
      map.setIn([editorId, 'hasContent'], editorMethods.hasContent(editor.toJS()))
      // newState[editorId] = editorMethods.addHasContent(newState[editorId])
      map.setIn([editorId, 'hasMedia'], editorMethods.hasMedia(editor.toJS()))
      // newState[editorId] = editorMethods.addHasMedia(newState[editorId])
      map.setIn([editorId, 'hasMention'], editorMethods.hasMention(editor.toJS()))
      // newState[editorId] = editorMethods.addHasMention(newState[editorId])
      map.setIn([editorId, 'isLoading'], editorMethods.isLoading(editor.toJS()))
      // newState[editorId] = editorMethods.addIsLoading(newState[editorId])
    }
    return map.toJS()
  }
  switch (action.type) {
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return initialState
    case EDITOR.CLEAR_AUTO_COMPLETERS:
      return map.set('completions', null).toJS()
      // delete newState.completions
      // return newState
    case EDITOR.EMOJI_COMPLETER_SUCCESS:
    case EDITOR.USER_COMPLETER_SUCCESS:
      return map.set('completions', editorMethods.getCompletions(action)).toJS()
      // return editorMethods.addCompletions(newState, action)
    case REHYDRATE:
      if (action.payload.editor) {
        return editorMethods.rehydrateEditors(action.payload.editor)
      }
      return state
    default:
      return state
  }
}

export { editorMethods }

