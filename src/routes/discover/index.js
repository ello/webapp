import DiscoverContainer from '../../containers/DiscoverContainer'

const getComponents = (location, cb) => {
  cb(null, DiscoverContainer)
}

const indexRoute = {
  getComponents,
}

const explore = store => ({
  path: 'explore(/:type)',
  getComponents,
  onEnter(nextState, replace) {
    const { params: { type } } = nextState
    const isLoggedIn = store.getState().getIn(['authentication', 'isLoggedIn'])
    const rootPath = isLoggedIn ? '/discover' : '/'

    if (!type) {
      replace({ state: nextState, pathname: rootPath })
    } else {
      replace({ state: nextState, pathname: `/discover/${type}` })
    }
  },
})

const discover = store => ({
  path: 'discover(/:type)',
  getComponents,
  onEnter(nextState, replace) {
    const type = nextState.params.type
    const isLoggedIn = store.getState().getIn(['authentication', 'isLoggedIn'])
    const rootPath = isLoggedIn ? '/discover' : '/'

    // redirect back to root path if type is unrecognized
    // or, if a logged out user is visiting /discover, redirect to /
    if (!type && !isLoggedIn) {
      replace({ state: nextState, pathname: rootPath })
    }
  },
})

export {
  indexRoute,
  getComponents,
  discover,
  explore,
}

export default [
  discover,
  explore,
]

