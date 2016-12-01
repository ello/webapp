import Immutable from 'immutable'
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
  let state

  beforeEach(() => {
    routing = {
      location: {
        pathname: '/state',
        query: { terms: 'state.query.terms', type: 'state.query.type' },
      },
      previousPath: 'state.previousPath',
    }
    state = Immutable.fromJS({ routing })
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
      expect(selectLocation(state, props)).to.deep.equal(state.getIn(['routing', 'location']))
    })
  })

  context('#selectPreviousPath', () => {
    it('returns the state.routing.location', () => {
      const props = { ...propsLocation }
      expect(selectPreviousPath(state, props)).to.deep.equal(state.getIn(['routing', 'previousPath']))
    })
  })

  context('#selectPathname', () => {
    it('returns the state.routing.location.pathname', () => {
      const props = { ...propsLocation }
      expect(selectPathname(state, props)).to.deep.equal(state.getIn(['routing', 'location', 'pathname']))
    })
  })

  context('#selectViewNameFromRoute', () => {
    it('selects with memoization the view name identifier associated with a route', () => {
      state = state.setIn(['routing', 'location', 'pathname'], '/following')
      const props = { params: { username: 'mk' } }
      selectViewNameFromRoute.resetRecomputations()
      expect(selectViewNameFromRoute(state)).to.equal('following')

      state = state.setIn(['routing', 'location', 'change'], true)
      expect(selectViewNameFromRoute(state)).to.equal('following')
      expect(selectViewNameFromRoute.recomputations()).to.equal(1)

      state = state.setIn(['routing', 'location', 'pathname'], '/starred')
      expect(selectViewNameFromRoute(state)).to.equal('starred')

      state = state.setIn(['routing', 'location', 'pathname'], '/search')
      expect(selectViewNameFromRoute(state)).to.equal('search')

      state = state.setIn(['routing', 'location', 'pathname'], '/')
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = state.setIn(['routing', 'location', 'pathname'], '/discover')
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = state.setIn(['routing', 'location', 'pathname'], '/discover/stuff')
      expect(selectViewNameFromRoute(state)).to.equal('discover')

      state = state.setIn(['routing', 'location', 'pathname'], '/invitations')
      expect(selectViewNameFromRoute(state)).to.equal('invitations')

      state = state.setIn(['routing', 'location', 'pathname'], '/settings')
      expect(selectViewNameFromRoute(state)).to.equal('settings')

      state = state.setIn(['routing', 'location', 'pathname'], '/notifications')
      expect(selectViewNameFromRoute(state)).to.equal('notifications')

      state = state.setIn(['routing', 'location', 'pathname'], '/onboarding')
      expect(selectViewNameFromRoute(state)).to.equal('onboarding')

      state = state.setIn(['routing', 'location', 'pathname'], '/onboarding/settings')
      expect(selectViewNameFromRoute(state)).to.equal('onboarding')

      state = state.setIn(['routing', 'location', 'pathname'], '/mk/post/etlb9br06dh6tleztw4g')
      expect(selectViewNameFromRoute(state)).to.equal('postDetail')

      state = state.setIn(['routing', 'location', 'pathname'], '/mk')
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = state.setIn(['routing', 'location', 'pathname'], '/mk/loves')
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = state.setIn(['routing', 'location', 'pathname'], '/mk/following')
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = state.setIn(['routing', 'location', 'pathname'], '/mk/followers')
      expect(selectViewNameFromRoute(state, props)).to.equal('userDetail')

      state = state.setIn(['routing', 'location', 'pathname'], '/mk/post/etlb9br06dh6tleztw4g')
      expect(selectViewNameFromRoute(state, props)).not.to.equal('userDetail')

      state = state.setIn(['routing', 'location', 'pathname'], '/join')
      expect(selectViewNameFromRoute(state)).to.equal('join')

      state = state.setIn(['routing', 'location', 'pathname'], '/enter')
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      state = state.setIn(['routing', 'location', 'pathname'], '/forgot-password')
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      state = state.setIn(['routing', 'location', 'pathname'], '/signup')
      expect(selectViewNameFromRoute(state)).to.equal('authentication')

      expect(selectViewNameFromRoute.recomputations()).to.equal(21)
      selectViewNameFromRoute.resetRecomputations()
    })
  })
})

