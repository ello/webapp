import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import Mousetrap from 'mousetrap'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { closeModal, closeAlert } from '../actions/modals'
import { Modal } from '../components/modals/Modal'

export function mapStateToProps(state) {
  return {
    classList: state.getIn(['modal', 'classList']),
    component: state.getIn(['modal', 'component']),
    isActive: state.getIn(['modal', 'isActive']),
    kind: state.getIn(['modal', 'kind']),
  }
}

class ModalContainer extends Component {
  static propTypes = {
    classList: PropTypes.string,
    component: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    kind: PropTypes.string.isRequired,
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    const { isActive, kind } = this.props
    if (kind === 'Modal' && isActive) {
      document.body.classList.add('isModalActive')
    } else if (kind === 'Modal' && !isActive) {
      document.body.classList.remove('isModalActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  }

  onClickModal = (e) => {
    const classList = e.target.classList
    if (classList.contains('Modal') ||
        classList.contains('Alert') ||
        classList.contains('CloseModal')) {
      this.close()
    }
  }

  close() {
    const { dispatch, isActive, kind } = this.props
    if (isActive) {
      dispatch(kind === 'Modal' ? closeModal() : closeAlert())
    }
  }

  render() {
    const { isActive, classList, component, kind } = this.props
    const elementProps = { classList, component, isActive, kind }
    if (isActive) {
      elementProps.onClickModal = this.onClickModal
    }
    return <Modal {...elementProps} />
  }
}

export default connect(mapStateToProps)(ModalContainer)

