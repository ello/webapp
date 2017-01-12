import React, { PropTypes, PureComponent } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { getSource } from './BackgroundImage'
import ImageAsset from './ImageAsset'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

export default class Avatar extends PureComponent {
  static propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    priority: PropTypes.string,
    size: PropTypes.string,
    to: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
  }

  static defaultProps = {
    alt: null,
    className: '',
    onClick: null,
    priority: null,
    size: 'regular',
    to: null,
    userId: null,
    username: null,
  }

  componentWillMount() {
    this.state = {
      status: getSource({ ...this.props, dpi: this.props.size }) ? STATUS.REQUEST : STATUS.PENDING,
    }
  }

  componentWillReceiveProps(nextProps) {
    const thisSource = getSource({ ...this.props, dpi: this.props.size })
    const nextSource = getSource({ ...nextProps, dpi: nextProps.size })
    if (thisSource !== nextSource) {
      this.setState({
        status: nextSource ? STATUS.REQUEST : STATUS.PENDING,
      })
    }
  }

  onLoadSuccess = () => {
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  render() {
    const { alt, className, onClick, priority, to, userId, username } = this.props
    const { status } = this.state
    const wrapperProps = {
      className: classNames('Avatar', className, status),
      'data-priority': priority || 'inactive',
      'data-userid': userId,
      'data-username': username,
      draggable: (username && username.length > 1) || (priority && priority.length),
    }
    const imageProps = {
      alt: alt || username,
      className: 'AvatarImage',
      src: getSource({ ...this.props, dpi: this.props.size }),
      onLoadFailure: this.onLoadFailure,
      onLoadSuccess: this.onLoadSuccess,
    }

    if (to) {
      return (
        <Link {...wrapperProps} to={to} >
          <ImageAsset {...imageProps} />
        </Link>
      )
    } else if (onClick) {
      return (
        <button {...wrapperProps} onClick={onClick} >
          <ImageAsset {...imageProps} />
        </button>
      )
    }
    return (
      <span {...wrapperProps} >
        <ImageAsset {...imageProps} />
      </span>
    )
  }
}

