import set from 'lodash/set'
import AppContainer from '../containers/AppContainer'
import { refreshAuthenticationToken } from '../actions/authentication'
import {
  fetchLoggedInPromos,
  fetchLoggedOutPromos,
} from '../actions/promotions'
import PostDetailRoute from './post_detail'
import WTFRoute from './wtf'
import authenticationRoutes from './authentication'
import {
  getComponents as getDiscoverComponents,
  discover as discoverRoute,
  explore as exploreRoute,
} from './discover'
import SearchRoutes from './search'
import StreamsRoutes from './streams'
import NotificationsRoute from './notifications'
import InvitationsRoutes from './invitations'
import SettingsRoutes from './settings'
import OnboardingRoutes from './onboarding'
import UserDetailRoute from './user_detail'

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replace) {
      replace({ pathname: to, state: nextState })
    },
  }
}

const routes = (store, isServer = false) => {
  // Wrap up authenticated routes
  const authenticate = (route) => {
    const oldOnEnter = route.onEnter
    if (typeof oldOnEnter === 'undefined') {
      return {
        ...route,
        onEnter(nextState, replace) {
          const { authentication: { isLoggedIn } } = store.getState()
          if (!isLoggedIn) {
            replace({ pathname: '/enter', state: nextState })
          }
        },
      }
    }

    return {
      ...route,
      onEnter(nextState, replace) {
        const { authentication: { isLoggedIn } } = store.getState()
        if (!isLoggedIn) {
          replace({ pathname: '/enter', state: nextState })
        } else {
          oldOnEnter(nextState, replace)
        }
      },
    }
  }

  const indexRoute = {
    getComponents: getDiscoverComponents,
    onEnter(nextState, replace, callback) {
      const {
        authentication: { isLoggedIn },
        gui: { homeStream },
      } = store.getState()

      const fetchPromoAction = isLoggedIn ? fetchLoggedInPromos() : fetchLoggedOutPromos()
      set(fetchPromoAction, 'meta.successAction', callback)
      set(fetchPromoAction, 'meta.failureAction', callback)
      store.dispatch(fetchPromoAction)

      if (isLoggedIn) {
        replace({ pathname: homeStream, state: nextState })
      }
    },
  }

  return [
    {
      path: '/',
      component: AppContainer,
      indexRoute,
      // order matters, so less specific routes should go at the bottom
      childRoutes: [
        WTFRoute,
        PostDetailRoute,
        ...authenticationRoutes(store),
        discoverRoute(store),
        exploreRoute(store),
        ...StreamsRoutes.map(route => authenticate(route)),
        authenticate(NotificationsRoute),
        ...InvitationsRoutes.map(route => authenticate(route)),
        ...SettingsRoutes.map(route => authenticate(route)),
        createRedirect('onboarding', '/onboarding/categories'),
        ...OnboardingRoutes.map(route => authenticate(route)),
        ...SearchRoutes,
        UserDetailRoute,
      ],
      onEnter() {
        const { authentication: { isLoggedIn } } = store.getState()
        if (!isLoggedIn && !isServer) {
          store.dispatch(refreshAuthenticationToken())
        }
      },
    },
  ]
}

export default routes

