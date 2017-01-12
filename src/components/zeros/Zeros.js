import React, { PropTypes } from 'react'
import RelationshipContainer from '../../containers/RelationshipContainer'
import Editor from '../editor/Editor'

export const ZeroStream = ({ children, onDismiss }) =>
  <div className="ZeroStream">
    <h2 className="ZeroStreamHeading">
      {children}
    </h2>
    {onDismiss ?
      <button className="ZeroStreamButton" onClick={onDismiss}>
        <span>Close</span>
      </button> :
      null
     }
  </div>

ZeroStream.propTypes = {
  children: PropTypes.node.isRequired,
  onDismiss: PropTypes.func,
}

ZeroStream.defaultProps = {
  onDismiss: null,
}


export const ZeroFollowingStream = () =>
  <ZeroStream emoji="lollipop">
    Follow the creators and communities that inspire you.
  </ZeroStream>


export const ZeroStarredStream = () =>
  <ZeroStream emoji="star">
    Star creators and communities to curate a second stream.
  </ZeroStream>

// -------------------------------------

export const ZeroState = ({ children = 'Sorry, no results found.' }) =>
  <div className="ZeroState">
    {children}
  </div>

ZeroState.propTypes = {
  children: PropTypes.node,
}


export const ZeroStateCreateRelationship = ({ user }) =>
  <ZeroState>
    <h2 className="ZeroStateTitle">
      <span className="ZeroStateUsername">{`@${user.get('username')}`}</span>
      <span>{' doesn\'t have any followers yet, why don\'t you be their first?'}</span>
    </h2>
    <RelationshipContainer user={user} />
  </ZeroState>

ZeroStateCreateRelationship.propTypes = {
  user: PropTypes.object.isRequired,
}


export const ZeroStateSayHello = ({ hasPosted = false, onSubmit, user }) =>
  <ZeroState>
    <h2 className="ZeroStateTitle">
      <span>{'It doesn\'t look like '}</span>
      <span className="ZeroStateUsername">{`@${user.get('username')}`}</span>
      <span>{' has posted yet, why don\'t you say hi?'}</span>
    </h2>
    {hasPosted ?
      <p>{`Notification to @${user.get('username')} has been sent.`}</p> :
      <Editor autoPopulate={`Hi @${user.get('username')} :wave:`} onSubmit={onSubmit} />
    }
  </ZeroState>

ZeroStateSayHello.propTypes = {
  hasPosted: PropTypes.bool,
  onSubmit: PropTypes.func,
  user: PropTypes.object.isRequired,
}


export const ZeroStateFirstPost = () =>
  <ZeroState>
    <h2 className="ZeroStateTitle">
      It doesn’t look like you’ve posted yet, why don’t you give it a shot.
    </h2>
    <Editor autoPopulate="Ello World! My first post on :ello:!" />
  </ZeroState>

ZeroStateFirstPost.propTypes = {
  hasPosted: PropTypes.bool,
  onSubmit: PropTypes.func,
}

