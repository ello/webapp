import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import debounce from 'lodash/debounce'
import { selectParamsInvitationCode } from 'ello-brains/selectors/params'
import { FORM_CONTROL_STATUS as STATUS } from 'ello-brains/constants/status_types'
import { selectAvailability, selectEmail } from 'ello-brains/selectors/profile'
import { trackEvent } from 'ello-brains/actions/analytics'
import { getInviteEmail } from 'ello-brains/actions/invitations'
import { checkAvailability, resetAvailability } from 'ello-brains/actions/profile'
import { invite } from 'ello-brains/networking/api'
import { isAndroid } from '../../lib/jello'
import EmailControl from './EmailControl'
import FormButton from './FormButton'
import JoinForm from './JoinForm'
import {
  isFormValid,
  getEmailStateFromClient,
  getEmailStateFromServer,
  getInvitationCodeStateFromServer,
} from './Validators'
import {
  addPageVisibilityObserver,
  removePageVisibilityObserver,
} from '../viewport/PageVisibilityComponent'
import { css, media, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

function mapStateToProps(state, props) {
  return {
    availability: selectAvailability(state),
    email: selectEmail(state),
    invitationCode: selectParamsInvitationCode(state, props),
  }
}

const emailFormWrapperStyle = css(s.relative, s.zIndex1)
const accountLinkStyle = css(
  { marginTop: 15 },
  s.fontSize14,
  s.colorWhite,
  parent('.AuthenticationFormDialog.inModal',
    s.mt0,
    s.mb20,
    s.colorA,
    media(s.minBreak2, s.mb0),
  ),
)

class RegistrationRequestForm extends Component {

  static propTypes = {
    availability: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    email: PropTypes.string,
    inModal: PropTypes.bool,
    inEditorial: PropTypes.bool,
  }

  static defaultProps = {
    availability: null,
    email: null,
    inModal: false,
    inEditorial: false,
  }

  componentWillMount() {
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      formStatus: STATUS.INDETERMINATE,
      invitationCodeState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.emailValue = ''
    this.checkServerForAvailability = debounce(this.checkServerForAvailability, 666)
  }

  componentDidMount() {
    addPageVisibilityObserver(this)
    this.checkForInviteCode(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { availability } = nextProps
    if (nextProps.email !== this.props.email) {
      this.checkForInviteCode(nextProps)
    }
    if (!availability) { return }
    if (availability.has('email')) {
      this.validateEmailResponse(availability)
    }
    if (availability.has('invitationCode')) {
      this.validateInvitationCodeResponse(availability)
    }
  }

  componentWillUnmount() {
    removePageVisibilityObserver(this)
  }

  onBeforeUnload() {
    const { dispatch } = this.props
    const { formStatus } = this.state
    if (formStatus !== STATUS.SUBMITTED) {
      dispatch(trackEvent('modal-registration-request-abandonment'))
    }
  }

  onChangeEmailControl = ({ email }) => {
    this.emailValue = email
    const { emailState } = this.state
    const currentStatus = emailState.status
    const clientState = getEmailStateFromClient({ value: email, currentStatus })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ emailState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateEmailResponse` after fetching
      this.checkServerForAvailability({ email })
      return
    }
    if (currentStatus !== clientState.status) {
      this.setState({ emailState: clientState })
    }
  }

  onClickLogin = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('clicked_signup_login'))
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { emailState } = this.state
    if (emailState.status === STATUS.SUCCESS) {
      this.setState({ emailState: { status: STATUS.REQUEST, message: 'checking...' } })
      this.checkServerForAvailability({ email: this.emailValue, is_signup: true })
    }
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
      document.body.querySelector('.JoinEmailControl input').value = this.emailValue
      requestAnimationFrame(() => {
        this.setState({ emailState: { status: STATUS.SUCCESS } })
      })
    }
  }

  checkServerForAvailability(vo) {
    this.props.dispatch(checkAvailability(vo))
  }

  validateEmailResponse(availability) {
    const { dispatch, inModal } = this.props
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromServer({ availability, currentStatus })
    if (newState.status === STATUS.SUCCESS && availability.getIn(['original', 'is_signup'])) {
      dispatch(resetAvailability())
      if (inModal) {
        dispatch(trackEvent('modal-registration-request-form-completion'))
      }
      this.setState({ formStatus: STATUS.SUBMITTED })
    } else {
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

  renderSignupForm() {
    return (
      <JoinForm
        email={this.emailValue}
        inEditorial={this.props.inEditorial}
        invitationCode={this.invitationCodeValue}
      />
    )
  }

  renderEmailForm() {
    const { inEditorial } = this.props
    const { emailState } = this.state
    const { message, status } = emailState
    const isValid = isFormValid([emailState])
    const showMessage = (message && message.length) &&
      (status === STATUS.FAILURE || status === STATUS.SUCCESS)
    return (
      <div className={emailFormWrapperStyle}>
        <h1>
          Join The Creators Network.
        </h1>
        <h2>
          Be part of what&apos;s next in art, design, fashion, web culture & more.
        </h2>
        <form
          action={invite().path}
          className="AuthenticationForm"
          id="RegistrationRequestForm"
          method="POST"
          noValidate="novalidate"
          onSubmit={this.onSubmit}
          role="form"
        >
          <EmailControl
            classList="isBoxControl JoinEmailControl"
            label="Email"
            onChange={this.onChangeEmailControl}
            onBlur={isAndroid() ? () => document.body.classList.remove('isCreditsHidden') : null}
            onFocus={isAndroid() ? () => document.body.classList.add('isCreditsHidden') : null}
            tabIndex="1"
          />
          {showMessage &&
            <p className="HoppyStatusMessage hasContent">{message}</p>
          }
          <FormButton className="FormButton isRounded isGreen" disabled={!isValid} tabIndex="2">
            Create account
          </FormButton>
        </form>
        {!inEditorial && <Link className={accountLinkStyle} onClick={this.onClickLogin} to="/enter">Already have an account?</Link>}
      </div>
    )
  }

  render() {
    const { formStatus } = this.state
    return formStatus === STATUS.SUBMITTED ? this.renderSignupForm() : this.renderEmailForm()
  }
}

export default connect(mapStateToProps)(RegistrationRequestForm)

