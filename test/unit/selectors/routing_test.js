import {
  selectPropsPathname,
  selectPropsQueryTerms,
  selectPropsQueryType,
  selectLocation,
  selectPreviousPath,
  selectPathname,
  selectViewNameFromRoute,
} from '../../../src/selectors/routing'


describe('routing selectors', () => {
  let routing
  let propsLocation

  beforeEach(() => {
    routing = {
      location: {
        pathname: '/state',
        query: { terms: 'state.query.terms', type: 'state.query.type' },
      },
      previousPath: 'state.previousPath',
    }
    propsLocation = {
      location: {
        pathname: '/props',
        query: { terms: 'props.query.terms', type: 'props.query.type' },
      },
    }
  })

  afterEach(() => {
    routing = {}
    propsLocation = {}
  })

  context('#selectPropsPathname', () => {
    it('returns the props.location.pathname', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPropsPathname(state, props)).to.equal('/props')
    })
  })

  context('#selectPropsQueryTerms', () => {
    it('returns the props.location.query.terms', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPropsQueryTerms(state, props)).to.equal('props.query.terms')
    })
  })

  context('#selectPropsQueryType', () => {
    it('returns the props.location.query.type', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPropsQueryType(state, props)).to.equal('props.query.type')
    })
  })

  context('#selectLocation', () => {
    it('returns the state.routing.location', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectLocation(state, props)).to.deep.equal(routing.location)
    })
  })

  context('#selectPreviousPath', () => {
    it('returns the state.routing.location', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPreviousPath(state, props)).to.deep.equal(routing.previousPath)
    })
  })

  context('#selectPathname', () => {
    it('returns the state.routing.location.pathname', () => {
      const state = { routing }
      const props = { ...propsLocation }
      expect(selectPathname(state, props)).to.deep.equal(routing.location.pathname)
    })
  })

  context('#selectViewNameFromRoute', () => {
    it('selects with memoization the view name identifier associated with a route', () => {
      let state = { routing: { location: { pathname: '/following', change: false } } }
      const props = { params: { username: 'mk' } }
      selectViewNameFromRoute.resetRecomputations()
      expect(selectViewNameFromRoute(state)).to.equal('following')

      state = { routing: { location: { pathname: '/following', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('following')
      expect(selectViewNameFromRoute.recomputations()).to.equal(1)

      state = { routing: { location: { pathname: '/starred', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('starred')

      state = { routing: { location: { pathname: '/search', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('search')

      state = { routing: { location: { pathname: '/', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = { routing: { location: { pathname: '/discover', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = { routing: { location: { pathname: '/discover/stuff', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = { routing: { location: { pathname: '/invitations', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('invitations')

      state = { routing: { location: { pathname: '/settings', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('settings')

      state = { routing: { location: { pathname: '/notifications', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('notifications')

      state = { routing: { location: { pathname: '/onboarding', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('onboarding')

      state = { routing: { location: { pathname: '/onboarding/settings', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('onboarding')

      state = { routing: { location: { pathname: '/mk/post/etlb9br06dh6tleztw4g', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('postDetail')

      state = { routing: { location: { pathname: '/mk', change: true } } }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: { location: { pathname: '/mk/loves', change: true } } }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: { location: { pathname: '/mk/following', change: true } } }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: { location: { pathname: '/mk/followers', change: true } } }
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = { routing: { location: { pathname: '/mk/post/etlb9br06dh6tleztw4g', change: true } } }
      expect(selectViewNameFromRoute(state, props)).not.to.equal('userDetail')

      state = { routing: { location: { pathname: '/join', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('join')

      state = { routing: { location: { pathname: '/enter', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      state = { routing: { location: { pathname: '/forgot-password', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      state = { routing: { location: { pathname: '/signup', change: true } } }
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      expect(selectViewNameFromRoute.recomputations()).to.equal(21)
      selectViewNameFromRoute.resetRecomputations()
    })
  })
})

