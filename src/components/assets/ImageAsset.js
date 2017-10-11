import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { css, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

const backgroundStyle = css(
  s.absolute,
  s.flood,
  {
    background: 'transparent no-repeat 50% 50%',
    backgroundSize: 'cover',
    transition: 'opacity 0.4s ease',
  },
  parent('isRequesting >', s.opacity0),
)

export default class ImageAsset extends PureComponent {

  static propTypes = {
    onLoadSuccess: PropTypes.func,
    onLoadFailure: PropTypes.func,
    isPostDetail: PropTypes.bool,
    screenDimensions: PropTypes.func,
    src: PropTypes.string,
    srcSet: PropTypes.string,
  }

  static defaultProps = {
    onLoadSuccess: null,
    onLoadFailure: null,
    isPostDetail: false,
    screenDimensions: null,
    src: null,
    srcSet: null,
  }

  componentDidMount() {
    this.createLoader()
  }

  componentDidUpdate(prevProps) {
    if (!this.img && prevProps.src !== this.props.src) {
      this.createLoader()
    }
    this.setScreenDimensions()
  }

  componentWillUnmount() {
    this.disposeLoader()
  }

  onLoadSuccess = () => {
    this.setScreenDimensions()

    if (typeof this.props.onLoadSuccess === 'function') {
      this.props.onLoadSuccess(this.img)
    }
    this.disposeLoader()
  }

  onLoadFailure = () => {
    this.disposeLoader()
    if (typeof this.props.onLoadFailure === 'function') {
      this.props.onLoadFailure()
    }
  }

  setScreenDimensions = () => {
    const { isPostDetail } = this.props

    if (isPostDetail) {
      const screenDimensions = {
        width: this.imgOnScreen.clientWidth,
        height: this.imgOnScreen.clientHeight,
      }
      this.props.screenDimensions(screenDimensions)
    }
  }

  createLoader() {
    this.disposeLoader()
    const { src, srcSet } = this.props
    const hasSource = !!((src && src.length) || (srcSet && srcSet.length))
    if (!hasSource) { return }
    this.img = new Image()
    this.img.onload = this.onLoadSuccess
    this.img.onerror = this.onLoadFailure
    if (srcSet) {
      this.img.srcset = srcSet
    }
    this.img.src = src
  }

  disposeLoader() {
    if (!this.img) { return }
    this.img.onload = null
    this.img.onerror = null
    this.img = null
  }

  render() {
    const elementProps = { ...this.props }
    delete elementProps.onLoadFailure
    delete elementProps.onLoadSuccess
    delete elementProps.isPostDetail
    delete elementProps.screenDimensions
    if (elementProps.isBackgroundImage) {
      const style = elementProps.src ? { backgroundImage: `url(${elementProps.src})` } : null
      delete elementProps.src
      delete elementProps.isBackgroundImage
      return (
        <figure {...elementProps} className={backgroundStyle} style={style} />
      )
    }
    return (
      <img
        alt=""
        {...elementProps}
        ref={(imgOnScreen) => { this.imgOnScreen = imgOnScreen }}
      />
    )
  }
}

