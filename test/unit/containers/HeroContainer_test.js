import Immutable from 'immutable'
import { DISCOVER, FOLLOWING, STARRED } from '../../../src/constants/locales/en'
import {
  selectBroadcast,
  selectIsAuthentication,
  selectIsBackgroundCycle,
  selectIsUserProfile,
} from '../../../src/containers/HeroContainer'

describe('HeroContainer', () => {
  context('#selectIsAuthentication', () => {
    it('selects with memoization whether the current route has a authentication promotion', () => {
      let state = Immutable.fromJS({ routing: { location: { pathname: '/enter', change: false } } })
      expect(selectIsAuthentication(state)).to.equal(true)

      state = Immutable.fromJS({ routing: { location: { pathname: '/forgot-password', change: true } } })
      expect(selectIsAuthentication(state)).to.equal(true)
      expect(selectIsAuthentication.recomputations()).to.equal(1)

      state = Immutable.fromJS({ routing: { location: { pathname: '/signup', change: true } } })
      expect(selectIsAuthentication(state)).to.equal(true)
      expect(selectIsAuthentication.recomputations()).to.equal(1)

      const noPromos = [
        '/discover',
        '/discover/stuff',
        '/search',
        '/join',
        '/following',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
      ]
      noPromos.forEach((route) => {
        state = Immutable.fromJS({ routing: { location: { pathname: route, change: false } } })
        expect(selectIsAuthentication(state)).to.equal(false, `${route} should not have a Promotion.`)
      })
      expect(selectIsAuthentication.recomputations()).to.equal(10)
    })
  })

  context('#selectIsBackgroundCycle', () => {
    it('selects with memoization whether the current route has a animated background', () => {
      let state = Immutable.fromJS({ routing: { location: { pathname: '/join', change: false } } })
      expect(selectIsBackgroundCycle(state)).to.equal(true)

      const noPromos = [
        '/discover',
        '/enter',
        '/search',
        '/signup',
        '/following',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
      ]
      noPromos.forEach((route) => {
        state = Immutable.fromJS({ routing: { location: { pathname: route, change: false } } })
        expect(selectIsBackgroundCycle(state)).to.equal(false)
      })
      expect(selectIsBackgroundCycle.recomputations()).to.equal(11)
    })
  })

  context('#selectCategoryData', () => { })

  context('#selectIsUserProfile', () => {
    it('selects with memoization whether the current route has a cover', () => {
      let state = Immutable.fromJS({ routing: { location: { pathname: '/mk', change: false } } })
      const props = { params: { username: 'mk' } }
      expect(selectIsUserProfile(state, props)).to.equal(true)

      state = Immutable.fromJS({ routing: { location: { pathname: '/mk/loves', change: true } } })
      expect(selectIsUserProfile(state, props)).to.equal(true)
      expect(selectIsUserProfile.recomputations()).to.equal(1)

      state = Immutable.fromJS({ routing: { location: { pathname: '/mk/following', change: true } } })
      expect(selectIsUserProfile(state, props)).to.equal(true)
      expect(selectIsUserProfile.recomputations()).to.equal(1)

      state = Immutable.fromJS({ routing: { location: { pathname: '/mk/followers', change: true } } })
      expect(selectIsUserProfile(state, props)).to.equal(true)

      state = Immutable.fromJS({ routing: { location: { pathname: '/mk/posts', change: true } } })
      expect(selectIsUserProfile(state, props)).to.equal(true)

      const noCovers = [
        '/',
        '/following',
        '/starred',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
      ]
      noCovers.forEach((route) => {
        state = Immutable.fromJS({ routing: { location: { pathname: route, change: false } } })
        expect(selectIsUserProfile(state)).to.equal(false, `${route} should not have a UserProfile.`)
      })
      expect(selectIsUserProfile.recomputations()).to.equal(8)
    })
  })

  context('#selectBroadcast', () => {
    it('selects with memoization whether the current route has a broadcast message', () => {
      let state = Immutable.fromJS({
        authentication: { isLoggedIn: true },
        gui: { lastDiscoverBeaconVersion: null },
        routing: { location: { pathname: '/discover', change: false } },
      })
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)

      state = Immutable.fromJS({
        authentication: { isLoggedIn: true },
        gui: { lastDiscoverBeaconVersion: null },
        routing: { location: { pathname: '/discover', change: true } },
      })
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)
      expect(selectBroadcast.recomputations()).to.equal(1)

      state = Immutable.fromJS({
        authentication: { isLoggedIn: true },
        gui: { lastDiscoverBeaconVersion: '1' },
        routing: { location: { pathname: '/discover', change: true } },
      })
      expect(selectBroadcast(state)).to.equal(null)

      state = Immutable.fromJS({
        authentication: { isLoggedIn: true },
        gui: { lastFollowingBeaconVersion: null },
        routing: { location: { pathname: '/following', change: true } },
      })
      expect(selectBroadcast(state)).to.equal(FOLLOWING.BEACON_TEXT)

      state = Immutable.fromJS({
        authentication: { isLoggedIn: true },
        gui: { lastFollowingBeaconVersion: '1' },
        routing: { location: { pathname: '/following', change: true } },
      })
      expect(selectBroadcast(state)).to.equal(null)

      state = Immutable.fromJS({
        authentication: { isLoggedIn: true },
        gui: { lastStarredBeaconVersion: null },
        routing: { location: { pathname: '/starred', change: true } },
      })
      expect(selectBroadcast(state)).to.equal(STARRED.BEACON_TEXT)

      state = Immutable.fromJS({
        authentication: { isLoggedIn: true },
        gui: { lastStarredBeaconVersion: '1' },
        routing: { location: { pathname: '/starred', change: true } },
      })
      expect(selectBroadcast(state)).to.equal(null)

      const noBroadcasts = [
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
        '/mk/following',
        '/mk/followers',
      ]
      noBroadcasts.forEach((route) => {
        state = Immutable.fromJS({ routing: { location: { pathname: route, change: false } } })
        expect(selectBroadcast(state)).to.equal(null, `${route} should not have a Broadcast.`)
      })
      expect(selectBroadcast.recomputations()).to.equal(11)
    })
  })
})

