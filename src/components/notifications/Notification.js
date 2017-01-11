import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'

function renderHeader({ notifier }) {
  if (!notifier) { return null }
  return (
    <header className="NotificationHeader">
      <Avatar
        priority={notifier.get('relationshipPriority')}
        sources={notifier.get('avatar')}
        to={`/${notifier.get('username')}`}
        userId={`${notifier.get('id')}`}
        username={notifier.get('username')}
      />
    </header>
  )
}
renderHeader.propTypes = {
  notifier: PropTypes.object,
}
renderHeader.defaultProps = {
  notifier: null,
}

function renderBody({ children, summary }) {
  if (!children) { return null }
  return (
    <div className="NotificationBody">
      {children}
      {summary && summary.texts && summary.texts.length ?
        <div className="NotificationSummaryTexts">{summary.texts}</div> : null
      }
    </div>
  )
}
renderBody.propTypes = {
  children: PropTypes.node,
  summary: PropTypes.object,
}
renderBody.defaultProps = {
  children: null,
  summary: null,
}

function renderAssets({ summary }) {
  return (
    summary && summary.assets && summary.assets.length ?
      <div className="NotificationAsset">{summary.assets[0]}</div> : null
  )
}
renderAssets.propTypes = {
  summary: PropTypes.object,
}
renderAssets.defaultProps = {
  summary: null,
}

function renderFooter({ activityPath, createdAt }) {
  if (!createdAt) { return null }
  return (
    <footer className="NotificationFooter">
      <Link className="NotificationFooterTimestamp" to={activityPath}>
        {new Date(createdAt).timeAgoInWords()}
      </Link>
    </footer>
  )
}
renderFooter.propTypes = {
  activityPath: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
}
renderFooter.defaultProps = {
  createdAt: null,
}

export const Notification = ({
  activityPath,
  children,
  className,
  createdAt,
  notifier,
  summary,
  }) => {
  const hasAsset = summary && summary.assets && summary.assets.length
  return (
    <div className={classNames('Notification', className, { hasAsset })}>
      {renderHeader({ notifier })}
      {renderAssets({ summary })}
      {renderBody({ children, summary })}
      {renderFooter({ activityPath, createdAt })}
    </div>
  )
}
Notification.propTypes = {
  activityPath: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  createdAt: PropTypes.string,
  notifier: PropTypes.object,
  summary: PropTypes.object,
}
Notification.defaultProps = {
  className: null,
  createdAt: null,
  notifier: null,
  summary: null,
}

export default Notification

