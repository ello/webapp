import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsGridMode, selectIsLayoutToolHidden, selectIsMobile } from '../selectors/gui'
import { selectStreamType } from '../selectors/stream'
import { scrollToPosition } from '../lib/jello'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { Footer } from '../components/footer/FooterRenderables'

const links = [
  { label: 'About', to: `${ENV.AUTH_DOMAIN}/wtf` },
  { label: 'Help', to: `${ENV.AUTH_DOMAIN}/wtf` },
  { label: 'Blog', to: `${ENV.AUTH_DOMAIN}/wtf` },
  { label: 'Shop', to: `${ENV.AUTH_DOMAIN}/wtf` },
  { label: 'Apps', to: `${ENV.AUTH_DOMAIN}/resources/mobile-features/` },
  { label: 'Jobs', to: `${ENV.AUTH_DOMAIN}/wtf` },
  { label: 'Terms', to: `${ENV.AUTH_DOMAIN}/wtf` },
  { label: 'Privacy', to: `${ENV.AUTH_DOMAIN}/wtf` },
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

class FooterContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLayoutToolHidden: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isPaginatoring: PropTypes.bool.isRequired,
  }

  static childContextTypes = {
    onClickScrollToTop: PropTypes.func.isRequired,
    onClickToggleLayoutMode: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
    }
  }

  onClickScrollToTop = () => {
    scrollToPosition(0, 0)
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

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

