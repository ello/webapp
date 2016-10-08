import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import sample from 'lodash/sample'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { DISCOVER, FOLLOWING, STARRED } from '../constants/locales/en.js'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectDPI,
  selectLastDiscoverBeaconVersion,
  selectLastFollowingBeaconVersion,
  selectLastStarredBeaconVersion,
} from '../selectors/gui'
import { selectCurrentPromotions } from '../selectors/promotions'
import { selectPathname, selectViewNameFromRoute } from '../selectors/routing'
import { selectUserFromUsername } from '../selectors/user'
import { trackEvent } from '../actions/analytics'
import {
  setLastDiscoverBeaconVersion,
  setLastFollowingBeaconVersion,
  setLastStarredBeaconVersion,
} from '../actions/gui'
import { openModal } from '../actions/modals'
import ShareDialog from '../components/dialogs/ShareDialog'
import { HeroBackgroundCycle, HeroBroadcast, HeroProfile, HeroPromotion, HeroPromotionAuth } from '../components/heros/HeroRenderables'

export const selectIsAuthenticationLayout = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'authentication'
)

export const selectIsBackgroundCycleLayout = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'join'
)

export const selectIsPromotionLayout = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'discover' || viewName === 'search'
)

export const selectIsUserProfileLayout = createSelector(
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
  const user = selectUserFromUsername(state, props)
  return {
    broadcast: selectBroadcast(state),
    dpi: selectDPI(state),
    isAuthenticationLayout: selectIsAuthenticationLayout(state),
    isBackgroundCycleLayout: selectIsBackgroundCycleLayout(state),
    isLoggedIn: selectIsLoggedIn(state),
    isPromotionLayout: selectIsPromotionLayout(state),
    isUserProfileLayout: selectIsUserProfileLayout(state, props),
    pathname: selectPathname(state),
    promotions: selectCurrentPromotions(state),
    useGif: user && (user.viewsAdultContent || !user.postsAdultContent),
    userCoverImage: user && user.coverImage,
    userId: user && user.id,
    username: user && user.username,
    viewName: selectViewNameFromRoute(state, props),
  }
}

class HeroContainer extends Component {
  static propTypes = {
    broadcast: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isAuthenticationLayout: PropTypes.bool,
    isBackgroundCycleLayout: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isPromotionLayout: PropTypes.bool,
    isUserProfileLayout: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    useGif: PropTypes.bool,
    userCoverImage: PropTypes.object,
    userId: PropTypes.string,
    username: PropTypes.string,
    viewName: PropTypes.string.isRequired,
  }

  static childContextTypes = {
    onClickShareProfile: PropTypes.func,
    onClickTrackCredits: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickShareProfile: this.onClickShareProfile,
      onClickTrackCredits: this.onClickTrackCredits,
    }
  }

  componentWillMount() {
    this.state = { promotion: null, broadcast: this.props.broadcast }
  }

  componentWillReceiveProps(nextProps) {
    const { broadcast, isPromotionLayout, pathname } = nextProps
    const hasPathChanged = this.props.pathname !== pathname

    if ((hasPathChanged && isPromotionLayout) || !this.state.promotion) {
      this.setState({ promotion: sample(nextProps.promotions) })
    }

    if (broadcast !== this.state.broadcast) {
      this.setState({ broadcast })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  onClickTrackCredits = () => {
    const { dispatch, isPromotionLayout } = this.props
    const label = `${isPromotionLayout ? 'banderole' : 'authentication'}-credits-clicked`
    dispatch(trackEvent(label))
  }

  onDismissBroadcast = () => {
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

  getHeroProfile() {
    const { dpi, userCoverImage, useGif, userId } = this.props
    const props = { dpi, sources: userCoverImage, useGif, userId }
    return <HeroProfile key="HeroProfile" {...props} />
  }

  getHeroPromotion() {
    const { dpi, isLoggedIn } = this.props
    const { promotion } = this.state
    const caption = get(promotion, 'caption', '')
    const creditSources = get(promotion, 'avatar', null)
    const creditUsername = get(promotion, 'username', null)
    const ctaCaption = get(promotion, 'cta.caption')
    const ctaHref = get(promotion, 'cta.href')
    const sources = get(promotion, 'coverImage', null)
    const props = { caption, creditSources, creditUsername, dpi, sources }
    const ctaProps = { ctaCaption, ctaHref, isLoggedIn }
    return <HeroPromotion key="HeroPromotion" {...props} {...ctaProps} />
  }

  getHeroPromotionAuth() {
    const { dpi } = this.props
    const { promotion } = this.state
    const creditSources = get(promotion, 'avatar', null)
    const creditUsername = get(promotion, 'username', null)
    const sources = get(promotion, 'coverImage', null)
    const props = { creditSources, creditUsername, dpi, sources }
    return <HeroPromotionAuth key="HeroPromotionAuth" {...props} />
  }

  render() {
    const children = []
    const { broadcast } = this.state
    const { isAuthenticationLayout, isBackgroundCycleLayout } = this.props
    const { isPromotionLayout, isUserProfileLayout, userId } = this.props

    if (broadcast) {
      const props = { broadcast, onDismiss: this.onDismissBroadcast }
      children.push(<HeroBroadcast key="HeroBroadcast" {...props} />)
    }

    // Pick a background
    if (isPromotionLayout) {
      children.push(this.getHeroPromotion())
    } else if (isUserProfileLayout && userId) {
      children.push(this.getHeroProfile())
    } else if (isAuthenticationLayout) {
      children.push(this.getHeroPromotionAuth())
    } else if (isBackgroundCycleLayout) {
      children.push(<HeroBackgroundCycle key="HeroBackgroundCycle" />)
    }
    return (
      <div className="Hero">
        {children}
      </div>
    )
  }
}

export default connect(mapStateToProps)(HeroContainer)

