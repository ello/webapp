import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectPagination } from '../selectors/pagination'
import { selectPropsPathname } from '../selectors/routing'
import { getCategories } from '../actions/discover'
import { loadNotifications } from '../actions/notifications'
import { loadProfile } from '../actions/profile'
import DevTools from '../components/devtools/DevTools'
import { AppHelmet } from '../components/helmets/AppHelmet'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDrag'
import { startRefreshTimer } from '../components/viewport/RefreshOnFocus'
import AnalyticsContainer from '../containers/AnalyticsContainer'
import EditorToolsContainer from '../containers/EditorToolsContainer'
import FooterContainer from '../containers/FooterContainer'
import HeroContainer from '../containers/HeroContainer'
import KeyboardContainer from '../containers/KeyboardContainer'
import ModalContainer from '../containers/ModalContainer'
import NavbarContainer from '../containers/NavbarContainer'
import OmnibarContainer from '../containers/OmnibarContainer'
import ViewportContainer from '../containers/ViewportContainer'
import {
  fetchAuthenticationPromos,
  fetchLoggedInPromos,
  fetchLoggedOutPromos,
} from '../actions/promotions'

function mapStateToProps(state, props) {
  return {
    isLoggedIn: selectIsLoggedIn(state),
    pagination: selectPagination(state, props),
    pathname: selectPropsPathname(state, props),
  }
}

class AppContainer extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    pagination: PropTypes.object,
    pathname: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
  }

  static preRender = (store) => {
    const state = store.getState()
    if (state.authentication && state.authentication.isLoggedIn) {
      return Promise.all([
        store.dispatch(loadProfile()),
        store.dispatch(getCategories()),
      ])
    }
    return store.dispatch(getCategories())
  }

  componentDidMount() {
    addGlobalDrag()
    startRefreshTimer()
    const { dispatch, isLoggedIn } = this.props
    if (isLoggedIn) {
      dispatch(loadProfile())
      dispatch(loadNotifications({ category: 'all' }))
      dispatch(fetchLoggedInPromos())
    } else {
      dispatch(fetchAuthenticationPromos())
      dispatch(fetchLoggedOutPromos())
    }
    dispatch(getCategories())
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      dispatch(loadProfile())
      dispatch(fetchLoggedInPromos())
    } else if (this.props.isLoggedIn && !nextProps.isLoggedIn) {
      dispatch(fetchAuthenticationPromos())
      dispatch(fetchLoggedOutPromos())
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillUnmount() {
    removeGlobalDrag()
  }

  render() {
    const { children, isLoggedIn, params, pagination, pathname } = this.props
    const appClasses = classNames(
      'AppContainer',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={appClasses}>
        <AppHelmet pagination={pagination} pathname={pathname} />
        <ViewportContainer routerParams={params} />
        {isLoggedIn ? <OmnibarContainer /> : null}
        <HeroContainer params={params} />
        {children}
        <NavbarContainer routerParams={params} />
        <FooterContainer />
        {isLoggedIn ? <EditorToolsContainer /> : null}
        <ModalContainer />
        <DevTools />
        <KeyboardContainer />
        <AnalyticsContainer />
      </section>
    )
  }
}

export default connect(mapStateToProps)(AppContainer)

