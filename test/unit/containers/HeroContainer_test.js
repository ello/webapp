import { DISCOVER, FOLLOWING, STARRED } from '../../../src/constants/locales/en.js'
import {
  selectBroadcast,
  selectHasCoverProfile,
  selectHasPromotion,
} from '../../../src/containers/HeroContainer'

describe('HeroContainer', () => {
  context('#selectHasPromotion', () => {
    it('selects with memoization whether the current route has a promotion', () => {
      let state = { routing: { location: { pathname: '/search', change: false } } }
      expect(selectHasPromotion(state)).to.equal(true)

      state = { routing: { location: { pathname: '/search', change: true } } }
      expect(selectHasPromotion(state)).to.equal(true)
      expect(selectHasPromotion.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/discover', change: true } } }
      expect(selectHasPromotion(state)).to.equal(true)
      expect(selectHasPromotion.recomputations()).to.equal(2)

      state = { routing: { location: { pathname: '/discover/stuff', change: true } } }
      expect(selectHasPromotion(state)).to.equal(true)

      state = { routing: { location: { pathname: '/', change: true } } }
      expect(selectHasPromotion(state)).to.equal(true)

      const noPromos = [
        '/following',
        '/starred',
        '/settings',
        '/invitations',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk',
        '/mk/loves',
        '/mk/following',
        '/mk/followers',
      ]
      noPromos.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectHasPromotion(state)).to.equal(false, `${route} should not have a Promotion.`)
      })
      expect(selectHasPromotion.recomputations()).to.equal(14)
    })
  })

  context('#selectHasCoverProfile', () => {
    it('selects with memoization whether the current route has a cover', () => {
      let state = { routing: { location: { pathname: '/mk', change: false } } }
      const props = { params: { username: 'mk' } }
      expect(selectHasCoverProfile(state, props)).to.equal(true)

      state = { routing: { location: { pathname: '/mk/loves', change: true } } }
      expect(selectHasCoverProfile(state, props)).to.equal(true)
      expect(selectHasCoverProfile.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/mk/following', change: true } } }
      expect(selectHasCoverProfile(state, props)).to.equal(true)
      expect(selectHasCoverProfile.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/mk/followers', change: true } } }
      expect(selectHasCoverProfile(state, props)).to.equal(true)

      state = { routing: { location: { pathname: '/mk/posts', change: true } } }
      expect(selectHasCoverProfile(state, props)).to.equal(true)

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
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectHasCoverProfile(state)).to.equal(false, `${route} should not have a Cover.`)
      })
      expect(selectHasCoverProfile.recomputations()).to.equal(8)
    })
  })

  context('#selectBroadcast', () => {
    it('selects with memoization whether the current route has a broadcast message', () => {
      let state = {
        gui: { lastDiscoverBeaconVersion: null },
        routing: { location: { pathname: '/discover', change: false } },
      }
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)

      state = {
        gui: { lastDiscoverBeaconVersion: null },
        routing: { location: { pathname: '/discover', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(DISCOVER.BEACON_TEXT)
      expect(selectBroadcast.recomputations()).to.equal(1)

      state = {
        gui: { lastDiscoverBeaconVersion: '1' },
        routing: { location: { pathname: '/discover', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(null)

      state = {
        gui: { lastFollowingBeaconVersion: null },
        routing: { location: { pathname: '/following', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(FOLLOWING.BEACON_TEXT)

      state = {
        gui: { lastFollowingBeaconVersion: '1' },
        routing: { location: { pathname: '/following', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(null)

      state = {
        gui: { lastStarredBeaconVersion: null },
        routing: { location: { pathname: '/starred', change: true } },
      }
      expect(selectBroadcast(state)).to.equal(STARRED.BEACON_TEXT)

      state = {
        gui: { lastStarredBeaconVersion: '1' },
        routing: { location: { pathname: '/starred', change: true } },
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
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selectBroadcast(state)).to.equal(null, `${route} should not have a Broadcast.`)
      })
      expect(selectBroadcast.recomputations()).to.equal(11)
    })
  })
})

