import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import sample from 'lodash/sample'
import { connect } from 'react-redux'
import { getLinkObject } from 'ello-brains/helpers/json_helper'
import {
  selectAuthPromotionals,
  selectCategoryData,
  selectIsCategoryPromotion,
  selectIsPagePromotion,
  selectLoggedInPagePromotions,
  selectLoggedOutPagePromotions,
} from 'ello-brains/selectors/promotions'
import { selectJson } from 'ello-brains/selectors/store'
import { DISCOVER, FOLLOWING } from 'ello-brains/constants/locales/en'
import { USER } from 'ello-brains/constants/action_types'
import { selectPathname, selectViewNameFromRoute } from 'ello-brains/selectors/routing'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import { selectViewsAdultContent } from 'ello-brains/selectors/profile'
import {
  selectUserCoverImage,
  selectUserId,
  selectUserPostsAdultContent,
  selectUserUsername,
} from 'ello-brains/selectors/user'
import {
  selectDPI,
  selectLastDiscoverBeaconVersion,
  selectLastFollowingBeaconVersion,
  selectIsMobile,
} from 'ello-brains/selectors/gui'
import { selectStreamType } from 'ello-brains/selectors/stream'
import { trackEvent } from 'ello-brains/actions/analytics'
import {
  setLastDiscoverBeaconVersion,
  setLastFollowingBeaconVersion,
} from 'ello-brains/actions/gui'
import { openModal } from 'ello-brains/actions/modals'
import ShareDialog from '../components/dialogs/ShareDialog'
import {
  Hero,
  HeroBroadcast,
  HeroProfile,
  HeroPromotionAuth,
  HeroPromotionCategory,
  HeroPromotionPage,
} from '../components/heros/HeroRenderables'

export const selectIsAuthentication = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'authentication',
)

export const selectIsUserProfile = createSelector(
  [selectViewNameFromRoute], viewName => viewName === 'userDetail',
)

export const selectBroadcast = createSelector(
  [selectIsLoggedIn, selectViewNameFromRoute, selectLastDiscoverBeaconVersion, selectLastFollowingBeaconVersion], // eslint-disable-line
  (isLoggedIn, viewName, lastDiscoverBeaconVersion, lastFollowingBeaconVersion) => {
    if (!isLoggedIn) { return null }
    if (viewName === 'discover') {
      return lastDiscoverBeaconVersion !== DISCOVER.BEACON_VERSION ? DISCOVER.BEACON_TEXT : null
    } else if (viewName === 'following') {
      return lastFollowingBeaconVersion !== FOLLOWING.BEACON_VERSION ? FOLLOWING.BEACON_TEXT : null
    }
    return null
  },
)

function mapStateToProps(state, props) {
  const categoryData = selectCategoryData(state)
  const isAuthentication = selectIsAuthentication(state)
  const isPagePromotion = selectIsPagePromotion(state)
  const isCategoryPromotion = selectIsCategoryPromotion(state)
  const isLoggedIn = selectIsLoggedIn(state)
  let promotions
  if (isAuthentication) {
    promotions = selectAuthPromotionals(state)
  } else if (isPagePromotion) {
    if (isLoggedIn) {
      promotions = selectLoggedInPagePromotions(state)
    } else {
      promotions = selectLoggedOutPagePromotions(state)
    }
  } else if (isCategoryPromotion) {
    promotions = categoryData.promotionals
  }
  return {
    broadcast: selectBroadcast(state),
    categoryData,
    dpi: selectDPI(state),
    isAuthentication,
    isCategoryPromotion,
    isLoggedIn: selectIsLoggedIn(state),
    isMobile: selectIsMobile(state),
    isPagePromotion,
    isUserProfile: selectIsUserProfile(state, props),
    json: selectJson(state),
    pathname: selectPathname(state),
    promotions,
    streamType: selectStreamType(state),
    useGif: selectViewsAdultContent(state) || selectUserPostsAdultContent(state, props) || false,
    userCoverImage: selectUserCoverImage(state, props),
    userId: selectUserId(state, props),
    username: selectUserUsername(state, props),
    viewName: selectViewNameFromRoute(state, props),
  }
}

class HeroContainer extends Component {
  static propTypes = {
    broadcast: PropTypes.string,
    categoryData: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isAuthentication: PropTypes.bool.isRequired,
    isCategoryPromotion: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isPagePromotion: PropTypes.bool.isRequired,
    isUserProfile: PropTypes.bool.isRequired,
    json: PropTypes.object,
    pathname: PropTypes.string.isRequired,
    promotions: PropTypes.object,
    streamType: PropTypes.string, // eslint-disable-line
    useGif: PropTypes.bool.isRequired,
    userCoverImage: PropTypes.object,
    userId: PropTypes.string,
    username: PropTypes.string,
    viewName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    broadcast: null,
    json: null,
    promotions: null,
    streamType: null,
    userCoverImage: null,
    userId: null,
    username: null,
  }

