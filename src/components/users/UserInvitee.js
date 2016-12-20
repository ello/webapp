import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'
import { getLinkObject } from '../../helpers/json_helper'
import { inviteUsers } from '../../actions/invitations'
import Avatar from '../assets/Avatar'
import RelationshipContainer from '../../containers/RelationshipContainer'

function renderMailtoUserHeader(invitation) {
  const email = invitation.get('email')
  return (
    <div className="UserInviteeHeader">
      <a className="UserInviteeUserLink truncate" href={`mailto: ${email}`}>
        <Avatar />
        <span className="UserInviteeEmail">{email}</span>
      </a>
    </div>
  )
}

/* eslint-disable react/prefer-stateless-function */
class UserInvitee extends Component {

  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    invitation: PropTypes.object.isRequired,
    user: PropTypes.object,
  }

  onClickReInvite = () => {
    const { dispatch, invitation } = this.props
    dispatch(inviteUsers([invitation.get('email')]))
  }

  renderSending(invitation) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        {renderMailtoUserHeader(invitation)}
        <span className="UserInviteeStatusLabel">Sending</span>
      </div>
    )
  }

  renderReInvite(invitation) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        {renderMailtoUserHeader(invitation)}
        <button className="UserInviteeAction" onClick={this.onClickReInvite}>Re-Invite</button>
      </div>
    )
  }

  renderAccepted(user) {
    return (
      <div className={classNames(this.props.className, 'UserInvitee')}>
        <div className="UserInviteeHeader">
          <Link className="UserInviteeUserLink truncate" to={`/${user.get('username')}`}>
            <Avatar
              priority={user.get('relationshipPriority')}
              sources={user.get('avatar')}
              userId={`${user.get('id')}`}
              username={user.get('username')}
            />
            <span className="UserInviteeUsername">{`@${user.get('username')}`}</span>
          </Link>
        </div>
        <RelationshipContainer user={user} />
      </div>
    )
  }

  // Need to actually define when these states are setup
  render() {
    const { invitation, user } = this.props
    if (invitation.get('acceptedAt')) {
      return this.renderAccepted(user)
    } else if (invitation.get('email')) {
      return this.renderReInvite(invitation)
    }
    return null
  }
}

function mapStateToProps(state, props) {
  return {
    user: getLinkObject(props.invitation, 'acceptedBy', state.json),
  }
}

export default connect(mapStateToProps)(UserInvitee)

