// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { is } from 'immutable'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from 'ello-brains/constants/action_types'
import { FOOTER_LINKS as links } from 'ello-brains/constants/locales/en'
import { FORM_CONTROL_STATUS as STATUS } from 'ello-brains/constants/status_types'
import { selectIsLoggedIn } from 'ello-brains/selectors/authentication'
import {
  selectIsGridMode,
  selectIsLayoutToolHidden,
  selectIsMobile,
} from 'ello-brains/selectors/gui'
import { selectAvailability } from 'ello-brains/selectors/profile'
import { selectPathname, selectViewNameFromRoute } from 'ello-brains/selectors/routing'
import { selectStreamType } from 'ello-brains/selectors/stream'
import { trackEvent } from 'ello-brains/actions/analytics'
import { checkAvailability, resetAvailability } from 'ello-brains/actions/profile'
import { isIOS, scrollToPosition } from '../lib/jello'
import { selectIsModalActive } from '../selectors/modal'
import { getEmailStateFromClient, getEmailStateFromServer } from '../components/forms/Validators'
import { Footer } from '../components/footer/FooterRenderables'
import type { Availability } from '../types/flowtypes'

let emailValue = ''

type Props = {
  availability: Availability,
  dispatch: () => void,
  formActionPath: string,
  isEditorial: boolean,
  isGridMode: boolean,
  isLayoutToolHidden: boolean,
  isLoggedIn: boolean,
  isMobile: boolean,
  isModalActive: boolean,
  isPaginatoring: boolean,
  pathname: string,
}

type State = {
  emailStatus: string,
  formMessage: string,
  formStatus: string,
  isFormDisabled: boolean,
  isFormFocused: boolean,
}

function mapStateToProps(state, props) {
  const streamType = selectStreamType(state)
  const pathname = selectPathname(state)
  const isEditorial = selectViewNameFromRoute(state, props) === 'editorial'
  let isLayoutToolHidden = selectIsLayoutToolHidden(state, props)
  // hide the layout tool on the editorial homepage
  if (isEditorial) { isLayoutToolHidden = true }
  return {
    availability: selectAvailability(state),
    formActionPath: checkAvailability().payload.endpoint.path,
    isEditorial,
    isGridMode: selectIsGridMode(state),
    isLayoutToolHidden,
    isLoggedIn: selectIsLoggedIn(state),
    isMobile: selectIsMobile(state),
    isModalActive: selectIsModalActive(state),
    isPaginatoring: streamType === LOAD_NEXT_CONTENT_REQUEST,
    pathname,
  }
}

class FooterContainer extends Component {
  props: Props
  state: State

  static childContextTypes = {
    onClickScrollToTop: PropTypes.func.isRequired,
    onClickToggleLayoutMode: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
      onBlur: !isLoggedIn ? this.onBlur : null,
      onChange: !isLoggedIn ? this.onChange : null,
      onFocus: !isLoggedIn ? this.onFocus : null,
      onSubmit: !isLoggedIn ? this.onSubmit : null,
    }
  }

  componentWillMount() {
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
      formMessage: '',
      formStatus: STATUS.INDETERMINATE,
      isFormDisabled: true,
      isFormFocused: false,
    }
    emailValue = ''
  }

  componentWillReceiveProps(nextProps) {
    const { availability, isModalActive } = nextProps
    if (!availability || isModalActive) { return }
    if (availability.has('email')) {
      this.validateEmailResponse(availability)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isLoggedIn } = this.props
    return !is(nextProps.availability, this.props.availability) ||
      ['isGridMode', 'isLayoutToolHidden', 'isLoggedIn', 'isMobile', 'isPaginatoring'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      (!isLoggedIn && ['emailStatus', 'formMessage', 'formStatus', 'isFormDisabled', 'isFormFocused'].some(prop =>
        nextState[prop] !== this.state[prop],
      ))
  }

  onChange = ({ FooterEmailInput: email }) => {
    emailValue = email
    const { emailStatus, isFormDisabled, formStatus } = this.state
    const currentStatus = emailStatus
    const clientState = getEmailStateFromClient({ value: email, currentStatus })
    if (formStatus !== STATUS.INDETERMINATE) {
      this.setState({ formStatus: STATUS.INDETERMINATE, formMessage: '' })
    }
    if (clientState.status === STATUS.SUCCESS && isFormDisabled) {
      this.setState({ emailStatus: STATUS.SUCCESS, isFormDisabled: false })
      return
    }
    if (currentStatus !== clientState.status) {
      this.setState({
        emailStatus: clientState.status,
        isFormDisabled: true,
      })
    }
  }

  // Only happens on iOS
  onBlur = () => {
    this.setState({ isFormFocused: false })
    if (isIOS() && document && document.body) {
      document.body.classList.remove('isModalActive')
    }
  }

  // Only happens on iOS
  onFocus = () => {
    if (isIOS() && document && document.body) {
      document.body.classList.add('isModalActive')
    }
    this.setState({ isFormFocused: true })
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
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(checkAvailability({ email: emailValue, is_signup: true }))
  }

  validateEmailResponse(availability) {
    // only validate if we are in the footer input
    if (!get(document, 'activeElement.classList', { contains: () => false }).contains('inFooter')) { return }
    const { dispatch, pathname } = this.props
    const { formStatus } = this.state
    const newState = getEmailStateFromServer({ availability, currentStatus: formStatus })
    if (newState.status === STATUS.SUCCESS) {
      this.setState({ formStatus: STATUS.SUCCESS, formMessage: 'Subscribed. See you tomorrow' })
      dispatch(trackEvent('Newsletter_signup_footer', { pathname }))
      dispatch(resetAvailability())
      setTimeout(() => {
        const el = document.getElementById('FooterEmailInput')
        // $FlowFixMe
        if (el) { el.value = '' }
        emailValue = ''
        this.setState({
          emailStatus: STATUS.INDETERMINATE,
          formMessage: '',
          formStatus: STATUS.INDETERMINATE,
          isFormDisabled: true,
          isFormFocused: false,
        })
      }, 1666)
    } else {
      this.setState({ formStatus: newState.status, formMessage: newState.message })
    }
  }

  render() {
    const props = {
      formActionPath: this.props.formActionPath,
      formMessage: this.state.formMessage,
      formStatus: this.state.formStatus,
      isEditorial: this.props.isEditorial,
      isFormDisabled: this.state.isFormDisabled,
      isFormFocused: this.state.isFormFocused,
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

