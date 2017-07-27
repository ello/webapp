import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from 'ello-brains/constants/status_types'
import { ResetPassword } from '../components/views/ResetPassword'
import { getPasswordState } from '../components/forms/Validators'
import { sendResetPasswordRequest } from '../actions/authentication'

class ResetPasswordContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.state = {
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      formStatus: STATUS.INDETERMINATE,
    }
    this.passwordValue = ''
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch, params } = this.props
    const resetPasswordToken = params.resetPasswordToken
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: this.passwordValue, currentStatus })
    if (newState.status === STATUS.SUCCESS) {
      console.log('SUCCESS')
      dispatch(sendResetPasswordRequest(this.passwordValue, resetPasswordToken))
      this.setState({ formStatus: STATUS.SUBMITTED })
    } else if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
    console.log('SUBMITTED PASSWORD')
  }

  onChangeControl = ({ password }) => {
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
    console.log(this.passwordValue)
  }

  render() {
    // const { emailState, formStatus } = this.state
    return (
      <ResetPassword
        onSubmit={this.onSubmit}
        onChangeControl={this.onChangeControl}
      />
    )
  }
}

export default connect()(ResetPasswordContainer)