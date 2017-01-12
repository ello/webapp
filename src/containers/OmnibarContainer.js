import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { selectAvatar } from '../selectors/profile'
import { closeOmnibar } from '../actions/omnibar'
import { Omnibar } from '../components/omnibar/Omnibar'

export function mapStateToProps(state) {
  return {
    avatar: selectAvatar(state),
    classList: state.omnibar.get('classList'),
    isActive: state.omnibar.get('isActive'),
  }
}

class OmnibarContainer extends PureComponent {
  static propTypes = {
    avatar: PropTypes.object,
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    avatar: null,
    classList: null,
  }

  componentWillMount() {
    this.state = {
      isFullScreen: false,
    }
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.FULLSCREEN, () => { this.onToggleFullScreen() })
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

