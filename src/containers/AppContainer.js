import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import {
  selectCategoryData,
  selectIsCategoryPromotion,
  selectIsPagePromotion,
  selectRandomAuthPromotion,
} from 'ello-brains/selectors/promotions'
import { selectIsAuthenticationView } from 'ello-brains/selectors/routing'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import { selectIsStaff } from 'ello-brains/selectors/profile'
import { trackEvent, trackInitialPage } from '../actions/analytics'
import { loadBadges } from '../actions/badges'
import { getCategories, getPagePromotionals } from '../actions/discover'
import { setSignupModalLaunched } from '../actions/gui'
import { openModal } from '../actions/modals'
import { loadAnnouncements, loadNotifications } from '../actions/notifications'
import { lovePost, unlovePost } from '../actions/posts'
import { loadProfile } from '../actions/profile'
import { fetchAuthenticationPromos } from '../actions/promotions'
import RegistrationRequestDialog from '../components/dialogs/RegistrationRequestDialog'
import DevTools from '../components/devtools/DevTools'
import { addGlobalDrag, removeGlobalDrag } from '../components/viewport/GlobalDragComponent'
import AnalyticsContainer from '../containers/AnalyticsContainer'
import FooterContainer from '../containers/FooterContainer'
import HeroContainer from '../containers/HeroContainer'
import InputContainer from '../containers/InputContainer'
import KeyboardContainer from '../containers/KeyboardContainer'
import MetaContainer from '../containers/MetaContainer'
import ModalContainer from '../containers/ModalContainer'
import NavbarContainer from '../containers/NavbarContainer'
import OmnibarContainer from '../containers/OmnibarContainer'
import ViewportContainer from '../containers/ViewportContainer'
import { scrollToPosition } from '../lib/jello'
import * as ElloAndroidInterface from '../lib/android_interface'
import ShareDialog from '../components/dialogs/ShareDialog'

function mapStateToProps(state) {
  return {
    authPromo: selectRandomAuthPromotion(state),
    categoryData: selectCategoryData(state),
    isAuthenticationView: selectIsAuthenticationView(state),
    isCategoryPromotion: selectIsCategoryPromotion(state),
    isLoggedIn: selectIsLoggedIn(state),
    isPagePromotion: selectIsPagePromotion(state),
    isStaff: selectIsStaff(state),
  }
}

class AppContainer extends Component {

  static propTypes = {
    authPromo: PropTypes.object,
    categoryData: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticationView: PropTypes.bool.isRequired,
    isCategoryPromotion: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPagePromotion: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
  }

  static defaultProps = {
    authPromo: null,
  }

  static preRender = (store) => {
    const state = store.getState()
    if (state.authentication.get('isLoggedIn')) {
      return Promise.all([
        store.dispatch(loadProfile()),
        store.dispatch(getCategories()),
        store.dispatch(getPagePromotionals()),
      ])
    }
    return Promise.all([
      store.dispatch(getCategories()),
      store.dispatch(getPagePromotionals()),
    ])
  }

