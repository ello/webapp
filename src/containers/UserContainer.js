import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDeviceSize } from '../selectors/gui'
import { selectViewsAdultContent } from '../selectors/profile'
import { selectJson } from '../selectors/store'
import { selectTruncatedShortBio, selectUserFromPropsUserId } from '../selectors/user'
import {
  UserAvatar,
  UserCompact,
  UserProfileCard,
  UserProfile,
} from '../components/users/UserRenderables'
import MessageDialog from '../components/dialogs/MessageDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import { TextMarkupDialog, FeaturedInDialog } from '../components/dialogs/DialogRenderables'
import { closeModal, openModal } from '../actions/modals'
import { trackEvent } from '../actions/analytics'
import { collabWithUser, hireUser } from '../actions/user'
import { getElloPlatform } from '../lib/jello'
import { getLinkArray } from '../helpers/json_helper'

const selectUserCategories = createSelector(
  [selectUserFromPropsUserId, selectJson], (user, json) =>
    getLinkArray(user, 'categories', json) || Immutable.List(),
)

export function mapStateToProps(state, props) {
  const user = selectUserFromPropsUserId(state, props) || Immutable.Map()
  const categories = selectUserCategories(state, props)
  const truncatedShortBio = selectTruncatedShortBio(state, props)
  const deviceSize = selectDeviceSize(state)
  return {
    categories,
    followersCount: user.get('followersCount'),
    followingCount: user.get('followingCount'),
    isFeatured: !!(categories.size),
    isLoggedIn: selectIsLoggedIn(state),
    isShortBioTruncated: truncatedShortBio.text.length >= 150,
    isMobile: deviceSize === 'mobile',
    lovesCount: user.get('lovesCount'),
    postsCount: user.get('postsCount'),
    relationshipPriority: user.get('relationshipPriority'),
    truncatedShortBio: truncatedShortBio.html,
    useGif: selectViewsAdultContent(state) || !user.get('postsAdultContent'),
    user,
    username: user.get('username'),
  }
}

/* eslint-disable react/no-unused-prop-types */
class UserContainer extends Component {

  static propTypes = {
    categories: PropTypes.object,
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    followingCount: PropTypes.number,
    followersCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isFeatured: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isShortBioTruncated: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    lovesCount: PropTypes.number,
    postsCount: PropTypes.number,
    relationshipPriority: PropTypes.string,
    truncatedShortBio: PropTypes.string,
    type: PropTypes.oneOf([
      'avatar',
      'compact',
      'grid',
      'profile',
    ]).isRequired,
    useGif: PropTypes.bool,
    user: PropTypes.object,
    username: PropTypes.string,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    showBlockMuteButton: false,
    useGif: false,
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.user, this.props.user) ||
      ['isLoggedIn', 'isMobile'].some(prop => nextProps[prop] !== this.props[prop])
  }

  onClickOpenBio = () => {
    const { dispatch, isMobile, user } = this.props
    dispatch(openModal(
      <TextMarkupDialog html={user.get('formattedShortBio', '')} />,
      isMobile ? 'isFlex hasOverlay9' : 'hasOverlay9',
    ))
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  onClickOpenFeaturedModal = () => {
    const { categories, dispatch, isMobile } = this.props
    const len = categories.size
    const links = categories.map((category, index) => {
      let postfix = ''
      if (index < len - 2) {
        postfix = ', '
      } else if (index < len - 1) {
        postfix = ', & '
      }
      return [<Link to={`/discover/${category.get('slug')}`}>{category.get('name')}</Link>, postfix]
    })
    dispatch(openModal(
      <FeaturedInDialog>{['Featured in '].concat(links.toArray())}</FeaturedInDialog>,
      isMobile ? 'isFlex' : null,
    ))
  }

  onOpenCollabModal = () => {
    const { dispatch, user, username } = this.props
    dispatch(openModal(
      <MessageDialog
        name={`${user.get('name', username)}`}
        onConfirm={this.onConfirmCollab}
        onDismiss={this.onDismissModal}
        titlePrefix="Collaborate with"
      />,
    ))
    dispatch(trackEvent('open-collab-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmCollab = ({ message }) => {
    const { dispatch, user } = this.props
    dispatch(collabWithUser(user.get('id'), message))
    dispatch(trackEvent('send-collab-dialog-profile', { platform: getElloPlatform() }))
  }

  onOpenHireMeModal = () => {
    const { dispatch, user, username } = this.props
    dispatch(openModal(
      <MessageDialog
        name={`${user.get('name', username)}`}
        onConfirm={this.onConfirmHireMe}
        onDismiss={this.onDismissModal}
        titlePrefix="Hire"
      />,
    ))
    dispatch(trackEvent('open-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmHireMe = ({ message }) => {
    const { dispatch, user } = this.props
    dispatch(hireUser(user.get('id'), message))
    dispatch(trackEvent('send-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onDismissModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('hire-me-button')
  }

  render() {
    const {
      className,
      isFeatured,
      isLoggedIn,
      isMobile,
      isShortBioTruncated,
      truncatedShortBio,
      type,
      useGif,
      user,
    } = this.props
    const onHireMeFunc = isLoggedIn ? this.onOpenHireMeModal : this.onOpenSignupModal
    const onCollabFunc = isLoggedIn ? this.onOpenCollabModal : this.onOpenSignupModal
    const onClickOpenBio = isShortBioTruncated ? this.onClickOpenBio : null
    const onClickOpenFeaturedModal = isFeatured ? this.onClickOpenFeaturedModal : null
    if (!user || !user.get('id')) { return null }
    switch (type) {
      case 'avatar':
        return <UserAvatar user={user} />
      case 'compact':
        return <UserCompact className={className} user={user} />
      case 'grid':
        return (
          <UserProfileCard
            isMobile={isMobile}
            onClickCollab={onCollabFunc}
            onClickHireMe={onHireMeFunc}
            onClickOpenFeaturedModal={onClickOpenFeaturedModal}
            truncatedShortBio={truncatedShortBio}
            user={user}
          />
        )
      case 'profile':
        return (
          <UserProfile
            isLoggedIn={isLoggedIn}
            isMobile={isMobile}
            onClickCollab={onCollabFunc}
            onClickHireMe={onHireMeFunc}
            onClickOpenBio={onClickOpenBio}
            onClickOpenFeaturedModal={onClickOpenFeaturedModal}
            onClickShareProfile={this.onClickShareProfile}
            truncatedShortBio={truncatedShortBio}
            useGif={useGif}
            user={user}
          />
        )
      default:
        return null
    }
  }
}
/* eslint-enable react/no-unused-prop-types */

export default connect(mapStateToProps)(UserContainer)

