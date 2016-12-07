import AppContainer from '../containers/AppContainer'
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

const routes = (store) => {
  // Wrap up authenticated routes
  const authenticate = (route) => {
    const oldOnEnter = route.onEnter
    if (typeof oldOnEnter === 'undefined') {
      return {
        ...route,
        onEnter(nextState, replace) {
          const isLoggedIn = store.getState().getIn(['authentication', 'isLoggedIn'])
          if (!isLoggedIn) {
            replace({ pathname: '/enter', state: nextState })
          }
        },
      }
    }

    return {
      ...route,
      onEnter(nextState, replace) {
        const isLoggedIn = store.getState().getIn(['authentication', 'isLoggedIn'])
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
    onEnter(nextState, replace) {
      const isLoggedIn = store.getState().getIn(['authentication', 'isLoggedIn'])
      const homeStream = store.getState().getIn(['gui', 'homeStream'])

      if (isLoggedIn) {
        console.log('replace path')
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
    },
  ]
}

export default routes

