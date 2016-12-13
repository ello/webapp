import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectParamsType } from '../selectors/params'
import { selectPropsPathname } from '../selectors/routing'
import {
  bindDiscoverKey,
  getCategories,
  loadCategoryPosts,
  // loadCommunities,
  loadDiscoverPosts,
  loadDiscoverUsers,
  // loadFeaturedUsers,
} from '../actions/discover'
import { Discover } from '../components/views/Discover'

// TODO: Move to a selector
export function getStreamAction(type) {
  switch (type) {
    // case 'communities':
    //   return loadCommunities()
    // case 'featured-users':
    //   return loadFeaturedUsers()
    case 'featured':
    case 'recommended':
      return loadCategoryPosts()
    case 'recent':
      return loadDiscoverPosts(type)
    case 'trending':
      return loadDiscoverUsers(type)
    case 'all':
      return getCategories()
    default:
      return loadCategoryPosts(type)
  }
}

function mapStateToProps(state, props) {
  const isLoggedIn = selectIsLoggedIn(state)
  return {
    isLoggedIn,
    paramsType: selectParamsType(state, props),
    pathname: selectPropsPathname(state, props),
  }
}

class DiscoverContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    paramsType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    paramsType: 'featured',
  }

  static preRender = (store, routerState) =>
    store.dispatch(getStreamAction(routerState.params.type || 'featured'))

  componentWillMount() {
    const { dispatch, paramsType } = this.props
    dispatch(bindDiscoverKey(paramsType))
  }

  shouldComponentUpdate() {
    return true
  }

  componentDidUpdate(prevProps) {
    const { dispatch, paramsType, pathname } = this.props
    if (prevProps.pathname !== pathname) {
      dispatch(bindDiscoverKey(paramsType))
    }
  }

  render() {
    const { isLoggedIn, paramsType, pathname } = this.props
    const props = {
      isLoggedIn,
      pathname,
      streamAction: getStreamAction(paramsType),
    }
    return <Discover key={`discover_${paramsType}`} {...props} />
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

