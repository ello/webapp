/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LockIcon } from './EditorIcons'
import { RepostIcon } from '../posts/PostIcons'

function mapStateToProps({ profile: currentUser }) {
  return { currentUser }
}

function getBlockElement(block, uid) {
  const data = block.get('data')
  switch (block.get('kind')) {
    case 'embed':
      return (
        <img key={`repostEmbed_${uid}`} src={data.get('thumbnailLargeUrl')} alt={data.get('service')} />
      )
    case 'image':
      return (
        <img key={`repostImage_${uid}`} src={data.get('url')} alt={data.get('alt')} />
      )
    case 'text':
      return (
        <div key={`repostText_${uid}`} dangerouslySetInnerHTML={{ __html: data }} />
      )
    default:
      return null
  }
}

class RepostBlock extends Component {

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { currentUser, data } = this.props
    return (
      <div className="editor-block readonly">
        <div className="RepostBlockLabel">
          <RepostIcon />
          {` by @${currentUser.get('username')}`}
        </div>
        {data.map((block, i) => getBlockElement(block, i))}
        <div className="RegionTools">
          <LockIcon />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(RepostBlock)

