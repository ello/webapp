import React, { PropTypes } from 'react'
import classNames from 'classnames'

const BlockMuteDialog = ({
  isBlockActive = false,
  isMuteActive = false,
  onBlock,
  onFlag,
  onMute,
  username,
  }) => {
  const blockButtonClasses = classNames({ isActive: isBlockActive }, 'BlockMuteDialogButton')
  const muteButtonClasses = classNames({ isActive: isMuteActive }, 'BlockMuteDialogButton')
  const blockButtonText = isBlockActive ? 'Unblock' : 'Block'
  const muteButtonText = isMuteActive ? 'Unmute' : 'Mute'

  return (
    <div className="Dialog BlockMuteDialog">
      <h2>{`Would you like to mute, block or flag @${username}?`}</h2>
      <div className="BlockMuteDialogBody">
        <div className="BlockMuteDialogColumn">
          <button
            className={muteButtonClasses}
            onClick={onMute}
          >
            {muteButtonText}
          </button>
          <p>
            Muting prevents further email notifications from a user and removes
            their past activity from your feed. The user is still able to
            follow you and can still comment on your posts, but you will not
            receive any notifications.
          </p>
        </div>
        <div className="BlockMuteDialogColumn">
          <button
            className={blockButtonClasses}
            onClick={onBlock}
          >
            {blockButtonText}
          </button>
          <p>
            Blocking mutes a user, and disables them from viewing your profile
            and posts. When blocking, we recommend setting your account to
            &quot;Non-Public&quot; to disable your profile from being viewed by people
            outside of the Ello network.
          </p>
        </div>
        <div className="BlockMuteDialogColumn">
          <button
            className="BlockMuteDialogButton"
            onClick={onFlag}
          >
            Flag User
          </button>
          <p>
            Report @{username} for violating our rules.
          </p>
        </div>
      </div>
    </div>
  )
}

BlockMuteDialog.propTypes = {
  isBlockActive: PropTypes.bool.isRequired,
  isMuteActive: PropTypes.bool.isRequired,
  onBlock: PropTypes.func.isRequired,
  onFlag: PropTypes.func.isRequired,
  onMute: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
}

export default BlockMuteDialog

