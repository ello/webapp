import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import debounce from 'lodash/debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { checkAvailability, signUpUser } from '../../actions/profile'
import FormButton from './FormButton'
import PasswordControl from './PasswordControl'
import UsernameControl from './UsernameControl'
import {
  isFormValid,
  getUsernameStateFromClient,
  getUsernameStateFromServer,
  getPasswordState,
} from './Validators'
import { selectAvailability } from '../../selectors/profile'
import { signupPath } from '../../networking/api'

function renderStatus(state) {
  return () => {
    if (state.status === STATUS.FAILURE) {
      return <p className="FormControlStatusMessage">{state.message}</p>
    }
    return ''
  }
}

function mapStateToProps(state) {
  return {
    availability: selectAvailability(state),
  }
}

class JoinForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    invitationCode: PropTypes.string,
  }

  static defaultProps = {
    invitationCode: null,
  }

  componentWillMount() {
    this.state = {
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      showPasswordError: false,
      showUsernameError: false,
      usernameState: { status: STATUS.INDETERMINATE, suggestions: null, message: '' },
    }

    this.usernameValue = ''
    this.passwordValue = ''

    this.checkServerForAvailability = debounce(this.checkServerForAvailability, 300)
    this.delayedShowUsernameError = debounce(this.delayedShowUsernameError, 1000)
    this.delayedShowPasswordError = debounce(this.delayedShowPasswordError, 1000)
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (!availability) { return }
    if (availability.get('username')) {
      this.validateUsernameResponse(availability)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
    const { email, dispatch, invitationCode } = this.props
    dispatch(
      signUpUser(email, this.usernameValue, this.passwordValue, invitationCode),
    )
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
    const { passwordState, showPasswordError, showUsernameError, usernameState } = this.state
    const isValid = isFormValid([usernameState, passwordState])
    const domain = ENV.AUTH_DOMAIN
    return (
      <div className="JoinForm">
        <form
          action={signupPath().path}
          className="AuthenticationForm"
          id="RegistrationForm"
          method="POST"
          noValidate="novalidate"
          onSubmit={this.onSubmit}
          role="form"
        >
          <UsernameControl
            autoFocus
            classList="isSimpleWhiteControl"
            label="Username"
            onChange={this.onChangeUsernameControl}
            placeholder="Username"
            status={usernameState.status}
            renderStatus={showUsernameError ? renderStatus(usernameState) : null}
            suggestions={usernameState.suggestions}
            tabIndex="1"
          />
          <PasswordControl
            classList="isSimpleWhiteControl"
            label="Password"
            onChange={this.onChangePasswordControl}
            placeholder="Password"
            status={passwordState.status}
            renderStatus={showPasswordError ? renderStatus(passwordState) : null}
            tabIndex="2"
          />
          <FormButton className="FormButton isRounded isGreen" disabled={!isValid} tabIndex="2">
            Discover Ello
          </FormButton>
        </form>
        <p className="AuthenticationTermsCopy">
          By continuing you are agreeing to our <a href={`${domain}/wtf/post/policies`}>Terms</a>.
        </p>
      </div>
    )
  }
}

export default connect(mapStateToProps)(JoinForm)

