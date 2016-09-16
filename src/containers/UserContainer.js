import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import shallowCompare from 'react-addons-shallow-compare'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectUserFromPropsUserId } from '../selectors/user'
import { UserAvatar, UserCompact, UserGrid,
  UserList, UserProfile } from '../components/users/UserRenderables'
import MessageDialog from '../components/dialogs/MessageDialog'
import RegistrationRequestDialog from '../components/dialogs/RegistrationRequestDialog'
import ShareDialog from '../components/dialogs/ShareDialog'
import { closeModal, openModal } from '../actions/modals'
import { trackEvent } from '../actions/analytics'
import { sendMessage } from '../actions/user'
import { getElloPlatform } from '../vendor/jello'

export function mapStateToProps(state, props) {
  const user = selectUserFromPropsUserId(state, props)
  return {
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    isLoggedIn: selectIsLoggedIn(state),
    lovesCount: user.lovesCount,
    postsCount: user.postsCount,
    relationshipPriority: user.relationshipPriority,
    user,
    username: user.username,
  }
}

/* eslint-disable react/no-unused-prop-types */
class UserContainer extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    followingCount: PropTypes.number,
    followersCount: PropTypes.number,
    isLoggedIn: PropTypes.bool,
    lovesCount: PropTypes.number,
    postsCount: PropTypes.number,
    relationshipPriority: PropTypes.string,
    showBlockMuteButton: PropTypes.bool,
    type: PropTypes.oneOf([
      'avatar',
      'compact',
      'grid',
      'profile',
      'list',
    ]).isRequired,
    useGif: PropTypes.bool,
    user: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    showBlockMuteButton: false,
    useGif: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickShareProfile = () => {
    const { dispatch, user } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog user={user} trackEvent={action} />))
    dispatch(trackEvent('open-share-dialog-profile'))
  }

  onOpenHireMeModal = () => {
    const { dispatch, user } = this.props
    dispatch(openModal(
      <MessageDialog
        name={`${user.name ? user.name : user.username}`}
        onConfirm={this.onConfirmHireMe}
        onDismiss={this.onDismissModal}
      />
    ))
    dispatch(trackEvent('open-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onConfirmHireMe = ({ message }) => {
    const { dispatch, user } = this.props
    dispatch(sendMessage(user.id, message))
    dispatch(trackEvent('send-hire-dialog-profile', { platform: getElloPlatform() }))
  }

  onDismissModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onOpenSignupModal = () => {
    const { dispatch } = this.props
    dispatch(openModal(<RegistrationRequestDialog />, 'isDecapitated'))
    dispatch(trackEvent('open-registration-request-hire-me-button'))
  }

  render() {
    const { className, isLoggedIn, showBlockMuteButton, type, user, useGif } = this.props
    switch (type) {
      case 'avatar':
        return <UserAvatar user={user} />
      case 'compact':
        return <UserCompact className={className} user={user} />
      case 'grid':
        return <UserGrid user={user} />
      case 'profile':
        return (
          <UserProfile
            onClickHireMe={isLoggedIn ? this.onOpenHireMeModal : this.onOpenSignupModal}
            onClickShareProfile={this.onClickShareProfile}
            user={user}
          />
        )
      case 'list':
        return (
          <UserList
            className={className}
            isLoggedIn={isLoggedIn}
            onClickHireMe={isLoggedIn ? this.onOpenHireMeModal : this.onOpenSignupModal}
            onClickShareProfile={this.onClickShareProfile}
            showBlockMuteButton={showBlockMuteButton}
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

