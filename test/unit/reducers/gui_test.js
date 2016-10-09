import { LOCATION_CHANGE } from 'react-router-redux'
import {
  AUTHENTICATION,
  EDITOR,
  GUI,
  HEAD_FAILURE,
  HEAD_SUCCESS,
  LOAD_STREAM_SUCCESS,
  OMNIBAR,
  PROFILE,
  SET_LAYOUT_MODE,
  ZEROS,
} from '../../../src/constants/action_types'
import { gui as reducer, setLocation, findLayoutMode } from '../../../src/reducers/gui'

describe('gui reducer', () => {
  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {})
      ).to.have.keys(
      'activeNotificationsType',
      'activeUserFollowingType',
      'columnCount',
      'discoverKeyType',
      'homeStream',
      'innerHeight',
      'innerWidth',
      'isCompleterActive',
      'isGridMode',
      'isNavbarHidden',
      'isNotificationsActive',
      'isNotificationsUnread',
      'isOmnibarActive',
      'isProfileMenuActive',
      'isTextToolsActive',
      'lastDiscoverBeaconVersion',
      'lastFollowingBeaconVersion',
      'lastNotificationCheck',
      'lastStarredBeaconVersion',
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
      const initialState = reducer()
      expect(findLayoutMode(initialState.modes).label).to.equal('root')
    })
  })

  context('AUTHENTICATION', () => {
    it('LOGOUT resets the discoverKeyType', () => {
      const testState = { ...reducer(undefined, {}), discoverKeyType: 'wiketywhack' }
      expect(reducer(testState, {})).to.have.property('discoverKeyType', 'wiketywhack')
      const action = { type: AUTHENTICATION.LOGOUT }
      expect(reducer(reducer, action)).to.have.property('discoverKeyType', null)
    })
  })

  context('EDITOR', () => {
    it('EDITOR.SET_IS_COMPLETER_ACTIVE updates isCompleterActive', () => {
      expect(reducer(undefined, {})).to.have.property('isCompleterActive', false)
      const isCompleterActive = true
      const action = { type: EDITOR.SET_IS_COMPLETER_ACTIVE, payload: { isCompleterActive } }
      expect(reducer(reducer, action)).to.have.property('isCompleterActive', true)
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
      const result = reducer(reducer, action)
      expect(result).to.have.property('isTextToolsActive', true)
      expect(result.textToolsStates).to.have.property('isLinkActive', false)
      expect(result.textToolsStates).to.have.property('isBoldActive', true)
      expect(result.textToolsStates).to.have.property('isItalicActive', false)
    })

    it('EDITOR.SET_TEXT_TOOLS_COORDINATES updates textToolsCoordinates', () => {
      const defaults = reducer(undefined, {})
      expect(defaults.textToolsCoordinates).to.have.property('top', -200)
      expect(defaults.textToolsCoordinates).to.have.property('left', -666)
      const action = {
        type: EDITOR.SET_TEXT_TOOLS_COORDINATES,
        payload: {
          textToolsCoordinates: { top: 0, left: 20 },
        },
      }
      const result = reducer(reducer, action)
      expect(result.textToolsCoordinates).to.have.property('top', 0)
      expect(result.textToolsCoordinates).to.have.property('left', 20)
    })
  })

  context('GUI', () => {
    it('GUI.BIND_DISCOVER_KEY updates discoverKeyType', () => {
      expect(reducer(undefined, {})).to.have.property('discoverKeyType', null)
      const action = { type: GUI.BIND_DISCOVER_KEY, payload: { type: 'radical' } }
      expect(reducer(reducer, action)).to.have.property('discoverKeyType', 'radical')
    })

    it('GUI.NOTIFICATIONS_TAB updates activeNotificationsType', () => {
      expect(reducer(undefined, {})).to.have.property('activeNotificationsType', 'all')
      const action = { type: GUI.NOTIFICATIONS_TAB, payload: { activeTabType: 'comments' } }
      expect(reducer(reducer, action)).to.have.property('activeNotificationsType', 'comments')
    })

    it('GUI.SET_ACTIVE_USER_FOLLOWING_TYPE updates activeUserFollowingType', () => {
      expect(reducer(undefined, {})).to.have.property('activeUserFollowingType', 'friend')
      const action = { type: GUI.SET_ACTIVE_USER_FOLLOWING_TYPE, payload: { tab: 'noise' } }
      expect(reducer(reducer, action)).to.have.property('activeUserFollowingType', 'noise')
    })

    it('GUI.SET_IS_PROFILE_MENU_ACTIVE updates isProfileMenuActive', () => {
      expect(reducer(undefined, {})).to.have.property('isProfileMenuActive', false)
      const isProfileMenuActive = true
      const action = { type: GUI.SET_IS_PROFILE_MENU_ACTIVE, payload: { isProfileMenuActive } }
      expect(reducer(reducer, action)).to.have.property('isProfileMenuActive', true)
    })

    it('GUI.SET_LAST_DISCOVER_BEACON_VERSION updates the lastDiscoverBeaconVersion', () => {
      expect(reducer(undefined, {})).to.have.property('lastDiscoverBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_DISCOVER_BEACON_VERSION, payload: { version: '1' } }
      expect(reducer(undefined, action)).to.have.property('lastDiscoverBeaconVersion', '1')
    })

    it('GUI.SET_LAST_FOLLOWING_BEACON_VERSION updates lastFollowingBeaconVersion', () => {
      expect(reducer(undefined, {})).to.have.property('lastFollowingBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_FOLLOWING_BEACON_VERSION, payload: { version: '666' } }
      expect(reducer(undefined, action)).to.have.property('lastFollowingBeaconVersion', '666')
    })

    it('GUI.LAST_STARRED_BEACON_VERSION updates lastStarredBeaconVersion', () => {
      expect(reducer(undefined, {})).to.have.property('lastStarredBeaconVersion', '0')
      const action = { type: GUI.SET_LAST_STARRED_BEACON_VERSION, payload: { version: '667' } }
      expect(reducer(undefined, action)).to.have.property('lastStarredBeaconVersion', '667')
    })

    it('GUI.SET_IS_NAVBAR_HIDDEN updates properties from the initialScrollState', () => {
      const initialState = reducer(undefined, {})
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
      const initialState = reducer(undefined, {})
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
      expect(nextState.columnCount).to.equal(4)
      expect(nextState.innerHeight).to.equal(768)
      expect(nextState.innerWidth).to.equal(1360)
    })

    it('GUI.TOGGLE_NOTIFICATIONS updates isNotificationsActive', () => {
      expect(reducer(undefined, {})).to.have.property('isNotificationsActive', false)
      const isNotificationsActive = true
      const action = { type: GUI.TOGGLE_NOTIFICATIONS, payload: { isNotificationsActive } }
      expect(reducer(reducer, action)).to.have.property('isNotificationsActive', true)
    })
  })

  context('HEAD', () => {
    it('HEAD_FAILURE updates isNotificationsUnread', () => {
      const testState = { ...reducer(undefined, {}), isNotificationsUnread: true }
      expect(reducer(testState, {})).to.have.property('isNotificationsUnread', true)
      const action = { type: HEAD_FAILURE }
      expect(reducer(reducer, action)).to.have.property('isNotificationsUnread', false)
    })

    it('HEAD_SUCCESS updates isNotificationsUnread', () => {
      expect(reducer(undefined, {})).to.have.property('isNotificationsUnread', false)
      const action = { type: HEAD_SUCCESS, payload: { serverStatus: 204 } }
      expect(reducer(reducer, action)).to.have.property('isNotificationsUnread', true)
    })
  })

  context('LOAD_STREAM_SUCCESS', () => {
    it('LOAD_STREAM_SUCCESS updates lastNotificationCheck', () => {
      const action = { type: LOAD_STREAM_SUCCESS, meta: { resultKey: '/discover' } }
      const initialState = reducer(undefined, {})
      const nextState = reducer(initialState, action)
      // faking a tick of the frame :)
      const initialTime = new Date(initialState.lastNotificationCheck).getTime() - 60
      const nextTime = new Date(nextState.lastNotificationCheck).getTime()
      expect(initialTime).to.be.below(nextTime)
    })

    it('LOAD_STREAM_SUCCESS does not update red dot when stream is a notification', () => {
      const action = { type: LOAD_STREAM_SUCCESS, meta: { resultKey: '/notifications' } }
      const initialState = { ...reducer(undefined, {}), isNotificationsUnread: true }
      expect(initialState).to.have.property('isNotificationsUnread', true)
      const nextState = reducer(initialState, action)
      expect(nextState).to.have.property('isNotificationsUnread', false)
    })
  })

  context('LOCATION_CHANGE', () => {
    it('LOCATION_CHANGE updates relevant streams to homeStream', () => {
      const action = { type: LOCATION_CHANGE, payload: { pathname: '/discover/trending' } }
      expect(reducer(undefined, action)).to.have.property('homeStream', '/discover/trending')
    })

    it('LOCATION_CHANGE updates the current grid mode', () => {
      const action1 = { type: LOCATION_CHANGE, payload: { pathname: '/following' } }
      expect(reducer(undefined, action1)).to.have.property('isGridMode', true)

      const action2 = { type: LOCATION_CHANGE, payload: { pathname: '/starred' } }
      expect(reducer(undefined, action2)).to.have.property('isGridMode', false)
    })
  })

  context('OMNIBAR', () => {
    it('OMNIBAR.OPEN sets isOmnibarActive to true', () => {
      expect(reducer(undefined, {})).to.have.property('isOmnibarActive', false)
      const action = { type: OMNIBAR.OPEN, payload: { isActive: true } }
      expect(reducer(reducer, action)).to.have.property('isOmnibarActive', true)
    })

    it('OMNIBAR.CLOSE sets isOmnibarActive to false', () => {
      const testState = { ...reducer(undefined, {}), isOmnibarActive: true }
      expect(testState).to.have.property('isOmnibarActive', true)
      const action = { type: OMNIBAR.CLOSE, payload: { isActive: false } }
      expect(reducer(testState, action)).to.have.property('isOmnibarActive', false)
    })
  })

  context('PROFILE', () => {
    it('DELETE_SUCCESS resets to the initialState', () => {
      const firstState = reducer(undefined, {})
      const testState = { ...reducer(undefined, {}), isNotificationsUnread: true }
      expect(reducer(testState, {})).to.have.property('isNotificationsUnread', true)
      const action = { type: PROFILE.DELETE_SUCCESS }
      const resetState = reducer(testState, action)
      expect(resetState).to.deep.equal(firstState)
    })
  })

  context('SET_LAYOUT_MODE', () => {
    it('SET_LAYOUT_MODE updates the grid mode', () => {
      setLocation({ pathname: '/discover' })
      const listAction = { type: SET_LAYOUT_MODE, payload: { mode: 'list' } }
      const initialState = reducer(undefined, {})
      expect(reducer(initialState, listAction)).to.have.property('isGridMode', false)
    })

    it('SET_LAYOUT_MODE aborts when the grid is the same', () => {
      setLocation({ pathname: '/discover' })
      const gridAction = { type: SET_LAYOUT_MODE, payload: { mode: 'grid' } }
      const initialState = reducer(undefined, {})
      expect(reducer(initialState, gridAction)).to.have.property('isGridMode', true)
    })
  })

  context('ZEROS', () => {
    it('ZEROS.SAY_HELLO adds the username to saidHelloTo', () => {
      const firstState = reducer(undefined, {})
      expect(firstState).to.have.property('saidHelloTo')
      expect(firstState.saidHelloTo.length).to.equal(0)
      const action = { type: ZEROS.SAY_HELLO, payload: { username: 'timmy' } }
      const nextState = reducer(firstState, action)
      expect(nextState.saidHelloTo).to.deep.equal(['timmy'])
      const lastAction = { type: ZEROS.SAY_HELLO, payload: { username: 'tommy' } }
      const lastState = reducer(nextState, lastAction)
      expect(lastState.saidHelloTo).to.deep.equal(['timmy', 'tommy'])
    })
  })
})

