import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectCategories, selectCategoryPageTitle } from '../selectors/categories'
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

// TODO: Combine with selectCategories or move to its own selector
export function generateTabs(primary, secondary, tertiary) {
  const tabs = []
  // add featured/trending/recent by default
  tabs.push({
    to: '/discover',
    children: 'Featured',
    activePattern: /^\/(?:discover(\/featured|\/recommended)?)?$/,
  })
  tabs.push({
    to: '/discover/trending',
    children: 'Trending',
  })
  tabs.push({
    to: '/discover/recent',
    children: 'Recent',
  })
  // add line to split categories
  tabs.push({ kind: 'divider' })
  for (const category of primary) {
    tabs.push({
      to: `/discover/${category.slug}`,
      children: category.name,
    })
  }
  for (const category of secondary) {
    tabs.push({
      to: `/discover/${category.slug}`,
      children: category.name,
    })
  }
  for (const category of tertiary) {
    tabs.push({
      to: `/discover/${category.slug}`,
      children: category.name,
    })
  }
  return tabs
}

function mapStateToProps(state, props) {
  const isLoggedIn = selectIsLoggedIn(state)
  const { primary, secondary, tertiary } = selectCategories(state, props)
  const pageTitle = selectCategoryPageTitle(state, props)
  const titlePrefix = pageTitle ? `${pageTitle} | ` : ''
  const title = `${titlePrefix} Ello`
  return {
    isLoggedIn,
    pageTitle,
    paramsType: selectParamsType(state, props),
    pathname: selectPropsPathname(state, props),
    primary,
    secondary,
    tertiary,
    title,
  }
}

class DiscoverContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pageTitle: PropTypes.string,
    paramsType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    primary: PropTypes.array,
    secondary: PropTypes.array,
    tertiary: PropTypes.array,
    title: PropTypes.string.isRequired,
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate(prevProps) {
    const { dispatch, paramsType, pathname } = this.props
    if (prevProps.pathname !== pathname) {
      dispatch(bindDiscoverKey(paramsType))
    }
  }

  render() {
    const { isLoggedIn, pageTitle, paramsType, pathname } = this.props
    const { primary, secondary, tertiary, title } = this.props
    const props = {
      isLoggedIn,
      pageTitle,
      pathname,
      streamAction: getStreamAction(paramsType),
      tabs: generateTabs(primary, secondary, tertiary),
      title,
    }
    return <Discover key={`discover_${paramsType}`} {...props} />
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

