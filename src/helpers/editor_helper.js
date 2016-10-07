import { fromJS } from 'immutable'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import { suggestEmoji } from '../components/completers/EmojiSuggester'
import { userRegex } from '../components/completers/Completer'
import { COMMENT, EDITOR, POST } from '../constants/action_types'

const methods = {}
const initialState = fromJS({
  collection: {},
  hasContent: false,
  hasMedia: false,
  hasMention: false,
  isLoading: false,
  isPosting: false,
  order: [],
  postBuyLink: null,
  shouldPersist: false,
  uid: 0,
})

methods.getCompletions = (action) => {
  const { payload } = action
  if (payload && payload.response) {
    const { type = 'user', word } = payload
    if (type === 'user') {
      return { data: payload.response.autocompleteResults, type }
    } else if (type === 'emoji') {
      return { data: suggestEmoji(word, payload.response.emojis), type }
    }
  }
  return null
}


methods.rehydrateEditors = (persistedEditors = {}) => {
  const editors = {}
  Object.keys(persistedEditors).forEach((item) => {
    const pe = persistedEditors[item]
    if (pe.shouldPersist) {
      // clear out the blobs
      Object.keys(pe.collection).forEach((uid) => {
        const block = pe.collection[uid]
        if (/image/.test(block.kind)) {
          delete block.blob
          pe.collection[uid] = block
        }
      })
      pe.isLoading = false
      pe.isPosting = false
      editors[item] = pe
    }
  })
  return editors
}

methods.hasContent = (state) => {
  const order = state.get('order')
  const firstBlock = state.getIn(['collection', `${order.get(0)}`])
  if (!firstBlock) { return false }
  const data = firstBlock.get('data')
  return !!(order.size > 1 || (data.length && data !== '<br>'))
}

methods.hasMedia = (state) => {
  const collection = state.get('collection')
  const order = state.get('order')
  return order.some(uid => /embed|image/.test(collection.get(`${uid}`).get('kind')))
}

methods.hasMention = (state) => {
  const collection = state.get('collection')
  const order = state.get('order')
  return order.some((uid) => {
    const block = collection.get(`${uid}`)
    return block && /text/.test(block.get('kind')) && userRegex.test(block.get('data'))
  })
}

methods.isLoading = (state) => {
  const collection = state.get('collection')
  let isLoading = collection.valueSeq().some(block =>
    /image/.test(block.get('kind')) && block.get('isLoading')
  )
  const dragBlock = state.get('dragBlock')
  if (!isLoading && dragBlock) { isLoading = dragBlock.get('isLoading') }
  return isLoading
}

methods.add = ({ block, shouldCheckForEmpty = true, state }) => {
  const uid = state.get('uid')
  const newBlock = { ...block, uid }
  const postBuyLink = state.get('postBuyLink')
  if (postBuyLink) {
    newBlock.linkUrl = postBuyLink
  }
  const order = state.get('order')
  const updatedState = state.setIn(['collection', `${uid}`], fromJS(newBlock))
    .set('order', order.push(uid))
    .set('uid', uid + 1)
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(updatedState) }
  return updatedState
}

methods.addEmptyTextBlock = (state, shouldCheckForEmpty = false) => {
  const order = state.get('order')
  const last = state.getIn(['collection', `${order.last()}`])
  if (order.size > 1) {
    const secondToLast = state.getIn(['collection', `${order.get(-2)}`])
    if (/text/.test(secondToLast.get('kind')) && /text/.test(last.get('kind')) && !last.get('data').length) {
      return methods.remove({ shouldCheckForEmpty, state, uid: last.get('uid') })
    }
  }
  if (!order.size || !/text/.test(last.get('kind'))) {
    return methods.add({ block: { data: '', kind: 'text' }, state })
  }
  return state
}

methods.remove = ({ shouldCheckForEmpty = true, state, uid }) => {
  const order = state.get('order')
  const updatedState = state.deleteIn(['collection', `${uid}`])
    .deleteIn(['order', `${order.indexOf(uid)}`])
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(updatedState) }
  return updatedState
}

methods.removeEmptyTextBlock = (state) => {
  const order = state.get('order')
  if (order.size > 0) {
    const last = state.getIn(['collection', `${order.last()}`])
    if (last && /text/.test(last.get('kind')) && !last.get('data').length) {
      return state.deleteIn(['collection', `${last.get('uid')}`])
        .deleteIn(['order', `${order.indexOf(last.get('uid'))}`])
    }
  }
  return state
}

methods.updateBlock = (state, action) => {
  const { block, uid } = action.payload
  return state.setIn(['collection', `${uid}`], fromJS(block))
}

methods.reorderBlocks = (state, action) => {
  const order = state.get('order')
  const { delta, uid } = action.payload
  const index = order.indexOf(uid)
  // remove from old spot and add to new spot
  return state.set('order', order.splice(index, 1).splice(index + delta, 0, uid))
}

methods.appendText = (state, text) => {
  const order = state.get('order')
  const textBlocks = order.filter(uid => /text/.test(state.getIn(['collection', `${uid}`, 'kind'])))
  const lastTextBlock = state.getIn(['collection', `${textBlocks.last()}`])
  if (lastTextBlock) {
    return state.setIn(['collection', `${lastTextBlock.get('uid')}`, 'data'], lastTextBlock.get('data') + text)
  }
  return state
}

