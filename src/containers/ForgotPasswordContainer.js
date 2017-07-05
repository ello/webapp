import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from 'ello-brains/constants/status_types'
import { sendForgotPasswordRequest } from 'ello-brains/actions/authentication'
import { isAndroid } from '../lib/jello'
import { isFormValid, getEmailStateFromClient } from '../components/forms/Validators'
import { ForgotPassword } from '../components/views/ForgotPassword'

class ForgotPasswordContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      formStatus: STATUS.INDETERMINATE,
    }
    this.emailValue = ''
  }

  onChangeControl = ({ email }) => {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: this.emailValue, currentStatus })
    if (newState.status === STATUS.SUCCESS) {
      dispatch(sendForgotPasswordRequest(this.emailValue))
      this.setState({ formStatus: STATUS.SUBMITTED })
    } else if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  render() {
    const { emailState, formStatus } = this.state
    return (
      <ForgotPassword
        emailState={emailState}
        isSubmitted={formStatus === STATUS.SUBMITTED}
        isFormValid={isFormValid([emailState])}
        onBlur={isAndroid() ? () => document.body.classList.remove('isCreditsHidden') : null}
        onFocus={isAndroid() ? () => document.body.classList.add('isCreditsHidden') : null}
        onChangeControl={this.onChangeControl}
        onClickTrackCredits={this.onClickTrackCredits}
        onSubmit={this.onSubmit}
      />
    )
  }
}

export default connect()(ForgotPasswordContainer)

