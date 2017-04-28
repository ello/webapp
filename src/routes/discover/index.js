import DiscoverContainer from '../../containers/DiscoverContainer'

const getComponents = (location, cb) => {
  cb(null, DiscoverContainer)
}

const explore = () => ({
  path: 'explore(/:type)',
  getComponents,
  onEnter(nextState, replace) {
    const { params: { type } } = nextState
    const rootPath = '/discover'

    if (!type) {
      replace({ state: nextState, pathname: rootPath })
    } else {
      replace({ state: nextState, pathname: `/discover/${type || 'featured'}` })
    }
  },
})

const discover = () => ({
  path: 'discover(/:type)',
  getComponents,
  onEnter(nextState, replace) {
    const type = nextState.params.type || 'featured'
    const rootPath = '/discover'

    // redirect back to root path if type is unrecognized
    // or, if a logged out user is visiting /discover, redirect to /
    if (!type) {
      replace({ state: nextState, pathname: rootPath })
    }
  },
})

export {
  getComponents,
  discover,
  explore,
}

export default [
  discover,
  explore,
]

