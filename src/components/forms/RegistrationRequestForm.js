import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { requestInvite } from '../../actions/profile'
import FormButton from '../forms/FormButton'
import EmailControl from '../forms/EmailControl'
import { isFormValid, getEmailStateFromClient } from '../forms/Validators'

class RegistrationRequestForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      formStatus: STATUS.INDETERMINATE,
      emailState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.emailValue = ''
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (availability && availability.hasOwnProperty('email')) {
      this.onValidateEmailResponse(availability)
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(requestInvite(this.emailValue))
    this.setState({ formStatus: STATUS.SUBMITTED })
  }

  onChangeEmailControl = ({ email }) => {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  renderSubmitted() {
    return (
      <div className="RegistrationSuccess">
        Rad.<br />
        You're almost there.<br />
        Check your email to join Ello.
      </div>
    )
  }

  renderForm() {
    const { emailState } = this.state
    const isValid = isFormValid([emailState])
    return (
      <div>
        <h1>
          Create. Share. Connect.
        </h1>
        <form
          className="AuthenticationForm"
          id="RegistrationRequestForm"
          noValidate="novalidate"
          onSubmit={ this.onSubmit }
          role="form"
        >
          <EmailControl
            classList="asBoxControl"
            onChange={ this.onChangeEmailControl }
            tabIndex="1"
          />
          { emailState.status !== STATUS.INDETERMINATE && <p>{emailState.message}</p>}
          <FormButton disabled={ !isValid } tabIndex="2">Sign up</FormButton>
        </form>
      </div>
    )
  }

  render() {
    const { formStatus } = this.state
    return formStatus === STATUS.SUBMITTED ? this.renderSubmitted() : this.renderForm()
  }
}

export default connect()(RegistrationRequestForm)

