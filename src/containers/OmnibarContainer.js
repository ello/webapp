import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import Mousetrap from 'mousetrap'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { selectAvatar } from '../selectors/profile'
import { closeOmnibar } from '../actions/omnibar'
import { Omnibar } from '../components/omnibar/Omnibar'

export function mapStateToProps(state) {
  return {
    avatar: selectAvatar(state),
    classList: state.getIn(['omnibar', 'classList']),
    isActive: state.getIn(['omnibar', 'isActive']),
  }
}

class OmnibarContainer extends Component {
  static propTypes = {
    avatar: PropTypes.object,
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
  }

  componentWillMount() {
    this.state = {
      isFullScreen: false,
    }
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.FULLSCREEN, () => { this.onToggleFullScreen() })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isFullScreen !== nextState.isFullScreen) {
      return true
    }
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    const { isActive } = this.props
    if (isActive) {
      document.body.classList.add('isOmnibarActive')
    } else if (!isActive) {
      document.body.classList.remove('isOmnibarActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.FULLSCREEN)
  }

  onToggleFullScreen = () => {
    const { isFullScreen } = this.state
    this.setState({ isFullScreen: !isFullScreen })
  }

  onClickCloseOmnibar = () => {
    const { isActive, dispatch } = this.props
    if (isActive) {
      dispatch(closeOmnibar())
    }
  }

  render() {
    const { avatar, classList, isActive } = this.props
    const { isFullScreen } = this.state
    const elementProps = { avatar, classList, isActive, isFullScreen }
    return <Omnibar {...elementProps} onClickCloseOmnibar={this.onClickCloseOmnibar} />
  }
}

export default connect(mapStateToProps)(OmnibarContainer)

