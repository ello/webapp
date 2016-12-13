import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import ImageAsset from '../assets/ImageAsset'
import { isGif } from '../../helpers/file_helper'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export function getSource(props) {
  const { dpi, sources, useGif } = props
  if (!sources) {
    return ''
  } else if (sources.getIn(['tmp', 'url'])) {
    return sources.getIn(['tmp', 'url'])
  } else if (useGif && isGif(sources.getIn(['original', 'url']))) {
    return sources.getIn(['original', 'url'])
  }
  return sources.getIn([dpi, 'url'], null)
}

export default class BackgroundImage extends Component {
  static propTypes = {
    className: PropTypes.string,
    to: PropTypes.string,
  }

  static defaultProps = {
    dpi: 'xhdpi',
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

  shouldComponentUpdate() {
    return true
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  render() {
    const { className, to } = this.props
    const { status } = this.state
    const classList = classNames('BackgroundImage', status, className)
    const imageAssetProps = {
      className: 'BackgroundImageAsset',
      isBackgroundImage: true,
      onLoadFailure: this.onLoadFailure,
      onLoadSuccess: this.onLoadSuccess,
      src: getSource(this.props),
    }
    return to ?
      <Link className={classNames(classList, 'isLink')} to={to}>
        <ImageAsset {...imageAssetProps} />
      </Link> :
      <div className={classList}>
        <ImageAsset {...imageAssetProps} />
      </div>
  }
}

