// @flow
import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { scrollToPosition } from '../lib/jello'
import { FOOTER_LINKS as links } from '../constants/locales/en'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectIsGridMode, selectIsLayoutToolHidden, selectIsMobile } from '../selectors/gui'
import { selectStreamType } from '../selectors/stream'
import { checkAvailability } from '../actions/profile'
import { getEmailStateFromClient } from '../components/forms/Validators'
import { Footer } from '../components/footer/FooterRenderables'

let emailValue = ''

type Props = {
  dispatch: () => void,
  isGridMode: boolean,
  isLayoutToolHidden: boolean,
  isLoggedIn: boolean,
  isMobile: boolean,
  isPaginatoring: boolean,
}

type State = {
  emailStatus: string,
  formMessage: string,
  formStatus: string,
  isFormDisabled: boolean,
}

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
  static childContextTypes = {
    onClickScrollToTop: PropTypes.func.isRequired,
    onClickToggleLayoutMode: PropTypes.func.isRequired,
    onChangeEmailControl: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  props: Props // eslint-disable-line
  state: State

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
      onChangeEmailControl: !isLoggedIn ? this.onChangeEmailControl : null,
      onSubmit: !isLoggedIn ? this.onSubmit : null,
    }
  }

  componentWillMount() {
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
      formMessage: '',
      formStatus: STATUS.INDETERMINATE,
      isFormDisabled: true,
    }
    emailValue = ''
  }

  onChangeEmailControl = ({ email }) => {
    emailValue = email
    const { emailStatus, isFormDisabled } = this.state
    const currentStatus = emailStatus
    const clientState = getEmailStateFromClient({ value: email, currentStatus })
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
    // TODO: Use the correct action here...
    dispatch(checkAvailability({ email: emailValue, is_signup: true }))
    // this.setState({
    //   formMessage: RESPONSE
    //   formStatus: STATUS.FAILURE | STATUS.SUCCESS
    // })
  }

  render() {
    const props = {
      // TODO: Need to define the actual action path..
      formActionPath: '/daily-email-signup',
      formMessage: this.state.formMessage,
      formStatus: this.state.formStatus,
      isFormDisabled: this.state.isFormDisabled,
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

