import React, { PropTypes, PureComponent } from 'react'

export default class ImageAsset extends PureComponent {

  static propTypes = {
    onLoadSuccess: PropTypes.func,
    onLoadFailure: PropTypes.func,
    src: PropTypes.string,
    srcSet: PropTypes.string,
  }

  static defaultProps = {
    onLoadSuccess: null,
    onLoadFailure: null,
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
  }

  componentWillUnmount() {
    this.disposeLoader()
  }

  onLoadSuccess = () => {
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
    if (elementProps.isBackgroundImage) {
      const style = elementProps.src ? { backgroundImage: `url(${elementProps.src})` } : null
      delete elementProps.src
      delete elementProps.isBackgroundImage
      return (
        <figure {...elementProps} style={style} />
      )
    }
    return (
      <img alt="" {...elementProps} />
    )
  }
}

