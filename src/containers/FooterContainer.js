// @flow
import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsGridMode, selectIsLayoutToolHidden, selectIsMobile } from '../selectors/gui'
import { selectStreamType } from '../selectors/stream'
import { scrollToPosition } from '../lib/jello'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { Footer } from '../components/footer/FooterRenderables'

const links = [
  { label: 'About', to: 'https://ello.co/wtf' },
  { label: 'Help', to: 'https://ello.co/wtf' },
  { label: 'Blog', to: 'https://ello.co/wtf' },
  { label: 'Shop', to: 'https://ello.co/wtf' },
  { label: 'Apps', to: 'https://ello.co/resources/mobile-features/' },
  { label: 'Jobs', to: 'https://ello.co/wtf' },
  { label: 'Terms', to: 'https://ello.co/wtf' },
  { label: 'Privacy', to: 'https://ello.co/wtf' },
]

function mapStateToProps(state, props) {
  const streamType = selectStreamType(state)
  return {
    isGridMode: selectIsGridMode(state),
    isLayoutToolHidden: selectIsLayoutToolHidden(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isMobile: selectIsMobile(state),
    isPaginatoring: streamType === LOAD_NEXT_CONTENT_REQUEST,
  }
}

type Props = {
  dispatch: () => void,
  isGridMode: boolean,
  isLayoutToolHidden: boolean,
  isLoggedIn: boolean,
  isMobile: boolean,
  isPaginatoring: boolean,
}

class FooterContainer extends PureComponent {
  static childContextTypes = {
    onClickScrollToTop: PropTypes.func.isRequired,
    onClickToggleLayoutMode: PropTypes.func.isRequired,
    onChangeEmailControl: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
      onChangeEmailControl: !isLoggedIn ? this.onChangeEmailControl : null,
      onSubmit: !isLoggedIn ? this.onSubmit : null,
    }
  }

  onChangeEmailControl = ({ email }) => {
    // console.log(email)
    const em = email
    return em
  }

  onClickScrollToTop = () => {
    scrollToPosition(0, 0)
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  onSubmit = (e: Event) => {
    e.preventDefault()
    // console.log('submit some stuff')
  }

  props: Props
  render() {
    const props = {
      formActionPath: '/daily-email-signup', // TODO: Need to define the actual action path..
      isFormDisabled: true,
      isGridMode: this.props.isGridMode,
      isLayoutToolHidden: this.props.isLayoutToolHidden,
      isLoggedIn: this.props.isLoggedIn,
      isMobile: this.props.isMobile,
      isPaginatoring: this.props.isPaginatoring,
      links,
    }
    return <Footer {...props} />
  }
}

export default connect(mapStateToProps)(FooterContainer)

