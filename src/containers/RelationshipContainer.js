import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { createSelector } from 'reselect'
import classNames from 'classnames'
import { RELATIONSHIP_PRIORITY } from '../constants/relationship_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDeviceSize } from '../selectors/gui'
import { selectPathname, selectPreviousPath } from '../selectors/routing'
import { selectUser } from '../selectors/user'
import { openModal, closeModal } from '../actions/modals'
import { updateRelationship } from '../actions/relationships'
import { flagUser } from '../actions/user'
import BlockMuteDialog from '../components/dialogs/BlockMuteDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import BlockMuteButton from '../components/relationships/BlockMuteButton'
import RelationshipButton from '../components/relationships/RelationshipButton'
import StarshipButton from '../components/relationships/StarshipButton'

const selectRelationshipPriority = (state, props) => props.relationshipPriority
const selectHasBlockMuteButton = (state, props) => props.hasBlockMuteButton

const selectOnClickCallback = createSelector(
  [selectIsLoggedIn, selectRelationshipPriority], (isLoggedIn, relationshipPriority) => {
    if (!isLoggedIn) { return 'onOpenSignupModal' }
    const isBlockedOrMuted = (relationshipPriority &&
      relationshipPriority === RELATIONSHIP_PRIORITY.BLOCK) ||
      relationshipPriority === RELATIONSHIP_PRIORITY.MUTE
    return isBlockedOrMuted ? 'onOpenBlockMuteModal' : 'onRelationshipUpdate'
  },
)

const selectShouldRenderBlockMuteButton = createSelector(
  [selectIsLoggedIn, selectRelationshipPriority, selectHasBlockMuteButton],
  (isLoggedIn, relationshipPriority, hasBlockMuteButton) =>
    isLoggedIn && hasBlockMuteButton && relationshipPriority !== RELATIONSHIP_PRIORITY.SELF,
)

export function getNextBlockMutePriority(currentPriority, requestedPriority) {
  switch (currentPriority) {
    case RELATIONSHIP_PRIORITY.BLOCK:
    case RELATIONSHIP_PRIORITY.MUTE:
      return RELATIONSHIP_PRIORITY.INACTIVE
    default:
      switch (requestedPriority) {
        case RELATIONSHIP_PRIORITY.BLOCK:
          return RELATIONSHIP_PRIORITY.BLOCK
        case RELATIONSHIP_PRIORITY.MUTE:
          return RELATIONSHIP_PRIORITY.MUTE
        default:
          return RELATIONSHIP_PRIORITY.INACTIVE
      }
  }
}

// TODO: Try and get rid of deviceSize
export function mapStateToProps(state, props) {
  const user = selectUser(state, props)
  const onClickCallback = selectOnClickCallback(state, props)
  const shouldRenderBlockMute = selectShouldRenderBlockMuteButton(state, props)
  return {
    deviceSize: selectDeviceSize(state),
    onClickCallback,
    pathname: selectPathname(state),
    previousPath: selectPreviousPath(state),
    relationshipPriority: user.get('relationshipPriority'),
    shouldRenderBlockMute,
    userId: user.get('id'),
    username: user.get('username'),
  }
}

class RelationshipContainer extends Component {

  static propTypes = {
    className: PropTypes.string,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    onClickCallback: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    previousPath: PropTypes.string,
    relationshipPriority: PropTypes.string,
    shouldRenderBlockMute: PropTypes.bool,
    userId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    username: PropTypes.string.isRequired,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  shouldComponentUpdate() {
    if (!this.props.userId) { return false }
    return true
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onConfirmBlockUser = () => {
    const { dispatch, previousPath, relationshipPriority, userId } = this.props
    this.onRelationshipUpdate({
      userId,
      priority: getNextBlockMutePriority(relationshipPriority, RELATIONSHIP_PRIORITY.BLOCK),
      existing: relationshipPriority,
    })
    this.onCloseModal()
    if (relationshipPriority !== RELATIONSHIP_PRIORITY.BLOCK) {
      dispatch(replace(previousPath || '/'))
    }
  }

  onConfirmFlagUser = () => {
    const { deviceSize, dispatch } = this.props
    this.onCloseModal()
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onConfirm={this.onCloseModal}
        onResponse={this.onUserWasFlagged}
      />))
  }

  onConfirmMuteUser = () => {
    const { relationshipPriority, userId } = this.props
    this.onRelationshipUpdate({
      userId,
      priority: getNextBlockMutePriority(relationshipPriority, RELATIONSHIP_PRIORITY.MUTE),
      existing: relationshipPriority,
    })
    this.onCloseModal()
  }

  onOpenBlockMuteModal = () => {
    const { dispatch, relationshipPriority, username } = this.props
    dispatch(openModal(
      <BlockMuteDialog
        isBlockActive={relationshipPriority === RELATIONSHIP_PRIORITY.BLOCK}
        isMuteActive={relationshipPriority === RELATIONSHIP_PRIORITY.MUTE}
        onBlock={this.onConfirmBlockUser}
        onFlag={this.onConfirmFlagUser}
        onMute={this.onConfirmMuteUser}
        username={username}
      />
    , 'isDangerZone'))
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('follow-button')
  }

  onRelationshipUpdate = ({ userId, priority, existing }) => {
    const { dispatch, pathname } = this.props
    const isInternal = !!(pathname && (/^\/onboarding/).test(pathname))
    dispatch(updateRelationship(userId, priority, existing, isInternal))
  }

  onUserWasFlagged = ({ flag }) => {
    const { dispatch, username } = this.props
    dispatch(flagUser(username, flag))
  }

  render() {
    const { className, relationshipPriority, userId } = this.props
    const { onClickCallback, shouldRenderBlockMute } = this.props
    return (
      <div
        className={classNames('RelationshipContainer', className)}
        data-priority={relationshipPriority}
      >
        {shouldRenderBlockMute ?
          <BlockMuteButton
            className={className}
            onClick={this.onOpenBlockMuteModal}
            priority={relationshipPriority}
            userId={userId}
          /> : null
        }
        {!shouldRenderBlockMute ?
          <RelationshipButton
            className={className}
            onClick={this[onClickCallback]}
            priority={relationshipPriority}
            userId={userId}
          /> : null
        }
        {!shouldRenderBlockMute ?
          <StarshipButton
            className={className}
            onClick={this[onClickCallback]}
            priority={relationshipPriority}
            userId={userId}
          /> : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(RelationshipContainer)

