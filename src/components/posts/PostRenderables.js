import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import { UserDrawer } from '../users/UserRenderables'
import ContentWarningButton from '../posts/ContentWarningButton'
import PostToolsContainer from '../../containers/PostToolsContainer'
import { HeartIcon, RepostIcon } from '../posts/PostIcons'
import RelationshipContainer from '../../containers/RelationshipContainer'
import { postLovers, postReposters } from '../../networking/api'
import StreamContainer from '../../containers/StreamContainer'
import { loadComments } from '../../actions/posts'
import { RegionItems } from '../regions/RegionRenderables'

function getPostDetailPath(author, post) {
  return `/${author.username}/post/${post.token}`
}

export const PostLoversDrawer = ({ post }) =>
  <UserDrawer
    endpoint={postLovers(post.get('id'))}
    icon={<HeartIcon />}
    key={`userAvatarsLovers_${post.get('id')}${post.get('lovesCount')}`}
    post={post}
    resultType="love"
  />

PostLoversDrawer.propTypes = {
  post: PropTypes.object,
}

export const PostRepostersDrawer = ({ post }) =>
  <UserDrawer
    endpoint={postReposters(post.get('id'))}
    icon={<RepostIcon />}
    key={`userAvatarsReposters_${post.get('id')}${post.get('repostsCount')}`}
    post={post}
    resultType="repost"
  />

PostRepostersDrawer.propTypes = {
  post: PropTypes.object,
}

export const CommentStream = ({ post, author }) =>
  <div>
    <StreamContainer
      className="CommentStreamContainer isFullWidth"
      action={loadComments(post)}
      ignoresScrollPosition
    >
      {post.get('commentsCount') > 10 ?
        <Link
          to={{
            pathname: getPostDetailPath(author, post),
            state: { didComeFromSeeMoreCommentsLink: true },
          }}
          className="CommentsLink"
        >
          See More
        </Link>
        : null
      }
    </StreamContainer>
  </div>

CommentStream.propTypes = {
  author: PropTypes.object,
  post: PropTypes.object,
}

const PostHeaderTimeAgoLink = ({ to, createdAt }) =>
  <Link className="PostHeaderTimeAgoLink" to={to}>
    <span>{new Date(createdAt).timeAgoInWords()}</span>
  </Link>

PostHeaderTimeAgoLink.propTypes = {
  createdAt: PropTypes.string,
  to: PropTypes.string,
}

export const PostHeader = ({ post, author, isPostDetail = false }) => {
  if (!post || !author) { return null }
  const postDetailPath = getPostDetailPath(author, post)
  return (
    <header className="PostHeader" key={`PostHeader_${post.get('id')}`}>
      <div className="PostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
          <Avatar
            priority={author.get('relationshipPriority')}
            sources={author.get('avatar')}
            userId={`${author.get('id')}`}
            username={author.get('username')}
          />
          <span
            className="DraggableUsername"
            data-priority={author.get('relationshipPriority') || 'inactive'}
            data-userid={author.get('id')}
            data-username={author.get('username')}
            draggable
          >
            {isPostDetail && author.get('name') ?
              <span>
                <span className="PostHeaderAuthorName">{author.get('name')}</span>
                <span className="PostHeaderAuthorUsername">@{author.get('username')}</span>
              </span>
              :
              `@${author.get('username')}`
            }
          </span>
        </Link>
      </div>
      <RelationshipContainer className="isInHeader" user={author} />
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.get('createdAt')} />
    </header>
  )
}

PostHeader.propTypes = {
  author: PropTypes.object,
  isPostDetail: PropTypes.bool,
  post: PropTypes.object,
}

export const CategoryHeader = ({ post, author, categoryName, categoryPath }) => {
  if (!post || !author) { return null }
  const postDetailPath = getPostDetailPath(author, post)
  return (
    <header className="CategoryHeader" key={`CategoryHeader_${post.get('id')}`}>
      <div className="CategoryHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
          <Avatar
            priority={author.get('relationshipPriority')}
            sources={author.get('avatar')}
            userId={`${author.get('id')}`}
            username={author.get('username')}
          />
          <span
            className="DraggableUsername"
            data-priority={author.get('relationshipPriority') || 'inactive'}
            data-userid={author.get('id')}
            data-username={author.get('username')}
            draggable
          >
            {`@${author.get('username')}`}
          </span>
        </Link>
      </div>
      <RelationshipContainer className="isInHeader" user={author} />
      <div className="CategoryHeaderCategory">
        <Link className="PostHeaderLink" to={categoryPath}>
          <span>in </span>
          <span className="CategoryHeaderCategoryName">{categoryName}</span>
        </Link>
      </div>
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.get('createdAt')} />
    </header>
  )
}

