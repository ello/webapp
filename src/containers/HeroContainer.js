import React, { Component, PropTypes } from 'react'
import { createSelector } from 'reselect'
import sample from 'lodash/sample'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectCoverDPI,
  selectLastDiscoverBeaconVersion,
  selectLastFollowingBeaconVersion,
  selectLastStarredBeaconVersion,
} from '../selectors/gui'
import { selectPromotions } from '../selectors/promotions'
import { selectParamsUsername } from '../selectors/params'
import { selectPathname } from '../selectors/routing'
import { trackEvent } from '../actions/analytics'
import {
  setLastDiscoverBeaconVersion,
  setLastFollowingBeaconVersion,
  setLastStarredBeaconVersion,
} from '../actions/gui'
import Promotion from '../components/assets/Promotion'
import { ZeroStream } from '../components/zeros/Zeros'

// -------------------------------------

const styles = {
  backgroundColor: 'white',
}

const fauxCover = {
  height: 'calc(100vh - 80px)',
  backgroundColor: 'lightgreen',
  textAlign: 'center',
}

const Hero = ({
  broadcast,
  coverDPI,
  hasCoverProfile,
  hasPromotion,
  isLoggedIn,
  onClickTrackCredits,
  onDismissZeroStream,
  promotion,
}) =>
  <div className="Hero" style={{ ...styles }}>
    <div style={{ height: 80 }} />
    { broadcast ? <ZeroStream onDismiss={onDismissZeroStream}>{broadcast}</ZeroStream> : null }
    { hasPromotion ?
      <Promotion
        coverDPI={coverDPI}
        isLoggedIn={isLoggedIn}
        onClickTrackCredits={onClickTrackCredits}
        promotion={promotion}
      /> : null
    }
    { hasCoverProfile ?
      <div style={{ ...fauxCover }}>Cover Profile 2.0</div> : null
    }
  </div>

Hero.propTypes = {
  broadcast: PropTypes.string,
  coverDPI: PropTypes.string.isRequired,
  hasCoverProfile: PropTypes.bool,
  hasPromotion: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  onClickTrackCredits: PropTypes.func.isRequired,
  onDismissZeroStream: PropTypes.func.isRequired,
  promotion: PropTypes.object,
}

// -------------------------------------

const DISCOVER_BEACON_VERSION = '1'
const DISCOVER_BEACON_TEXT = 'Explore creators, curated categories and communities.'

const FOLLOWING_BEACON_VERSION = '1'
const FOLLOWING_BEACON_TEXT = 'Follow the creators and communities that inspire you.'

const STARRED_BEACON_VERSION = '1'
const STARRED_BEACON_TEXT = 'Star creators and communities to curate a second stream.'

const PROMOTION_ROUTES = [
  /^\/discover/,
  /^\/search/,
]

const selectHasPromotion = createSelector(
  [selectPathname], (pathname) =>
    (pathname === '/' || PROMOTION_ROUTES.some((route) => route.test(pathname)))
)

const selectHasCoverProfile = createSelector(
  [selectPathname, selectParamsUsername], (pathname, username) =>
    !!(username && !(/^\/[\w\-]+\/post\/.+/.test(pathname)))
)

const selectBroadcast = createSelector(
  [selectPathname, selectLastDiscoverBeaconVersion, selectLastFollowingBeaconVersion, selectLastStarredBeaconVersion], // eslint-disable-line
  (pathname, lastDiscoverBeaconVersion, lastFollowingBeaconVersion, lastStarredBeaconVersion) => {
    if (/^\/following/.test(pathname)) {
      return lastFollowingBeaconVersion !== FOLLOWING_BEACON_VERSION ? FOLLOWING_BEACON_TEXT : null
    } else if (/^\/starred/.test(pathname)) {
      return lastStarredBeaconVersion !== STARRED_BEACON_VERSION ? STARRED_BEACON_TEXT : null
    } else if (pathname === '/' || /^\/discover/.test(pathname)) {
      return lastDiscoverBeaconVersion !== DISCOVER_BEACON_VERSION ? DISCOVER_BEACON_TEXT : null
    }
    return null
  }
)

function mapStateToProps(state, props) {
  return {
    broadcast: selectBroadcast(state),
    coverDPI: selectCoverDPI(state),
    hasPromotion: selectHasPromotion(state),
    hasCoverProfile: selectHasCoverProfile(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    pathname: selectPathname(state),
    promotions: selectPromotions(state),
  }
}

class HeroContainer extends Component {
  static propTypes = {
    broadcast: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    coverDPI: PropTypes.string.isRequired,
    hasCoverProfile: PropTypes.bool,
    hasPromotion: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
    promotions: PropTypes.array,
  }

  // static preRender = (store) =>
    // store.dispatch(loadNoise())

  componentWillMount() {
    this.state = { promotion: null, broadcast: this.props.broadcast }
  }

  componentWillReceiveProps(nextProps) {
    const { broadcast, hasPromotion, pathname } = nextProps
    const hasPathChanged = this.props.pathname !== pathname

    if ((hasPathChanged && hasPromotion) || !this.state.promotion) {
      this.setState({ promotion: sample(nextProps.promotions) })
    }

    if (broadcast !== this.state.broadcast) {
      this.setState({ broadcast })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = shallowCompare(this, nextProps, nextState)
    return shouldUpdate
    // return shallowCompare(this, nextProps, nextState)
  }

  onClickTrackCredits = () => {
    this.props.dispatch(trackEvent('banderole-credits-clicked'))
  }

  onDismissZeroStream = () => {
    const { dispatch, pathname } = this.props
    if (/^\/following/.test(pathname)) {
      dispatch(setLastFollowingBeaconVersion({ version: FOLLOWING_BEACON_VERSION }))
      return
    } else if (/^\/starred/.test(pathname)) {
      dispatch(setLastStarredBeaconVersion({ version: STARRED_BEACON_VERSION }))
      return
    } else if (pathname === '/' || /^\/discover/.test(pathname)) {
      dispatch(setLastDiscoverBeaconVersion({ version: DISCOVER_BEACON_VERSION }))
      return
    }
  }

  render() {
    const props = {
      broadcast: this.state.broadcast,
      coverDPI: this.props.coverDPI,
      hasCoverProfile: this.props.hasCoverProfile,
      hasPromotion: this.props.hasPromotion,
      isLoggedIn: this.props.isLoggedIn,
      onClickTrackCredits: this.onClickTrackCredits,
      onDismissZeroStream: this.onDismissZeroStream,
      promotion: this.state.promotion,
    }
    return <Hero {...props} />
  }
}

export default connect(mapStateToProps)(HeroContainer)