  static childContextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
    onClickScrollToContent: PropTypes.func,
    onClickTrackCredits: PropTypes.func,
    onClickTrackCTA: PropTypes.func,
    onLaunchNativeEditor: PropTypes.func,
    openShareDialog: PropTypes.func,
    toggleLovePost: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickOpenRegistrationRequestDialog: this.onClickOpenRegistrationRequestDialog,
      onClickScrollToContent: this.onClickScrollToContent,
      onClickTrackCredits: this.onClickTrackCredits,
      onClickTrackCTA: this.onClickTrackCTA,
      onLaunchNativeEditor: this.onLaunchNativeEditor,
      openShareDialog: this.openShareDialog,
      toggleLovePost: this.toggleLovePost,
    }
  }

  componentDidMount() {
    addGlobalDrag()
    const { dispatch, isLoggedIn, isStaff } = this.props
    dispatch(trackInitialPage())
    if (isLoggedIn) {
      dispatch(loadProfile())
      dispatch(loadNotifications({ category: 'all' }))
      dispatch(loadAnnouncements())
    } else {
      dispatch(fetchAuthenticationPromos())
    }
    dispatch(getCategories())
    dispatch(getPagePromotionals())
    dispatch(loadBadges())
    ElloAndroidInterface.initialize(dispatch, isStaff)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      dispatch(loadProfile())
      dispatch(getCategories())
      dispatch(getPagePromotionals())
      dispatch(loadBadges())
      dispatch(loadAnnouncements())
    } else if (this.props.isLoggedIn && !nextProps.isLoggedIn) {
      dispatch(fetchAuthenticationPromos())
      dispatch(getCategories())
      dispatch(getPagePromotionals())
      dispatch(loadBadges())
    }
  }

  shouldComponentUpdate(nextProps) {
    return ['isAuthenticationView', 'isLoggedIn', 'params', 'children'].some(prop =>
      nextProps[prop] !== this.props[prop],
    )
  }

  componentWillUnmount() {
    removeGlobalDrag()
  }

  // TODO: Rename this to openRegistrationRequestDialog since it's a method
  // call and not coming directly from an event.
  onClickOpenRegistrationRequestDialog = (trackPostfix = 'modal') => {
    const { authPromo, dispatch, isAuthenticationView } = this.props
    if (isAuthenticationView || !authPromo) { return }
    dispatch(openModal(
      <RegistrationRequestDialog promotional={authPromo} />,
      'asDecapitated',
      'RegistrationRequestDialog',
      `open-registration-request-${trackPostfix}`,
    ))
    dispatch(setSignupModalLaunched())
  }

  onClickScrollToContent = () => {
    scrollToPosition(0, document.querySelector('.Hero').offsetHeight)
  }

  onClickTrackCredits = () => {
    const { dispatch, categoryData, isCategoryPromotion, isPagePromotion } = this.props
    let label = ''
    if (isCategoryPromotion && categoryData) {
      label = categoryData.category.get('slug')
    } else if (isPagePromotion) {
      label = 'general'
    } else {
      label = 'auth'
    }
    dispatch(trackEvent('promoByline_clicked', { name: label }))
  }

  onClickTrackCTA = () => {
    const { dispatch, categoryData } = this.props
    dispatch(trackEvent('promoCTA_clicked', { name: categoryData.category.get('slug', 'general') }))
  }

  onLaunchNativeEditor = (post = null, isComment = false, comment = null, text = null) => {
    ElloAndroidInterface.launchEditor(
      post ? JSON.stringify(post.toJS()) : null,
      `${isComment}`,
      comment ? JSON.stringify(comment.toJS()) : null,
      text,
    )
  }

  openShareDialog = ({ post, postAuthor, trackLabel, trackOptions }) => {
    const { dispatch } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(
      <ShareDialog
        author={postAuthor}
        post={post}
        trackEvent={action}
        trackOptions={trackOptions}
      />,
      '',
      null,
      trackLabel || 'open-share-dialog',
      trackOptions || {},
    ))
  }

  toggleLovePost = ({ isLoved, post, trackLabel, trackOptions }) => {
    const { dispatch } = this.props
    if (isLoved) {
      dispatch(unlovePost({ post, trackLabel, trackOptions }))
    } else {
      dispatch(lovePost({ post, trackLabel, trackOptions }))
    }
  }

  render() {
    const { children, isAuthenticationView, isLoggedIn, params } = this.props
    const appClasses = classNames(
      'AppContainer',
      { isLoggedIn },
      { isLoggedOut: !isLoggedIn },
    )
    return (
      <section className={appClasses}>
        <MetaContainer params={params} />
        <ViewportContainer params={params} />
        {isLoggedIn ? <OmnibarContainer /> : null}
        <HeroContainer params={params} />
        {children}
        <NavbarContainer params={params} />
        {!isAuthenticationView && <FooterContainer params={params} />}
        {isLoggedIn ? <InputContainer /> : null}
        <ModalContainer />
        <DevTools />
        <KeyboardContainer />
        <AnalyticsContainer />
      </section>
    )
  }
}

export default connect(mapStateToProps)(AppContainer)

