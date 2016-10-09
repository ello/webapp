import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { selectIsGridMode, selectIsLayoutToolHidden } from '../selectors/gui'
import { selectStreamType } from '../selectors/stream'
import { scrollTo } from '../lib/jello'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { Footer } from '../components/footer/Footer'

function mapStateToProps(state, props) {
  const streamType = selectStreamType(state)
  return {
    isGridMode: selectIsGridMode(state),
    isLayoutToolHidden: selectIsLayoutToolHidden(state, props),
    isPaginatoring: streamType === LOAD_NEXT_CONTENT_REQUEST,
  }
}

class FooterContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLayoutToolHidden: PropTypes.bool.isRequired,
    isPaginatoring: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickScrollToTop = () => {
    scrollTo(0, 0)
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  render() {
    const { isLayoutToolHidden, isGridMode, isPaginatoring } = this.props
    const props = {
      isLayoutToolHidden,
      isGridMode,
      isPaginatoring,
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
    }
    return <Footer {...props} />
  }
}

export default connect(mapStateToProps)(FooterContainer)

