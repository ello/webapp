export const LOAD_STREAM = 'LOAD_STREAM'
export const LOAD_STREAM_REQUEST = 'LOAD_STREAM_REQUEST'
export const LOAD_STREAM_SUCCESS = 'LOAD_STREAM_SUCCESS'
export const LOAD_STREAM_FAILURE = 'LOAD_STREAM_FAILURE'
export const STATIC_PAGE = 'STATIC_PAGE'

// Should these be `POST.JSON, POST.FORM` instead?
export const POST_JSON = 'POST_JSON'
export const POST_FORM = 'POST_FORM'


export const SHORTCUT_KEYS = {
  HELP: '?',
  ESC: 'esc',
  SEARCH: 'g s',
  DISCOVER: 'g d',
  ONBOARDING: 'g 0',
  DT_GRID_TOGGLE: 'g `',
  DT_GRID_CYCLE: 'g ~',
}

export const MODALS = {
  OPEN: 'MODAL_OPEN',
  CLOSE: 'MODAL_CLOSE',
}

export const ALERTS = {
  OPEN: 'ALERT_OPEN',
  CLOSE: 'ALERT_CLOSE',
}

export const DT_GRID_TOGGLE = 'DT_GRID_TOGGLE'
export const DT_GRID_CYCLE = 'DT_GRID_CYCLE'


export const PROFILE = {
  LOAD: 'PROFILE_LOAD',
  LOAD_REQUEST: 'PROFILE_LOAD_REQUEST',
  LOAD_SUCCESS: 'PROFILE_LOAD_SUCCESS',
  LOAD_FAILURE: 'PROFILE_LOAD_FAILURE',

  SAVE: 'PROFILE_SAVE',
  SAVE_REQUEST: 'PROFILE_SAVE_REQUEST',
  SAVE_SUCCESS: 'PROFILE_SAVE_SUCCESS',
  SAVE_FAILURE: 'PROFILE_SAVE_FAILURE',

  SAVE_AVATAR: 'PROFILE_SAVE_AVATAR',
  SAVE_AVATAR_REQUEST: 'PROFILE_SAVE_AVATAR_REQUEST',
  SAVE_AVATAR_SUCCESS: 'PROFILE_SAVE_AVATAR_SUCCESS',
  SAVE_AVATAR_FAILURE: 'PROFILE_SAVE_AVATAR_FAILURE',

  SAVE_COVER: 'PROFILE_SAVE_COVER',
  SAVE_COVER_REQUEST: 'PROFILE_SAVE_COVER_REQUEST',
  SAVE_COVER_SUCCESS: 'PROFILE_SAVE_COVER_SUCCESS',
  SAVE_COVER_FAILURE: 'PROFILE_SAVE_COVER_FAILURE',

  TMP_AVATAR_CREATED: 'PROFILE_TMP_AVATAR_CREATED',
  TMP_COVER_CREATED: 'PROFILE_TMP_COVER_CREATED',
}


export const TRACK = {
  EVENT: 'TRACK_EVENT',
  PAGE_VIEW: 'TRACK_PAGE_VIEW',
}

