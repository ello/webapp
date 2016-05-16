import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BEACONS } from '../../constants/action_types'
import { LOGGED_IN_PROMOTIONS } from '../../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../../constants/promotions/logged_out'
import {
  loadCommunities, loadDiscoverUsers, loadDiscoverPosts, loadFeaturedUsers, bindDiscoverKey,
} from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Promotion from '../../components/assets/Promotion'
import StreamComponent from '../../components/streams/StreamComponent'
import { TabListLinks } from '../../components/tabs/TabList'
import { ZeroStream } from '../../components/zeros/Zeros'
import { MainView } from '../../components/views/MainView'

const BEACON_VERSION = '1'

export function getDiscoverAction(type) {
  let action = loadDiscoverPosts(type || 'recommended')
  if (type === 'communities') {
    action = loadCommunities()
  } else if (type === 'featured-users') {
    action = loadFeaturedUsers()
  } else if (type === 'trending') {
    action = loadDiscoverUsers(type)
  }
  return action
}

export class Discover extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    currentStream: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    lastDiscoverBeaconVersion: PropTypes.string,
    params: PropTypes.shape({
      type: PropTypes.string,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))

  componentWillMount() {
    const { lastDiscoverBeaconVersion, isLoggedIn, dispatch, params } = this.props
    const type = params.type || 'recommended'
    this.state = {
      isBeaconActive: isLoggedIn && lastDiscoverBeaconVersion !== BEACON_VERSION,
    }
    dispatch(bindDiscoverKey(type))
  }

  componentDidUpdate() {
    const { dispatch, params } = this.props
    const type = params.type || 'recommended'
    dispatch(bindDiscoverKey(type))
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('banderole-credits-clicked'))
  }

  onDismissZeroStream = () => {
    const { dispatch } = this.props
    this.setState({ isBeaconActive: false })
    dispatch({ type: BEACONS.LAST_DISCOVER_VERSION, payload: { version: BEACON_VERSION } })
  }

  renderZeroStream() {
    return (
      <ZeroStream onDismiss={this.onDismissZeroStream}>
        Explore creators and communities. Realize the promise of the internet.
      </ZeroStream>
    )
  }

  render() {
    const { coverDPI, isLoggedIn, params, pathname } = this.props
    const { isBeaconActive } = this.state
    const action = getDiscoverAction(params.type)
    const tabs = [
      {
        to: '/discover',
        children: 'Featured',
        activePattern: /^\/(?:discover(\/recommended)?)?$/,
      },
      { to: '/discover/trending', children: 'Trending' },
      { to: '/discover/recent', children: 'Recent' },
      // { to: '/discover/communities', children: 'Communities' },
      // { to: '/discover/featured-users', children: 'Featured Users' },
    ]
    return (
      <MainView className="Discover" key={`discover_${params.type || 'recommended'}`}>
        {isBeaconActive ? this.renderZeroStream() : null}
        <Promotion
          coverDPI={coverDPI}
          creditsClickAction={this.onClickTrackCredits}
          isLoggedIn={isLoggedIn}
          userlist={isLoggedIn ? LOGGED_IN_PROMOTIONS : LOGGED_OUT_PROMOTIONS}
        />
        <TabListLinks
          activePath={pathname}
          className="LabelTabList"
          tabClasses="LabelTab"
          tabs={tabs}
        />
        <StreamComponent action={action} ref="streamComponent" />
      </MainView>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    coverDPI: state.gui.coverDPI,
    currentStream: state.gui.currentStream,
    isLoggedIn: state.authentication.isLoggedIn,
    lastDiscoverBeaconVersion: state.gui.lastDiscoverBeaconVersion,
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps)(Discover)