CategoryHeader.propTypes = {
  author: PropTypes.object,
  categoryName: PropTypes.string,
  categoryPath: PropTypes.string,
  post: PropTypes.object,
}

export const RepostHeader = ({ post, repostAuthor, repostedBy, inUserDetail }) => {
  if (!post || !repostedBy) { return null }
  const postDetailPath = getPostDetailPath(repostedBy, post)
  return (
    <header className={classNames('RepostHeader', { inUserDetail })} key={`RepostHeader_${post.get('id')}`}>
      <div className="RepostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${repostAuthor.get('username')}`}>
          <Avatar
            priority={repostAuthor.get('relationshipPriority')}
            sources={repostAuthor.get('avatar')}
            userId={`${repostAuthor.get('id')}`}
            username={repostAuthor.get('username')}
          />
          <span
            className="DraggableUsername"
            data-priority={repostAuthor.get('relationshipPriority') || 'inactive'}
            data-userid={repostAuthor.get('id')}
            data-username={repostAuthor.get('username')}
            draggable
          >
            {`@${repostAuthor.get('username')}`}
          </span>
        </Link>
      </div>
      <RelationshipContainer className="isInHeader" user={repostAuthor} />
      <div className="RepostHeaderReposter">
        <Link className="PostHeaderLink" to={`/${repostedBy.get('username')}`}>
          <RepostIcon />
          <span
            className="DraggableUsername"
            data-priority={repostedBy.get('relationshipPriority') || 'inactive'}
            data-userid={repostedBy.get('id')}
            data-username={repostedBy.get('username')}
            draggable
          >
            {` by @${repostedBy.get('username')}`}
          </span>
        </Link>
      </div>
      <PostHeaderTimeAgoLink to={postDetailPath} createdAt={post.get('createdAt')} />
    </header>
  )
}

RepostHeader.propTypes = {
  inUserDetail: PropTypes.bool,
  post: PropTypes.object,
  repostAuthor: PropTypes.object,
  repostedBy: PropTypes.object,
}

export const PostBody = (props) => {
  const { assets, author, columnWidth, commentOffset, contentWarning,
    contentWidth, innerHeight, isGridMode, post } = props
  if (!post || !author) { return null }
  const cells = []
  const postDetailPath = getPostDetailPath(author, post)

  if (contentWarning) {
    cells.push(<ContentWarningButton key={`contentWarning_${post.get('id')}`} post={post} />)
  }

  const regionProps = {
    assets,
    columnWidth,
    commentOffset,
    contentWidth,
    innerHeight,
    isGridMode,
    postDetailPath,
  }
  if (post.get('repostContent') && post.get('repostContent').size) {
    // this is weird, but the post summary is
    // actually the repost summary on reposts
    if (isGridMode) {
      regionProps.content = post.get('summary')
      cells.push(<RegionItems {...regionProps} key={`RegionItems_${post.get('id')}`} />)
    } else {
      regionProps.content = post.get('repostContent')
      cells.push(<RegionItems {...regionProps} key={`RegionItems_${post.get('id')}`} />)
      if (post.get('content') && post.get('content').size) {
        regionProps.content = post.content
        cells.push(
          <div className="PostBody RepostedBody" key={`RepostedBody_${post.get('id')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              to={`/${author.get('username')}`}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <RegionItems {...regionProps} />
          </div>,
        )
      }
    }
  } else {
    regionProps.content = isGridMode ? post.get('summary') : post.get('content')
    cells.push(<RegionItems {...regionProps} key={`RegionItems_${post.get('id')}`} />)
  }
  return (
    <div className="PostBody" key={`PostBody_${post.get('id')}`}>
      {cells}
    </div>
  )
}

PostBody.propTypes = {
  assets: PropTypes.object,
  author: PropTypes.object,
  columnWidth: PropTypes.number,
  commentOffset: PropTypes.number,
  contentWarning: PropTypes.string,
  contentWidth: PropTypes.number,
  innerHeight: PropTypes.number,
  isGridMode: PropTypes.bool,
  post: PropTypes.object,
}

export const PostFooter = ({ post, author, isGridMode, isRepostAnimating }) => {
  if (!author) { return null }
  return (
    <PostToolsContainer
      author={author}
      post={post}
      isGridMode={isGridMode}
      isRepostAnimating={isRepostAnimating}
      key={`PostTools_${post.get('id')}`}
    />
  )
}

PostFooter.propTypes = {
  author: PropTypes.object,
  isGridMode: PropTypes.bool,
  isRepostAnimating: PropTypes.bool,
  post: PropTypes.object,
}

