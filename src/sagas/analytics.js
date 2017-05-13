/* eslint-disable no-constant-condition */
import { actionChannel, fork, put, select, take } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'
import get from 'lodash/get'
import { isElloAndroid } from '../lib/jello'
import * as ACTION_TYPES from '../constants/action_types'
import { RELATIONSHIP_PRIORITY } from '../constants/relationship_types'
import { trackEvent as trackEventAction } from '../actions/analytics'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectActiveNotificationsType } from '../selectors/gui'
import { selectPathname } from '../selectors/routing'

let shouldCallInitialTrackPage = false
const agent = isElloAndroid() ? 'android' : 'webapp'

const pageTrackTypes = [
  ACTION_TYPES.GUI.NOTIFICATIONS_TAB,
  ACTION_TYPES.GUI.TOGGLE_NOTIFICATIONS,
  ACTION_TYPES.LOAD_NEXT_CONTENT_REQUEST,
  ACTION_TYPES.TRACK.INITIAL_PAGE,
  LOCATION_CHANGE,
]

function* trackEvent() {
  while (true) {
    const action = yield take(ACTION_TYPES.TRACK.EVENT)
    const { label, options } = action.payload
    if (window.analytics) {
      window.analytics.track(label, { agent, ...options })
    }
  }
}

function* trackEvents() {
  while (true) {
    const action = yield take('*')
    switch (action.type) {
      case ACTION_TYPES.ALERT.OPEN:
      case ACTION_TYPES.MODAL.OPEN:
        if (get(action, 'payload.trackLabel')) {
          yield put(trackEventAction(get(action, 'payload.trackLabel'), get(action, 'payload.trackOptions')))
        }
        break
      case ACTION_TYPES.COMMENT.CREATE_REQUEST:
        yield put(trackEventAction('published_comment'))
        break
      case ACTION_TYPES.COMMENT.DELETE_REQUEST:
        yield put(trackEventAction('deleted_comment'))
        break
      case ACTION_TYPES.OMNIBAR.OPEN:
        yield put(trackEventAction('opened_omnibar'))
        break
      case ACTION_TYPES.POST.CREATE_REQUEST:
        if (get(action, 'payload.body.body[0].link_url', '').length) {
          yield put(trackEventAction('added_buy_button'))
        }
        yield put(trackEventAction(get(action, 'meta.repostId') ? 'published_repost' : 'published_post'))
        break
      case ACTION_TYPES.POST.DELETE_REQUEST:
        yield put(trackEventAction('deleted_post'))
        break
      case ACTION_TYPES.POST.LOVE_REQUEST: {
        const method = get(action, 'payload.method')
        if (method === 'POST') {
          yield put(trackEventAction(get(action, 'payload.trackLabel'), get(action, 'payload.trackOptions')))
        }
        break
      }
      case ACTION_TYPES.POST.WATCH_REQUEST: {
        const method = get(action, 'payload.method')
        if (method === 'DELETE') {
          yield put(trackEventAction('unwatched-post'))
          break
        }
        yield put(trackEventAction('watched-post'))
        break
      }
      case ACTION_TYPES.POST.UPDATE_REQUEST:
        yield put(trackEventAction('edited_post'))
        break
      case ACTION_TYPES.PROFILE.DELETE_REQUEST:
        yield put(trackEventAction('user-deleted-account'))
        break
      case ACTION_TYPES.PROFILE.FOLLOW_CATEGORIES_REQUEST:
        yield put(trackEventAction('Onboarding.Settings.Categories.Completed',
          { categories: get(action, 'payload.body.followed_category_ids', []).length },
        ))
        break
      case ACTION_TYPES.PROFILE.SIGNUP_REQUEST:
        yield put(trackEventAction('clicked_join_button'))
        break
      case ACTION_TYPES.PROFILE.SIGNUP_SUCCESS:
        yield put(trackEventAction('join-successful'))
        break
      case ACTION_TYPES.RELATIONSHIPS.UPDATE_INTERNAL:
      case ACTION_TYPES.RELATIONSHIPS.UPDATE_REQUEST:
        switch (get(action, 'payload.priority')) {
          case RELATIONSHIP_PRIORITY.FRIEND:
          case RELATIONSHIP_PRIORITY.NOISE:
            yield put(trackEventAction('followed_user'))
            break
          case RELATIONSHIP_PRIORITY.INACTIVE:
          case RELATIONSHIP_PRIORITY.NONE:
            yield put(trackEventAction('unfollowed_user'))
            break
          case RELATIONSHIP_PRIORITY.BLOCK:
            yield put(trackEventAction('blocked_user'))
            break
          case RELATIONSHIP_PRIORITY.MUTE:
            yield put(trackEventAction('muted_user'))
            break
          default:
            break
        }
        break
      case ACTION_TYPES.USER.COLLAB_WITH_REQUEST:
        yield put(trackEventAction('send-collab-dialog-profile'))
        break
      case ACTION_TYPES.USER.HIRE_ME_REQUEST:
        yield put(trackEventAction('send-hire-dialog-profile'))
        break
      case LOCATION_CHANGE: {
        const isLoggedIn = yield select(selectIsLoggedIn)
        const pathname = yield select(selectPathname)
        if (isLoggedIn) {
          yield put(trackEventAction('viewed_logged_in_page', { page_name: pathname }))
        } else {
          yield put(trackEventAction('viewed_logged_out_page', { page_name: pathname }))
        }
        break
      }
      default:
        break
    }
  }
}

function* trackPage(pageTrackChannel) {
  while (true) {
    const action = yield take(pageTrackChannel)
    const pageProps = { agent }
    if ((action.type === ACTION_TYPES.LOCATION_CHANGE ||
      action.type === ACTION_TYPES.TRACK.INITIAL_PAGE) && window.analytics) {
      shouldCallInitialTrackPage = true
    }
    if (action.type === ACTION_TYPES.GUI.NOTIFICATIONS_TAB) {
      pageProps.path = `/notifications/${get(action, 'payload.activeTabType', '')}`
    } else if (action.type === ACTION_TYPES.GUI.TOGGLE_NOTIFICATIONS) {
      const lastTabType = yield select(selectActiveNotificationsType)
      pageProps.path = `/notifications/${lastTabType === 'all' ? '' : lastTabType}`
    }
    if (shouldCallInitialTrackPage) {
      window.analytics.page(pageProps)
    }
  }
}

export default function* analytics() {
  const pageTrackChannel = yield actionChannel(pageTrackTypes)
  yield [
    fork(trackEvent),
    fork(trackEvents),
    fork(trackPage, pageTrackChannel),
  ]
}

