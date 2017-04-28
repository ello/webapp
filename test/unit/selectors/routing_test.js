import Immutable from 'immutable'
import {
  selectPropsLocationKey,
  selectPropsPathname,
  selectPropsQueryTerms,
  selectPropsQueryType,
  selectLocation,
  selectPreviousPath,
  selectPathname,
  selectQueryTerms,
  selectViewNameFromRoute,
} from '../../../src/selectors/routing'


describe('routing selectors', () => {
  let routing
  let propsLocation
  let state

  beforeEach(() => {
    routing = Immutable.fromJS({
      location: {
        pathname: '/state',
        terms: 'state.query.terms',
      },
      previousPath: 'state.previousPath',
    })
    state = { routing }
    propsLocation = {
      location: {
        key: 'a1b2c3',
        pathname: '/props',
        query: { terms: 'props.query.terms', type: 'props.query.type' },
      },
    }
  })

  afterEach(() => {
    routing = {}
    propsLocation = {}
  })

  context('#selectPropsLocationKey', () => {
    it('returns the props.location.key', () => {
      const props = { ...propsLocation }
      expect(selectPropsLocationKey(state, props)).to.equal('a1b2c3')
    })
  })

  context('#selectPropsPathname', () => {
    it('returns the props.location.pathname', () => {
      const props = { ...propsLocation }
      expect(selectPropsPathname(state, props)).to.equal('/props')
    })
  })

  context('#selectPropsQueryTerms', () => {
    it('returns the props.location.query.terms', () => {
      const props = { ...propsLocation }
      expect(selectPropsQueryTerms(state, props)).to.equal('props.query.terms')
    })
  })

  context('#selectPropsQueryType', () => {
    it('returns the props.location.query.type', () => {
      const props = { ...propsLocation }
      expect(selectPropsQueryType(state, props)).to.equal('props.query.type')
    })
  })

  context('#selectLocation', () => {
    it('returns the state.routing.location', () => {
      const props = { ...propsLocation }
      expect(selectLocation(state, props)).to.deep.equal(state.routing.get('location'))
    })
  })

  context('#selectPreviousPath', () => {
    it('returns the state.routing.location', () => {
      const props = { ...propsLocation }
      expect(selectPreviousPath(state, props)).to.deep.equal(state.routing.get('previousPath'))
    })
  })

  context('#selectPathname', () => {
    it('returns the state.routing.location.pathname', () => {
      const props = { ...propsLocation }
      expect(selectPathname(state, props)).to.deep.equal(state.routing.getIn(['location', 'pathname']))
    })
  })

  context('#selectQueryTerms', () => {
    it('returns the routing.location.query.terms', () => {
      expect(selectQueryTerms(state)).to.equal('state.query.terms')
    })
  })

  context('#selectViewNameFromRoute', () => {
    it('selects with memoization the view name identifier associated with a route', () => {
      state = { routing: state.routing.setIn(['location', 'pathname'], '/following') }
      const props = { params: { username: 'mk' } }
      selectViewNameFromRoute.resetRecomputations()
      expect(selectViewNameFromRoute(state)).to.equal('following')

      state = { routing: state.routing.setIn(['location', 'change'], true) }
      expect(selectViewNameFromRoute(state)).to.equal('following')
      expect(selectViewNameFromRoute.recomputations()).to.equal(1)

      state = { routing: state.routing.setIn(['location', 'pathname'], '/search') }
      expect(selectViewNameFromRoute(state)).to.equal('search')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/') }
      expect(selectViewNameFromRoute(state)).to.equal('editorial')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/discover') }
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/discover/stuff') }
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/invitations') }
      expect(selectViewNameFromRoute(state)).to.equal('invitations')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/settings') }
      expect(selectViewNameFromRoute(state)).to.equal('settings')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/notifications') }
      expect(selectViewNameFromRoute(state)).to.equal('notifications')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/onboarding') }
      expect(selectViewNameFromRoute(state)).to.equal('onboarding')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/onboarding/settings') }
      expect(selectViewNameFromRoute(state)).to.equal('onboarding')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/mk/post/etlb9br06dh6tleztw4g') }
      expect(selectViewNameFromRoute(state)).to.equal('postDetail')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/mk') }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/mk/loves') }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/mk/following') }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/mk/followers') }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/mk/post/etlb9br06dh6tleztw4g') }
      expect(selectViewNameFromRoute(state, props)).not.to.equal('userDetail')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/join') }
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/enter') }
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/forgot-password') }
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      state = { routing: state.routing.setIn(['location', 'pathname'], '/signup') }
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      expect(selectViewNameFromRoute.recomputations()).to.equal(20)
      selectViewNameFromRoute.resetRecomputations()
    })
  })
})

