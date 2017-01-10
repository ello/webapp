import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { RegionItems } from '../regions/RegionRenderables'
import Avatar from '../assets/Avatar'
import CommentToolsContainer from '../../containers/CommentToolsContainer'

export const CommentHeader = ({ comment, author }) => {
  if (!comment || !author) { return null }
  return (
    <header className="CommentHeader" key={`CommentHeader_${comment.get('id')}`}>
      <div className="CommentHeaderAuthor">
        <Link className="CommentHeaderLink" to={`/${author.get('username')}`}>
          <Avatar
            priority={author.get('relationshipPriority')}
            sources={author.get('avatar')}
            userId={`${author.get('id')}`}
            username={author.get('username')}
          />
          <span
            className="CommentUsername DraggableUsername"
            data-priority={author.get('relationshipPriority', 'inactive')}
            data-userid={author.get('id')}
            data-username={author.get('username')}
            draggable
          >
            {`@${author.get('username')}`}
          </span>
        </Link>
      </div>
    </header>
  )
}

CommentHeader.propTypes = {
  author: PropTypes.object,
  comment: PropTypes.object,
}
CommentHeader.defaultProps = {
  author: null,
  comment: null,
}

export const CommentBody = ({ assets, comment, isGridMode = true }) =>
  <div className="CommentBody" key={`CommentBody${comment.get('id')}`} >
    <RegionItems
      assets={assets}
      content={comment.get('content')}
      isGridMode={isGridMode}
    />
  </div>

CommentBody.propTypes = {
  assets: PropTypes.object,
  comment: PropTypes.object,
  isGridMode: PropTypes.bool,
}
CommentBody.defaultProps = {
  assets: null,
  comment: null,
  isGridMode: false,
}

export const CommentFooter = ({ author, comment, currentUser, post }) => {
  if (!author) { return null }
  return (
    <CommentToolsContainer
      author={author}
      comment={comment}
      currentUser={currentUser}
      key={`CommentTools_${comment.get('id')}`}
      post={post}
    />
  )
}

CommentFooter.propTypes = {
  author: PropTypes.object,
  comment: PropTypes.object,
  currentUser: PropTypes.object,
  post: PropTypes.object,
}
CommentFooter.defaultProps = {
  author: null,
  comment: null,
  currentUser: null,
  post: null,
}

