import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectParamsType } from 'ello-brains/selectors/params'
import { selectPropsPathname } from 'ello-brains/selectors/routing'
import {
  bindDiscoverKey,
  getCategories,
  loadCategoryPosts,
  // loadCommunities,
  loadDiscoverPosts,
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
    case 'trending':
      return loadDiscoverPosts(type)
    case 'all':
      return getCategories()
    default:
      return loadCategoryPosts(type)
  }
}

function mapStateToProps(state, props) {
  return {
    paramsType: selectParamsType(state, props),
    pathname: selectPropsPathname(state, props),
  }
}

class DiscoverContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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

  componentDidUpdate(prevProps) {
    const { dispatch, paramsType, pathname } = this.props
    if (prevProps.pathname !== pathname) {
      dispatch(bindDiscoverKey(paramsType))
    }
  }

  render() {
    const { paramsType } = this.props
    return (
      <Discover
        inAllCategories={paramsType === 'all'}
        key={`discover_${paramsType}`}
        streamAction={getStreamAction(paramsType)}
      />
    )
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

