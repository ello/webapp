import React, { Component, PropTypes } from 'react'
import { createSelector } from 'reselect'
import sample from 'lodash/sample'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { DISCOVER, FOLLOWING, STARRED } from '../constants/locales/en.js'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectCoverDPI,
  selectLastDiscoverBeaconVersion,
  selectLastFollowingBeaconVersion,
  selectLastStarredBeaconVersion,
} from '../selectors/gui'
import { selectPromotions } from '../selectors/promotions'
import { selectPathname, selectViewNameFromRoute } from '../selectors/routing'
import { selectUserFromUsername } from '../selectors/user'
import { trackEvent } from '../actions/analytics'
import {
  setLastDiscoverBeaconVersion,
  setLastFollowingBeaconVersion,
  setLastStarredBeaconVersion,
} from '../actions/gui'
import Hero from '../components/heros/Hero'

const PROMOTION_ROUTES = [
  /^\/discover/,
  /^\/search/,
]

export const selectHasPromotion = createSelector(
  [selectPathname], pathname =>
    (pathname === '/' || PROMOTION_ROUTES.some(route => route.test(pathname)))
)

export const selectHasCoverProfile = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'userDetail'
)

export const selectBroadcast = createSelector(
  [selectIsLoggedIn, selectViewNameFromRoute, selectLastDiscoverBeaconVersion, selectLastFollowingBeaconVersion, selectLastStarredBeaconVersion], // eslint-disable-line
  (isLoggedIn, viewName, lastDiscoverBeaconVersion, lastFollowingBeaconVersion, lastStarredBeaconVersion) => { // eslint-disable-line
    if (!isLoggedIn) { return null }
    if (viewName === 'discover') {
      return lastDiscoverBeaconVersion !== DISCOVER.BEACON_VERSION ? DISCOVER.BEACON_TEXT : null
    } else if (viewName === 'following') {
      return lastFollowingBeaconVersion !== FOLLOWING.BEACON_VERSION ? FOLLOWING.BEACON_TEXT : null
    } else if (viewName === 'starred') {
      return lastStarredBeaconVersion !== STARRED.BEACON_VERSION ? STARRED.BEACON_TEXT : null
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
    viewName: selectViewNameFromRoute(state, props),
    user: selectUserFromUsername(state, props),
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
    user: PropTypes.object,
    viewName: PropTypes.string.isRequired,
  }

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
    return shallowCompare(this, nextProps, nextState)
  }

  onClickTrackCredits = () => {
    this.props.dispatch(trackEvent('banderole-credits-clicked'))
  }

  onDismissZeroStream = () => {
    const { dispatch, viewName } = this.props
    if (viewName === 'discover') {
      dispatch(setLastDiscoverBeaconVersion({ version: DISCOVER.BEACON_VERSION }))
      return
    } else if (viewName === 'following') {
      dispatch(setLastFollowingBeaconVersion({ version: FOLLOWING.BEACON_VERSION }))
      return
    } else if (viewName === 'starred') {
      dispatch(setLastStarredBeaconVersion({ version: STARRED.BEACON_VERSION }))
      return
    }
  }

  render() {
    const { user } = this.props
    const props = {
      broadcast: this.state.broadcast,
      dpi: this.props.coverDPI,
      hasCoverProfile: this.props.hasCoverProfile,
      hasPromotion: this.props.hasPromotion,
      isLoggedIn: this.props.isLoggedIn,
      onClickTrackCredits: this.onClickTrackCredits,
      onDismissZeroStream: this.onDismissZeroStream,
      pathname: this.props.pathname,
      promotion: this.state.promotion,
      sources: user && user.coverImage,
      userId: user && user.id,
      useGif: user && (user.viewsAdultContent || !user.postsAdultContent),
    }
    return <Hero {...props} />
  }
}

export default connect(mapStateToProps)(HeroContainer)

