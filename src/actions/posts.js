import { LOAD_STREAM, POST } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { resetEditor } from '../actions/editor'

export function createPost(body, editorId, repostId, repostedFromId) {
  return {
    type: POST.CREATE,
    payload: {
      body: body.length ? { body } : null,
      editorId,
      endpoint: api.createPost(repostId),
      method: 'POST',
    },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      repostId,
      repostedFromId,
      successAction: resetEditor(editorId),
    },
  }
}

export function deletePost(post) {
  return {
    type: POST.DELETE,
    payload: {
      endpoint: api.deletePost(post.id),
      method: 'DELETE',
      model: post,
    },
    meta: {},
  }
}

export function flagPost(post, kind) {
  return {
    type: POST.FLAG,
    payload: {
      endpoint: api.flagPost(post.id, kind),
      method: 'POST',
    },
    meta: {},
  }
}

// commentsAsList needs the "parent post" so that the correct editor is referenced when replying to
// a comment.
export function loadComments(post, addUpdateKey = true) {
  const postId = `${post.id}`
  const obj = {
    type: LOAD_STREAM,
    payload: {
      endpoint: api.commentsForPost(postId),
      postIdOrToken: postId,
    },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
      renderStream: {
        asList: StreamRenderables.commentsAsList(post),
        asGrid: StreamRenderables.commentsAsList(post),
      },
      resultKey: `/posts/${postId}/comments`,
    },
  }
  if (addUpdateKey) {
    obj.meta.updateKey = `/posts/${postId}/`
  }
  return obj
}

export function loadEditablePost(idOrToken) {
  return {
    type: POST.EDITABLE,
    payload: { endpoint: api.editPostDetail(idOrToken) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      updateResult: false,
    },
  }
}

export function loadPostDetail(idOrToken, userIdOrToken) {
  return {
    type: POST.DETAIL,
    payload: {
      endpoint: api.postDetail(idOrToken, userIdOrToken),
      postIdOrToken: idOrToken,
    },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      updateResult: false,
    },
  }
}

export function lovePost(post) {
  return {
    type: POST.LOVE,
    payload: {
      endpoint: api.lovePost(post.id),
      method: 'POST',
      model: post,
    },
    meta: {
      mappingType: MAPPING_TYPES.LOVES,
      resultKey: `/posts/${post.id}/love`,
      updateKey: `/posts/${post.id}/`,
    },
  }
}

export function watchPost(post) {
  return {
    type: POST.WATCH,
    payload: {
      endpoint: api.watchPost(post.id),
      method: 'POST',
      model: post,
    },
    meta: {
      mappingType: MAPPING_TYPES.WATCH,
      resultKey: `/posts/${post.id}/watch`,
      updateKey: `/posts/${post.id}/`,
    },
  }
}

export function toggleComments(post, showComments) {
  return {
    type: POST.TOGGLE_COMMENTS,
    payload: {
      model: post,
      showComments,
    },
  }
}

export function toggleEditing(post, isEditing) {
  return {
    type: POST.TOGGLE_EDITING,
    payload: {
      model: post,
      isEditing,
    },
  }
}

export function toggleLovers(post, showLovers) {
  return {
    type: POST.TOGGLE_LOVERS,
    payload: {
      model: post,
      showLovers,
    },
  }
}

export function toggleReposters(post, showReposters) {
  return {
    type: POST.TOGGLE_REPOSTERS,
    payload: {
      model: post,
      showReposters,
    },
  }
}

export function toggleReposting(post, isReposting) {
  return {
    type: POST.TOGGLE_REPOSTING,
    payload: {
      model: post,
      isReposting,
    },
  }
}

export function unlovePost(post) {
  return {
    type: POST.LOVE,
    payload: {
      endpoint: api.unlovePost(post.id),
      method: 'DELETE',
      model: post,
    },
    meta: {
      resultKey: `/posts/${post.id}/love`,
      updateKey: `/posts/${post.id}/`,
    },
  }
}

export function unwatchPost(post) {
  return {
    type: POST.WATCH,
    payload: {
      endpoint: api.unwatchPost(post.id),
      method: 'DELETE',
      model: post,
    },
    meta: {
      resultKey: `/posts/${post.id}/watch`,
      updateKey: `/posts/${post.id}/`,
    },
  }
}

export function updatePost(post, body, editorId) {
  return {
    type: POST.UPDATE,
    payload: {
      body: { body },
      editorId,
      endpoint: api.updatePost(post.id),
      method: 'PATCH',
      model: post,
    },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
    },
  }
}

