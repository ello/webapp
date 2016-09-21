import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'
import ImageAsset from '../assets/ImageAsset'
import { isGif } from '../../helpers/file_helper'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export function getSource(props) {
  const { coverDPI, coverImage, useGif } = props
  if (!coverImage) {
    return ''
  } else if (coverImage.tmp && coverImage.tmp.url) {
    return coverImage.tmp.url
  } else if (useGif && isGif(coverImage.original.url)) {
    return coverImage.original.url
  }
  return coverImage[coverDPI] ? coverImage[coverDPI].url : null
}

export default class BackgroundImage extends Component {
  static propTypes = {
    className: PropTypes.string,
    // to: PropTypes.string,
  }

  static defaultProps = {
    coverDPI: 'xhdpi',
    useGif: false,
  }

  componentWillMount() {
    this.state = {
      status: STATUS.REQUEST,
    }
  }

  componentWillReceiveProps(nextProps) {
    const thisSource = getSource(this.props)
    const nextSource = getSource(nextProps)
    if (thisSource !== nextSource) {
      this.setState({
        status: nextSource ? STATUS.REQUEST : STATUS.PENDING,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  render() {
    const { className } = this.props
    const { status } = this.state
    return (
      <div className={classNames('BackgroundImage', status, className)}>
        <ImageAsset
          className="BackgroundImageAsset"
          isBackgroundImage
          onLoadFailure={this.onLoadFailure}
          onLoadSuccess={this.onLoadSuccess}
          src={getSource(this.props)}
        />
      </div>
    )
  }
}

    // return to ?
    //   <Link to={to} className={classList, isLink}>
    //     <ImageAsset {...imageProps} />
    //   </Link> :
    //   <span className={classList}>
    //     <ImageAsset {...imageProps} />
    //   </span>

