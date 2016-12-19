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
      let state = { routing: Immutable.fromJS({ location: { pathname: '/enter', change: false } }) }
      expect(selectIsAuthentication(state)).to.equal(true)

      state = { routing: Immutable.fromJS({ location: { pathname: '/forgot-password', change: true } }) }
      expect(selectIsAuthentication(state)).to.equal(true)
      expect(selectIsAuthentication.recomputations()).to.equal(1)

      state = { routing: Immutable.fromJS({ location: { pathname: '/signup', change: true } }) }
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
        state = { routing: Immutable.fromJS({ location: { pathname: route, change: false } }) }
        expect(selectIsAuthentication(state)).to.equal(false, `${route} should not have a Promotion.`)
      })
      expect(selectIsAuthentication.recomputations()).to.equal(10)
    })
  })

  context('#selectIsBackgroundCycle', () => {
    it('selects with memoization whether the current route has a animated background', () => {
      let state = { routing: Immutable.fromJS({ location: { pathname: '/join', change: false } }) }
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
        state = { routing: Immutable.fromJS({ location: { pathname: route, change: false } }) }
        expect(selectIsBackgroundCycle(state)).to.equal(false)
      })
      expect(selectIsBackgroundCycle.recomputations()).to.equal(11)
    })
  })

  context('#selectCategoryData', () => { })

  context('#selectIsUserProfile', () => {
    it('selects with memoization whether the current route has a cover', () => {
      let state = { routing: Immutable.fromJS({ location: { pathname: '/mk', change: false } }) }
      const props = { params: { username: 'mk' } }
      expect(selectIsUserProfile(state, props)).to.equal(true)

      state = { routing: Immutable.fromJS({ location: { pathname: '/mk/loves', change: true } }) }
      expect(selectIsUserProfile(state, props)).to.equal(true)
      expect(selectIsUserProfile.recomputations()).to.equal(1)

      state = { routing: Immutable.fromJS({ location: { pathname: '/mk/following', change: true } }) }
      expect(selectIsUserProfile(state, props)).to.equal(true)
      expect(selectIsUserProfile.recomputations()).to.equal(1)

      state = { routing: Immutable.fromJS({ location: { pathname: '/mk/followers', change: true } }) }
      expect(selectIsUserProfile(state, props)).to.equal(true)

      state = { routing: Immutable.fromJS({ location: { pathname: '/mk/posts', change: true } }) }
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
        state = { routing: Immutable.fromJS({ location: { pathname: route, change: false } }) }
        expect(selectIsUserProfile(state)).to.equal(false, `${route} should not have a UserProfile.`)
      })
      expect(selectIsUserProfile.recomputations()).to.equal(8)
    })
  })

  context('#selectBroadcast', () => {
    it('selects with memoization whether the current route has a broadcast message', () => {
      let state = {
        authentication: Immutable.fromJS({ isLoggedIn: true }),
        gui: Immutable.fromJS({ lastDiscoverBeaconVersion: null }),
        routing: Immutable.fromJS({ location: { pathname: '/discover', change: false } }),
      }
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)

      state = {
        authentication: Immutable.fromJS({ isLoggedIn: true }),
        gui: Immutable.fromJS({ lastDiscoverBeaconVersion: null }),
        routing: Immutable.fromJS({ location: { pathname: '/discover', change: true } }),
      }
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)
      expect(selectBroadcast.recomputations()).to.equal(1)

      state = {
        authentication: Immutable.fromJS({ isLoggedIn: true }),
        gui: Immutable.fromJS({ lastDiscoverBeaconVersion: '1' }),
        routing: Immutable.fromJS({ location: { pathname: '/discover', change: true } }),
      }
      expect(selectBroadcast(state)).to.equal(null)

      state = {
        authentication: Immutable.fromJS({ isLoggedIn: true }),
        gui: Immutable.fromJS({ lastFollowingBeaconVersion: null }),
        routing: Immutable.fromJS({ location: { pathname: '/following', change: true } }),
      }
      expect(selectBroadcast(state)).to.equal(FOLLOWING.BEACON_TEXT)

      state = {
        authentication: Immutable.fromJS({ isLoggedIn: true }),
        gui: Immutable.fromJS({ lastFollowingBeaconVersion: '1' }),
        routing: Immutable.fromJS({ location: { pathname: '/following', change: true } }),
      }
      expect(selectBroadcast(state)).to.equal(null)

      state = {
        authentication: Immutable.fromJS({ isLoggedIn: true }),
        gui: Immutable.fromJS({ lastStarredBeaconVersion: null }),
        routing: Immutable.fromJS({ location: { pathname: '/starred', change: true } }),
      }
      expect(selectBroadcast(state)).to.equal(STARRED.BEACON_TEXT)

      state = {
        authentication: Immutable.fromJS({ isLoggedIn: true }),
        gui: Immutable.fromJS({ lastStarredBeaconVersion: '1' }),
        routing: Immutable.fromJS({ location: { pathname: '/starred', change: true } }),
      }
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
        state = {
          authentication: Immutable.Map({ isLoggedIn: true }),
          gui: Immutable.Map(),
          routing: Immutable.fromJS({ location: { pathname: route, change: false } }),
        }
        expect(selectBroadcast(state)).to.equal(null, `${route} should not have a Broadcast.`)
      })
      expect(selectBroadcast.recomputations()).to.equal(11)
    })
  })
})

