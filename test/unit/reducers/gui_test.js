import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AUTHENTICATION,
  EDITOR,
  GUI,
  HEAD_FAILURE,
  HEAD_SUCCESS,
  LOAD_STREAM_SUCCESS,
  PROFILE,
  SET_LAYOUT_MODE,
  ZEROS,
} from '../../../src/constants/action_types'
import reducer, { convertStateToImmutable, setLocation, findLayoutMode } from '../../../src/reducers/gui'

describe('gui reducer', () => {
  let initialState = null
  beforeEach(() => {
    initialState = reducer(undefined, {})
  })

  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {}),
      ).to.have.keys(
        'activeNotificationsType',
        'columnCount',
        'discoverKeyType',
        'hasLaunchedSignupModal',
        'innerHeight',
        'innerWidth',
        'isCompleterActive',
        'isGridMode',
        'isNavbarHidden',
        'isNotificationsActive',
        'isNotificationsUnread',
        'isProfileMenuActive',
        'isTextToolsActive',
        'lastAnnouncementSeen',
        'lastDiscoverBeaconVersion',
        'lastFollowingBeaconVersion',
        'lastNotificationCheck',
        'notificationScrollPositions',
        'modes',
        'saidHelloTo',
        'textToolsCoordinates',
        'textToolsStates',
      )
    })
  })

  context('#findLayoutMode', () => {
    it('/', () => {
      setLocation({ pathname: '/' })
      expect(findLayoutMode(initialState.get('modes'))).to.equal(0)
    })
  })

  context('AUTHENTICATION', () => {
    it('LOGOUT_SUCCESS resets the discoverKeyType', () => {
      const newState = reducer(initialState, { type: GUI.BIND_DISCOVER_KEY, payload: { type: 'wiketywhack' } })
      expect(newState).to.have.property('discoverKeyType', 'wiketywhack')
      const action = { type: AUTHENTICATION.LOGOUT_SUCCESS }
      expect(reducer(newState, action)).to.have.property('discoverKeyType', null)
    })
  })

  context('EDITOR', () => {
    it('EDITOR.SET_IS_COMPLETER_ACTIVE updates isCompleterActive', () => {
      expect(reducer(undefined, {})).to.have.property('isCompleterActive', false)
      const isCompleterActive = true
      const action = { type: EDITOR.SET_IS_COMPLETER_ACTIVE, payload: { isCompleterActive } }
      expect(reducer(undefined, action)).to.have.property('isCompleterActive', true)
    })

    it('EDITOR.SET_IS_TEXT_TOOLS_ACTIVE updates isTextToolsActive', () => {
      expect(reducer(undefined, {})).to.have.property('isTextToolsActive', false)
      const action = {
        type: EDITOR.SET_IS_TEXT_TOOLS_ACTIVE,
        payload: {
          isTextToolsActive: true,
          textToolsStates: { isLinkActive: false, isBoldActive: true, isItalicActive: false },
        },
      }
      const result = reducer(undefined, action)
      expect(result).to.have.property('isTextToolsActive', true)
      expect(result.get('textToolsStates')).to.have.property('isLinkActive', false)
      expect(result.get('textToolsStates')).to.have.property('isBoldActive', true)
      expect(result.get('textToolsStates')).to.have.property('isItalicActive', false)
    })

    it('EDITOR.SET_TEXT_TOOLS_COORDINATES updates textToolsCoordinates', () => {
      const defaults = reducer(undefined, {})
      expect(defaults.get('textToolsCoordinates')).to.have.property('top', -200)
      expect(defaults.get('textToolsCoordinates')).to.have.property('left', -666)
      const action = {
        type: EDITOR.SET_TEXT_TOOLS_COORDINATES,
        payload: {
          textToolsCoordinates: { top: 0, left: 20 },
        },
      }
      const result = reducer(defaults, action)
      expect(result.get('textToolsCoordinates')).to.have.property('top', 0)
      expect(result.get('textToolsCoordinates')).to.have.property('left', 20)
    })
  })

  context('GUI', () => {
    it('GUI.BIND_DISCOVER_KEY updates discoverKeyType', () => {
      expect(initialState).to.have.property('discoverKeyType', null)
      const action = { type: GUI.BIND_DISCOVER_KEY, payload: { type: 'radical' } }
      expect(reducer(initialState, action)).to.have.property('discoverKeyType', 'radical')
    })

    it('GUI.NOTIFICATIONS_TAB updates activeNotificationsType', () => {
      expect(initialState).to.have.property('activeNotificationsType', 'all')
      const action = { type: GUI.NOTIFICATIONS_TAB, payload: { activeTabType: 'comments' } }
      expect(reducer(initialState, action)).to.have.property('activeNotificationsType', 'comments')
    })

    it('GUI.SET_IS_PROFILE_MENU_ACTIVE updates isProfileMenuActive', () => {
      expect(initialState).to.have.property('isProfileMenuActive', false)
      const isProfileMenuActive = true
      const action = { type: GUI.SET_IS_PROFILE_MENU_ACTIVE, payload: { isProfileMenuActive } }
      expect(reducer(initialState, action)).to.have.property('isProfileMenuActive', true)
    })

    it('GUI.SET_LAST_ANNOUNCEMENT_SEEN updates the lastAnnouncementSeen', () => {
      expect(initialState).to.have.property('lastAnnouncementSeen', '0')
      const action = { type: GUI.SET_LAST_ANNOUNCEMENT_SEEN, payload: { id: '1' } }
      expect(reducer(initialState, action)).to.have.property('lastAnnouncementSeen', '1')
    })

    it('GUI.SET_LAST_DISCOVER_BEACON_VERSION updates the lastDiscoverBeaconVersion', () => {
      expect(initialState).to.have.property('lastDiscoverBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_DISCOVER_BEACON_VERSION, payload: { version: '1' } }
      expect(reducer(initialState, action)).to.have.property('lastDiscoverBeaconVersion', '1')
    })

    it('GUI.SET_LAST_FOLLOWING_BEACON_VERSION updates lastFollowingBeaconVersion', () => {
      expect(initialState).to.have.property('lastFollowingBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_FOLLOWING_BEACON_VERSION, payload: { version: '666' } }
      expect(reducer(initialState, action)).to.have.property('lastFollowingBeaconVersion', '666')
    })

    it('GUI.SET_NOTIFICATION_SCROLL_Y updates notificationScrollPositions', () => {
      expect(initialState).to.have.property('notificationScrollPositions', Immutable.Map())
      const action = { type: GUI.SET_NOTIFICATION_SCROLL_Y, payload: { category: 'all', scrollY: 666 } }
      expect(reducer(initialState, action).getIn(['notificationScrollPositions', 'all'])).to.equal(666)
    })

    it('GUI.SET_SIGNUP_MODAL_LAUNCHED updates hasLaunchedSignupModal', () => {
      expect(reducer(undefined, {})).to.have.property('hasLaunchedSignupModal', false)
      const action = {
        type: GUI.SET_SIGNUP_MODAL_LAUNCHED,
        payload: { hasLaunchedSignupModal: true },
      }
      expect(reducer(undefined, action)).to.have.property('hasLaunchedSignupModal', true)
    })

    it('GUI.SET_IS_NAVBAR_HIDDEN updates properties from the initialScrollState', () => {
      expect(initialState).to.have.property('isNavbarHidden', false)

      const action = {
        type: GUI.SET_IS_NAVBAR_HIDDEN,
        payload: {
          isNavbarHidden: true,
        },
      }

      const nextState = reducer(initialState, action)
      expect(nextState).to.have.property('isNavbarHidden', true)
    })

    it('GUI.SET_VIEWPORT_SIZE_ATTRIBUTES', () => {
      expect(initialState).to.have.property('columnCount', 2)
      expect(initialState).to.have.property('innerHeight', 0)
      expect(initialState).to.have.property('innerWidth', 0)
      const action = {
        type: GUI.SET_VIEWPORT_SIZE_ATTRIBUTES,
        payload: {
          columnCount: 4,
          innerHeight: 768,
          innerWidth: 1360,
        },
      }

      const nextState = reducer(initialState, action)
      expect(nextState.get('columnCount')).to.equal(4)
      expect(nextState.get('innerHeight')).to.equal(768)
      expect(nextState.get('innerWidth')).to.equal(1360)
    })

    it('GUI.TOGGLE_NOTIFICATIONS updates isNotificationsActive', () => {
      expect(initialState).to.have.property('isNotificationsActive', false)
      const isNotificationsActive = true
      const action = { type: GUI.TOGGLE_NOTIFICATIONS, payload: { isNotificationsActive } }
      expect(reducer(initialState, action)).to.have.property('isNotificationsActive', true)
    })
  })

  context('HEAD', () => {
    it('HEAD_FAILURE updates isNotificationsUnread', () => {
      const testState = initialState.set('isNotificationsUnread', true)
      expect(testState).to.have.property('isNotificationsUnread', true)
      const action = { type: HEAD_FAILURE }
      expect(reducer(testState, action)).to.have.property('isNotificationsUnread', false)
    })

    it('HEAD_SUCCESS updates isNotificationsUnread', () => {
      expect(initialState).to.have.property('isNotificationsUnread', false)
      const action = { type: HEAD_SUCCESS, payload: { serverStatus: 204 } }
      expect(reducer(initialState, action)).to.have.property('isNotificationsUnread', true)
    })
  })

  context('LOAD_STREAM_SUCCESS', () => {
    it('LOAD_STREAM_SUCCESS updates lastNotificationCheck', () => {
      const action = { type: LOAD_STREAM_SUCCESS, meta: { resultKey: '/discover' } }
      const nextState = reducer(initialState, action)
      // faking a tick of the frame :)
      const initialTime = new Date(initialState.get('lastNotificationCheck')).getTime() - 60
      const nextTime = new Date(nextState.get('lastNotificationCheck')).getTime()
      expect(initialTime).to.be.below(nextTime)
    })

    it('LOAD_STREAM_SUCCESS does not update red dot when stream is a notification', () => {
      const action = { type: LOAD_STREAM_SUCCESS, meta: { resultKey: '/notifications' } }
      const nextState = reducer(initialState, {}).set('isNotificationsUnread', true)
      expect(nextState).to.have.property('isNotificationsUnread', true)
      const finalState = reducer(nextState, action)
      expect(finalState).to.have.property('isNotificationsUnread', false)
    })
  })

  context('LOCATION_CHANGE', () => {
    it('LOCATION_CHANGE updates the current grid mode', () => {
      const action1 = { type: LOCATION_CHANGE, payload: { pathname: '/following' } }
      expect(reducer(undefined, action1)).to.have.property('isGridMode', true)
    })
  })

  context('PROFILE', () => {
    it('DELETE_SUCCESS resets to the initialState', () => {
      const testState = initialState.set('isNotificationsUnread', true)
      expect(reducer(testState, {})).to.have.property('isNotificationsUnread', true)
      const action = { type: PROFILE.DELETE_SUCCESS }
      const resetState = reducer(testState, action)
      expect(resetState).to.deep.equal(initialState)
    })
  })

  context('SET_LAYOUT_MODE', () => {
    it('SET_LAYOUT_MODE updates the grid mode', () => {
      setLocation({ pathname: '/discover' })
      const listAction = { type: SET_LAYOUT_MODE, payload: { mode: 'list' } }
      expect(reducer(initialState, listAction)).to.have.property('isGridMode', false)
    })

    it('SET_LAYOUT_MODE aborts when the grid is the same', () => {
      setLocation({ pathname: '/discover' })
      const gridAction = { type: SET_LAYOUT_MODE, payload: { mode: 'grid' } }
      expect(reducer(initialState, gridAction)).to.have.property('isGridMode', true)
    })
  })

  context('ZEROS', () => {
    it('ZEROS.SAY_HELLO adds the username to saidHelloTo', () => {
      expect(initialState).to.have.property('saidHelloTo')
      expect(initialState.get('saidHelloTo').size).to.equal(0)
      const action = { type: ZEROS.SAY_HELLO, payload: { username: 'timmy' } }
      const nextState = reducer(initialState, action)
      expect(nextState.get('saidHelloTo')).to.deep.equal(Immutable.List(['timmy']))
      const lastAction = { type: ZEROS.SAY_HELLO, payload: { username: 'tommy' } }
      const lastState = reducer(nextState, lastAction)
      expect(lastState.get('saidHelloTo')).to.deep.equal(Immutable.List(['timmy', 'tommy']))
    })
  })

  it('should migrate from a plain object to an immutable one on v 3.0.22', () => {
    const oldGui = {
      columnCount: 2,
      columnWidth: 137,
      contentWidth: 283,
      coverDPI: 'hdpi',
      deviceSize: 'mobile',
      innerHeight: 700,
      innerWidth: 303,
      isNavbarHidden: false,
      hasLaunchedSignupModal: false,
      isCompleterActive: false,
      isNotificationsActive: false,
      isOmnibarActive: false,
      isProfileMenuActive: false,
      isTextToolsActive: false,
      saidHelloTo: [],
      textToolsCoordinates: {
        top: -200,
        left: -666,
      },
      textToolsStates: {},
      activeNotificationsType: 'all',
      currentStream: '/discover',
      discoverKeyType: 'featured',
      history: {},
      isAuthenticationView: true,
      isGridMode: true,
      isLayoutToolHidden: false,
      isNotificationsUnread: false,
      isOnboardingView: false,
      lastDiscoverBeaconVersion: '0',
      lastFollowingBeaconVersion: '0',
      lastNotificationCheck: 'Mon, 29 Dec 2014 21:28:58 GMT',
      modes: [
        {
          label: 'root',
          mode: 'grid',
          regex: '^/$',
        },
        {
          label: 'discover',
          mode: 'grid',
          regex: '/discover|/explore',
        },
        {
          label: 'following',
          mode: 'list',
          regex: '/following',
        },
        {
          label: 'invitations',
          mode: 'list',
          regex: '/invitations',
        },
        {
          label: 'onboarding',
          mode: 'grid',
          regex: '/onboarding',
        },
        {
          label: 'notifications',
          mode: 'list',
          regex: '/notifications',
        },
        {
          label: 'search',
          mode: 'list',
          regex: '/search|/find',
        },
        {
          label: 'settings',
          mode: 'list',
          regex: '/settings',
        },
        {
          label: 'staff',
          mode: 'list',
          regex: '/staff',
        },
        {
          label: 'posts',
          mode: 'list',
          regex: '/[\\w\\-]+/post/.+',
        },
        {
          label: 'users/following',
          mode: 'list',
          regex: '/[\\w\\-]+/following',
        },
        {
          label: 'users/followers',
          mode: 'grid',
          regex: '/[\\w\\-]+/followers',
        },
        {
          label: 'users/loves',
          mode: 'grid',
          regex: '/[\\w\\-]+/loves',
        },
        {
          label: 'users',
          mode: 'list',
          regex: '/[\\w\\-]+',
        },
      ],
    }
    // test that oldGui gets converted to the immutable type
    expect(convertStateToImmutable(oldGui)).to.deep.equal(initialState.merge(
      {
        lastDiscoverBeaconVersion: '0',
        lastFollowingBeaconVersion: '0',
        lastNotificationCheck: 'Mon, 29 Dec 2014 21:28:58 GMT',
        modes: [
          {
            label: 'root',
            mode: 'grid',
            regex: '^/$',
          },
          {
            label: 'discover',
            mode: 'grid',
            regex: '/discover|/explore',
          },
          {
            label: 'following',
            mode: 'list',
            regex: '/following',
          },
          {
            label: 'invitations',
            mode: 'list',
            regex: '/invitations',
          },
          {
            label: 'onboarding',
            mode: 'grid',
            regex: '/onboarding',
          },
          {
            label: 'notifications',
            mode: 'list',
            regex: '/notifications',
          },
          {
            label: 'search',
            mode: 'list',
            regex: '/search|/find',
          },
          {
            label: 'settings',
            mode: 'list',
            regex: '/settings',
          },
          {
            label: 'staff',
            mode: 'list',
            regex: '/staff',
          },
          {
            label: 'posts',
            mode: 'list',
            regex: '/[\\w\\-]+/post/.+',
          },
          {
            label: 'users/following',
            mode: 'list',
            regex: '/[\\w\\-]+/following',
          },
          {
            label: 'users/followers',
            mode: 'grid',
            regex: '/[\\w\\-]+/followers',
          },
          {
            label: 'users/loves',
            mode: 'grid',
            regex: '/[\\w\\-]+/loves',
          },
          {
            label: 'users',
            mode: 'list',
            regex: '/[\\w\\-]+',
          },
        ],
      },
    ))
  })
})

