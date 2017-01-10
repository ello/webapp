import React, { PropTypes } from 'react'

const AdultPostsDialog = ({ onConfirm }) =>
  <div className="Dialog AdultPostsDialog">
    <p>If you post adult content, you must mark your account Not Safe for Work (NSFW).</p>
    <p>
      When you set &quot;Post Adult Content&quot; to yes, users who do not wish to view
      adult content will not see your posts.
    </p>
    <button className="AdultPostsDialogButton" onClick={onConfirm}>Okay</button>
  </div>

AdultPostsDialog.propTypes = {
  onConfirm: PropTypes.func.isRequired,
}

export default AdultPostsDialog

