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

export default class Cover extends Component {
  static propTypes = {
    modifiers: PropTypes.string,
  }

  static defaultProps = {
    coverDPI: 'xhdpi',
    modifiers: '',
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
    const { modifiers } = this.props
    const { status } = this.state
    return (
      <div className={classNames('Cover', status, modifiers)}>
        <ImageAsset
          className="CoverImage"
          isBackgroundImage
          onLoadFailure={this.onLoadFailure}
          onLoadSuccess={this.onLoadSuccess}
          src={getSource(this.props)}
        />
      </div>
    )
  }
}