  static childContextTypes = {
    onClickShareProfile: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickShareProfile: this.onClickShareProfile,
    }
  }

  componentWillMount() {
    this.state = { promotion: null, broadcast: this.props.broadcast, renderType: null }
  }

  componentWillReceiveProps(nextProps) {
    const { broadcast, pathname, promotions } = nextProps
    const hasPathChanged = this.props.pathname !== pathname
    if (promotions && (hasPathChanged || !this.state.promotion)) {
      const keyArr = []
      promotions.keySeq().forEach((key) => {
        keyArr.push(key)
      })
      const randomKey = sample(keyArr)
      this.setState({ promotion: promotions.get(randomKey) })
    }
    if (broadcast !== this.state.broadcast) {
      this.setState({ broadcast })
    }
    switch (nextProps.streamType) {
      case USER.DETAIL_FAILURE:
      case USER.DETAIL_REQUEST:
      case USER.DETAIL_SUCCESS:
        this.setState({ renderType: nextProps.streamType })
        break
      default:
        break
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(nextState.promotion, this.state.promotion) ||
      ['dpi', 'isLoggedIn', 'isMobile', 'pathname', 'viewName', 'userId'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['broadcast', 'renderType'].some(prop => nextState[prop] !== this.state[prop])
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />, '', null, 'open-share-dialog-profile'))
  }

  onDismissBroadcast = () => {
    const { dispatch, viewName } = this.props
    if (viewName === 'discover') {
      dispatch(setLastDiscoverBeaconVersion({ version: DISCOVER.BEACON_VERSION }))
    } else if (viewName === 'following') {
      dispatch(setLastFollowingBeaconVersion({ version: FOLLOWING.BEACON_VERSION }))
    }
  }

  getHeroProfile() {
    const { dpi, userCoverImage, useGif, userId } = this.props
    const props = { dpi, sources: userCoverImage, useGif, userId }
    return <HeroProfile key="HeroProfile" {...props} />
  }

  getHeroPromotionAuth() {
    const { dpi } = this.props
    const promotion = this.state.promotion || Immutable.Map()
    const creditSources = promotion.get('avatar', null)
    const creditUsername = promotion.get('username', null)
    const sources = promotion.get('coverImage', null)
    const props = { creditSources, creditUsername, dpi, sources }
    return <HeroPromotionAuth key="HeroPromotionAuth" {...props} />
  }

  getHeroPromotionCategory() {
    const { categoryData, dpi, isLoggedIn, isMobile, json } = this.props
    const { category } = categoryData
    const name = category.get('name', '')
    const description = category.get('description', '')
    const isSponsored = category.get('isSponsored', '')
    const ctaCaption = category.get('ctaCaption')
    const ctaHref = category.get('ctaHref')
    const promotion = this.state.promotion || Immutable.Map()
    const sources = promotion.get('image')
    const user = getLinkObject(promotion, 'user', json) || Immutable.Map()
    const creditSources = user.get('avatar', null)
    const creditUsername = user.get('username', null)
    const creditLabel = isSponsored ? 'Sponsored by' : 'Posted by'
    const props = {
      creditLabel,
      creditSources,
      creditUsername,
      ctaCaption,
      ctaHref,
      description,
      dpi,
      isLoggedIn,
      isMobile,
      name,
      sources,
    }
    return <HeroPromotionCategory key="HeroPromotionCategory" {...props} />
  }

  getHeroPromotionPage() {
    const { dpi, isLoggedIn, isMobile, json } = this.props
    const promotion = this.state.promotion || Immutable.Map()
    const header = promotion.get('header', '')
    const subheader = promotion.get('subheader', '')
    const user = getLinkObject(promotion, 'user', json) || Immutable.Map()
    const creditSources = user.get('avatar', null)
    const creditUsername = user.get('username', null)
    const ctaCaption = promotion.get('ctaCaption')
    const ctaHref = promotion.get('ctaHref')
    const sources = promotion.get('image', null)
    const props = { creditSources, creditUsername, dpi, header, sources, subheader }
    const ctaProps = { ctaCaption, ctaHref, isLoggedIn, isMobile }
    return <HeroPromotionPage key="HeroPromotionPage" {...props} {...ctaProps} />
  }

  render() {
    const children = []
    const { broadcast, renderType } = this.state
    const {
      isAuthentication,
      isCategoryPromotion,
      isPagePromotion,
      isUserProfile,
      userId,
    } = this.props

    if (broadcast) {
      const props = { broadcast, onDismiss: this.onDismissBroadcast }
      children.push(<HeroBroadcast key="HeroBroadcast" {...props} />)
    }

    // Pick a background
    if (isCategoryPromotion) {
      children.push(this.getHeroPromotionCategory())
    } else if (isPagePromotion) {
      children.push(this.getHeroPromotionPage())
    } else if (isUserProfile && userId && renderType !== USER.DETAIL_FAILURE) {
      children.push(this.getHeroProfile())
    } else if (isAuthentication) {
      children.push(this.getHeroPromotionAuth())
    }
    return (
      <Hero>
        {children}
      </Hero>
    )
  }
}

export default connect(mapStateToProps)(HeroContainer)

