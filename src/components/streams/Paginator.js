import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { ElloMark } from '../assets/Icons'

function getMessage({ hasShowMoreButton, messageText, totalPages, totalPagesRemaining }) {
  if (totalPagesRemaining === 0) {
    return ''
  } else if (hasShowMoreButton) {
    return messageText
  }
  return (totalPages > 0) ?
    `${messageText}: ${(totalPages - totalPagesRemaining) + 1} of ${totalPages}` :
    `${messageText}...`
}

export const Paginator = ({
    className = null,
    hasShowMoreButton = false,
    isHidden = true,
    loadNextPage,
    messageText = '',
    totalPages,
    totalPagesRemaining,
  }) => {
  const message = getMessage({ hasShowMoreButton, messageText, totalPages, totalPagesRemaining })
  return (
    <div className={classNames('Paginator', { isBusy: !isHidden }, className)}>
      <ElloMark className="isSpinner" />
      {
        hasShowMoreButton ?
          <button onClick={loadNextPage}>{message}</button> :
          <span className="PaginatorMessage">{message}</span>
      }
    </div>
  )
}

Paginator.propTypes = {
  className: PropTypes.string,
  hasShowMoreButton: PropTypes.bool,
  isHidden: PropTypes.bool,
  loadNextPage: PropTypes.func,
  messageText: PropTypes.string,
  totalPages: PropTypes.number.isRequired,
  totalPagesRemaining: PropTypes.number.isRequired,
}

Paginator.defaultProps = {
  totalPages: 0,
  totalPagesRemaining: 0,
}

export default Paginator

