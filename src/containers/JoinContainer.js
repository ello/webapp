import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { selectParamsInvitationCode } from '../selectors/params'
import { selectAvailability, selectEmail } from '../selectors/profile'
import { getInviteEmail } from '../actions/invitations'
import { checkAvailability, signUpUser } from '../actions/profile'
import Join from '../components/views/Join'
import {
  isFormValid,
  getUsernameStateFromClient,
  getUsernameStateFromServer,
  getInvitationCodeStateFromServer,
  getEmailStateFromServer,
  getPasswordState,
} from '../components/forms/Validators'

function renderStatus(state) {
  return () => {
    if (state.status === STATUS.FAILURE) {
      return <p className="FormControlStatusMessage">{state.message}</p>
    }
    return ''
  }
}

function mapStateToProps(state, props) {
  return {
    availability: selectAvailability(state),
    email: selectEmail(state),
    invitationCode: selectParamsInvitationCode(state, props),
  }
}

class JoinContainer extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    email: PropTypes.string,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func,
  }

  getChildContext() {
    return {
      nextLabel: 'Discover Ello',
      onNextClick: this.onSubmit,
    }
  }

  componentWillMount() {
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      invitationCodeState: { status: STATUS.INDETERMINATE, message: '' },
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      showPasswordError: false,
      showUsernameError: false,
      usernameState: { status: STATUS.INDETERMINATE, suggestions: null, message: '' },
    }

    this.emailValue = ''
    this.usernameValue = ''
    this.passwordValue = ''

    this.checkServerForAvailability = debounce(this.checkServerForAvailability, 300)
    this.delayedShowUsernameError = debounce(this.delayedShowUsernameError, 1000)
    this.delayedShowPasswordError = debounce(this.delayedShowPasswordError, 1000)
    this.checkForInviteCode(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.checkForInviteCode(nextProps)
    const { availability } = nextProps
    if (!availability) { return }
    if (availability.get('username')) {
      this.validateUsernameResponse(availability)
    }
    if (availability.get('email')) {
      this.validateEmailResponse(availability)
    }
    if (availability.get('invitationCode')) {
      this.validateInvitationCodeResponse(availability)
    }
  }

  onChangeUsernameControl = ({ username }) => {
    this.setState({ showUsernameError: false })
    this.delayedShowUsernameError()
    this.usernameValue = username
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const currentMessage = usernameState.message
    const clientState = getUsernameStateFromClient({ value: username, currentStatus })

    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ usernameState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateUsernameResponse` after fetching
      this.checkServerForAvailability({ username })
      return
    }
    if (clientState.status !== currentStatus && clientState.message !== currentMessage) {
      this.setState({ usernameState: clientState })
    }
  }

  onChangePasswordControl = ({ password }) => {
    this.setState({ showPasswordError: false })
    this.delayedShowPasswordError()
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(
      signUpUser(this.emailValue, this.usernameValue, this.passwordValue, this.invitationCodeValue),
    )
  }

  checkForInviteCode(props) {
    const { dispatch, email, invitationCode } = props
    if (invitationCode) {
      this.invitationCodeValue = invitationCode
    }
    if (invitationCode && !email) {
      dispatch(getInviteEmail(invitationCode))
    } else if (email) {
      this.emailValue = email
      requestAnimationFrame(() => {
        this.setState({ emailState: { status: STATUS.SUCCESS } })
      })
    }
  }

  checkServerForAvailability(vo) {
    this.props.dispatch(checkAvailability(vo))
  }

  validateUsernameResponse(availability) {
    if (!this.usernameValue.length) {
      this.setState({
        usernameState: { message: '', status: STATUS.INDETERMINATE, suggestions: null },
      })
      return
    }
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const newState = getUsernameStateFromServer({ availability, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ usernameState: newState })
    }
  }

  validateEmailResponse(availability) {
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromServer({ availability, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  validateInvitationCodeResponse(availability) {
    const { invitationCodeState } = this.state
    const currentStatus = invitationCodeState.status
    const newState = getInvitationCodeStateFromServer({ availability, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ invitationCodeState: newState })
    }
  }

  delayedShowPasswordError = () => {
    if (this.passwordValue.length) {
      this.setState({ showPasswordError: true })
    }
  }

  delayedShowUsernameError = () => {
    if (this.usernameValue.length) {
      this.setState({ showUsernameError: true })
    }
  }

  render() {
    const { emailState, passwordState, showPasswordError,
      showUsernameError, usernameState } = this.state
    const { email } = this.props
    const isValid = isFormValid([emailState, usernameState, passwordState])
    return (
      <Join
        email={email}
        isValid={isValid}
        onChangePasswordControl={this.onChangePasswordControl}
        onChangeUsernameControl={this.onChangeUsernameControl}
        onSubmit={this.onSubmit}
        passwordRenderStatus={showPasswordError ? renderStatus(passwordState) : null}
        passwordStatus={passwordState.status}
        usernameRenderStatus={showUsernameError ? renderStatus(usernameState) : null}
        usernameStatus={usernameState.status}
        usernameSuggestions={usernameState.suggestions}
      />
    )
  }
}

export default connect(mapStateToProps)(JoinContainer)

