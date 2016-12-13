import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Mousetrap from 'mousetrap'
import { SET_LAYOUT_MODE } from '../constants/action_types'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDiscoverKeyType, selectIsGridMode } from '../selectors/gui'
import { selectIsModalActive } from '../selectors/modal'
import { openModal, closeModal } from '../actions/modals'
import HelpDialog from '../components/dialogs/HelpDialog'

function mapStateToProps(state) {
  return {
    discoverKeyType: selectDiscoverKeyType(state),
    isGridMode: selectIsGridMode(state),
    isLoggedIn: selectIsLoggedIn(state),
    isModalActive: selectIsModalActive(state),
  }
}

class KeyboardContainer extends Component {
  static propTypes = {
    discoverKeyType: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isModalActive: PropTypes.bool,
    shortcuts: PropTypes.object.isRequired,
  }

  static defaultProps = {
    shortcuts: {
      [SHORTCUT_KEYS.SEARCH]: '/search',
      [SHORTCUT_KEYS.DISCOVER]: '/discover',
      [SHORTCUT_KEYS.FOLLOWING]: '/following',
      [SHORTCUT_KEYS.STARRED]: '/starred',
      [SHORTCUT_KEYS.NOTIFICATIONS]: '/notifications',
    },
  }

  componentDidMount() {
    this.bindMousetrap()
    Mousetrap.bind(SHORTCUT_KEYS.TOGGLE_LAYOUT, () => {
      const { dispatch, isGridMode } = this.props
      const newMode = isGridMode ? 'list' : 'grid'
      dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
    })
  }

  shouldComponentUpdate() {
    return true
  }

  componentDidUpdate() {
    this.bindMousetrap()
  }

  componentWillUnmount() {
    this.unbindMousetrap()
    Mousetrap.unbind(SHORTCUT_KEYS.TOGGLE_LAYOUT)
  }

  bindMousetrap() {
    const { isLoggedIn, shortcuts, dispatch } = this.props
    if (isLoggedIn && !this.mousetrapBound) {
      this.mousetrapBound = true

      Mousetrap.bind(Object.keys(shortcuts), (event, shortcut) => {
        if (shortcut === SHORTCUT_KEYS.DISCOVER) {
          const { discoverKeyType } = this.props
          const location = discoverKeyType ? `/discover/${discoverKeyType}` : '/discover'
          dispatch(push(location))
        } else {
          dispatch(push(shortcuts[shortcut]))
        }
      })

      Mousetrap.bind(SHORTCUT_KEYS.HELP, () => {
        const { isModalActive } = this.props
        if (isModalActive) {
          dispatch(closeModal())
          return
        }
        dispatch(openModal(<HelpDialog />))
      })
    }
  }

  unbindMousetrap() {
    const { isLoggedIn, shortcuts } = this.props
    if (isLoggedIn && this.mousetrapBound) {
      this.mousetrapBound = false
      Mousetrap.unbind(Object.keys(shortcuts))
      Mousetrap.unbind(SHORTCUT_KEYS.HELP)
    }
  }

  render() {
    return null
  }

}

export default connect(mapStateToProps)(KeyboardContainer)

