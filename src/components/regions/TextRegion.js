/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import classNames from 'classnames'

const isLink = (target) => {
  if (target.nodeName.toLowerCase() === 'a') { return true }
  const parent = target.closest ? target.closest('a') : target.parentNode
  return parent && parent.nodeName.toLowerCase() === 'a'
}

/* eslint-disable react/prefer-stateless-function */
class TextRegion extends Component {

  static propTypes = {
    content: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    postDetailPath: PropTypes.string,
  }

  static defaultProps = {
    postDetailPath: null,
  }

  onClickRegion = (e) => {
    const { dispatch, isGridMode, postDetailPath } = this.props
    const { classList, dataset } = e.target
    // Get the raw value instead of the property value which is always absolute
    const href = e.target.getAttribute('href')

    // Relative links get sent to push (usernames, raw links, hashtags)
    if (href && href[0] === '/') {
      e.preventDefault()
      dispatch(push(href))

    // TODO: We have a special `span` based fake link at the moment we have to test
    // for. Once we change this back to an `<a> element we can rip this out.
    } else if (classList.contains('hashtag-link')) {
      e.preventDefault()
      dispatch(push(dataset.href))


    // Treat non links within grid layouts as a push to it's detail path
    } else if (isGridMode && postDetailPath && !isLink(e.target)) {
      e.preventDefault()

      // if it's a command / control click or middle mouse fake a link and
      // click it... I'm serious.
      if (e.metaKey || e.ctrlKey || e.which === 2) {
        const a = document.createElement('a')
        a.href = postDetailPath
        a.target = '_blank'
        a.click()
        return
      }
      // ..otherwise just push it through..
      dispatch(push(postDetailPath))
    }
    // The alternative is it's either in list and we ignore it or it's an
    // absolute link and we allow it's default behavior.
  }

  render() {
    const { content, isGridMode, postDetailPath } = this.props
    const isHot = isGridMode && postDetailPath
    return (
      <div className="TextRegion">
        <div
          className={classNames('RegionContent', { isHot })}
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={this.onClickRegion}
        />
      </div>
    )
  }
}

export default connect()(TextRegion)