methods.appendUsernames = (state, usernames) => {
  const newState = cloneDeep(state)
  const { collection, order } = newState
  const textBlocks = order.filter(orderUid => /text/.test(collection[orderUid].kind))
  const lastTextBlock = collection[textBlocks[textBlocks.length - 1]]
  const text = reduce(usernames, (memo, { username }) => `${memo}@${username} `, '')
  if (lastTextBlock && !lastTextBlock.data.includes(text)) {
    lastTextBlock.data += text
    collection[lastTextBlock.uid] = lastTextBlock
  }
  return newState
}

methods.replaceText = (state, action) => {
  const newState = cloneDeep(state)
  const { collection } = newState
  const { editorId, uid } = action.payload
  if (/text/.test(collection[uid].kind)) {
    const selector = `[data-editor-id="${editorId}"][data-collection-id="${uid}"]`
    const elem = document.querySelector(selector)
    if (elem && elem.firstChild) {
      collection[uid].data = elem.firstChild.innerHTML
    }
  }
  return newState
}

methods.updateBuyLink = (state, action) => {
  const newState = cloneDeep(state)
  const { payload: { link } } = action
  // once individual blocks can get their own links
  // we can rip out this overall property on editor
  newState.postBuyLink = link
  newState.order.forEach((uid) => {
    const block = newState.collection[uid]
    if (link && link.length) {
      block.linkUrl = link
    } else {
      delete block.linkUrl
    }
  })
  return newState
}

methods.getEditorObject = (state = initialState, action) => {
  let newState = cloneDeep(state)
  switch (action.type) {
    case EDITOR.ADD_BLOCK:
      return methods.add({
        block: action.payload.block,
        state: newState,
        shouldCheckForEmpty: action.payload.shouldCheckForEmpty,
      })
    case EDITOR.ADD_DRAG_BLOCK:
      newState.dragBlock = action.payload.block
      return newState
    case EDITOR.ADD_EMPTY_TEXT_BLOCK:
      return methods.addEmptyTextBlock(newState)
    case EDITOR.APPEND_TEXT:
      return methods.appendText(newState, action.payload.text)
    case EDITOR.INITIALIZE:
      if (state.shouldPersist) {
        return state
      }
      return initialState
    case EDITOR.POST_PREVIEW_SUCCESS:
      newState = methods.removeEmptyTextBlock(newState)
      newState = methods.add({
        block: { ...action.payload.response.postPreviews.body[0] },
        state: newState,
      })
      return newState
    case EDITOR.REMOVE_BLOCK:
      return methods.remove({ state: newState, uid: action.payload.uid })
    case EDITOR.REMOVE_DRAG_BLOCK:
      delete newState.dragBlock
      return newState
    case EDITOR.REORDER_BLOCKS:
      return methods.reorderBlocks(newState, action)
    case EDITOR.REPLACE_TEXT:
      return methods.replaceText(newState, action)
    case COMMENT.CREATE_REQUEST:
    case COMMENT.UPDATE_REQUEST:
    case POST.CREATE_REQUEST:
    case POST.UPDATE_REQUEST:
      newState.isPosting = true
      return newState
    case COMMENT.CREATE_SUCCESS:
    case COMMENT.UPDATE_SUCCESS:
    case EDITOR.RESET:
    case POST.CREATE_SUCCESS:
    case POST.UPDATE_SUCCESS:
      return methods.addEmptyTextBlock({ ...initialState, uid: newState.uid })
    case COMMENT.CREATE_FAILURE:
    case COMMENT.UPDATE_FAILURE:
    case POST.CREATE_FAILURE:
    case POST.UPDATE_FAILURE:
      newState.isPosting = false
      return newState
    case EDITOR.LOAD_REPLY_ALL_SUCCESS:
      return methods.appendUsernames(newState, get(action, 'payload.response.usernames', []))
    case EDITOR.SAVE_ASSET_SUCCESS:
      if (newState.dragBlock && newState.dragBlock.uid === action.payload.uid) {
        newState.dragBlock = {
          ...newState.dragBlock,
          data: { url: action.payload.response.url },
          isLoading: false,
        }
      } else {
        newState.collection[action.payload.uid] = {
          ...newState.collection[action.payload.uid],
          data: { url: action.payload.response.url },
          isLoading: false,
        }
      }
      newState.isPosting = false
      return newState
    case EDITOR.TMP_IMAGE_CREATED:
      newState = methods.removeEmptyTextBlock(newState)
      newState = methods.add({
        block: {
          blob: action.payload.url,
          kind: 'image',
          data: {},
          isLoading: true,
        },
        state: newState,
      })
      return newState
    case EDITOR.UPDATE_BUY_LINK:
      return methods.updateBuyLink(newState, action)
    case EDITOR.UPDATE_BLOCK:
      newState = methods.updateBlock(newState, action)
      newState.isPosting = false
      return newState
    default:
      return state
  }
}

export default methods
export { initialState, methods }

