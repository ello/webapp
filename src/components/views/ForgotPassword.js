import React, { PropTypes } from 'react'
import { MainView } from '../views/MainView'
import { AppleStore, GooglePlayStore } from '../assets/AppStores'
import Cover from '../assets/Cover'
import Credits from '../assets/Credits'
import Emoji from '../assets/Emoji'
import EmailControl from '../forms/EmailControl'
import FormButton from '../forms/FormButton'

const SubmittedState = () =>
  <div>
    If your email address exists in our database, you will receive a
    password recovery link at your email address in a few minutes.
  </div>

const ForgotPasswordForm = (props) => {
  const {
    emailState, isFormValid, onBlurControl, onChangeControl, onFocusControl, onSubmit,
  } = props
  return (
    <form
      className="AuthenticationForm"
      id="ForgotPasswordForm"
      noValidate="novalidate"
      onSubmit={onSubmit}
      role="form"
    >
      <EmailControl
        classList="isBoxControl"
        label="Email"
        onBlur={onBlurControl}
        onChange={onChangeControl}
        onFocus={onFocusControl}
        tabIndex="1"
      />
      {emailState.message ?
        <p className="HoppyStatusMessage hasContent">{emailState.message}</p> :
        <p className="HoppyStatusMessage"><span /></p>
      }
      <FormButton className="FormButton isRounded" disabled={!isFormValid} tabIndex="2">
        Reset password
      </FormButton>
    </form>
  )
}

ForgotPasswordForm.propTypes = {
  emailState: PropTypes.object.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onBlurControl: PropTypes.func.isRequired,
  onChangeControl: PropTypes.func.isRequired,
  onFocusControl: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export const ForgotPassword = (props) => {
  const { coverDPI, emailState, isFormValid, isSubmitted, promotion } = props
  const { onBlurControl, onChangeControl, onClickTrackCredits, onFocusControl, onSubmit } = props
  return (
    <MainView className="Authentication isForgotPassword">
      <div className="AuthenticationFormDialog">
        <h1>
          <Emoji name="hot_shit" title="It really does" size={32} />
          Shit happens.
        </h1>
        {isSubmitted ?
          <SubmittedState /> :
          <ForgotPasswordForm
            emailState={emailState}
            isFormValid={isFormValid}
            onBlurControl={onBlurControl}
            onChangeControl={onChangeControl}
            onFocusControl={onFocusControl}
            onSubmit={onSubmit}
          />
        }
      </div>
      <AppleStore />
      <GooglePlayStore />
      <Credits onClick={onClickTrackCredits} user={promotion} />
      <Cover
        coverDPI={coverDPI}
        coverImage={promotion ? promotion.coverImage : null}
        modifiers="isFullScreen hasOverlay"
      />
    </MainView>
  )
}

ForgotPassword.propTypes = {
  coverDPI: PropTypes.string.isRequired,
  emailState: PropTypes.object.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onBlurControl: PropTypes.func.isRequired,
  onChangeControl: PropTypes.func.isRequired,
  onClickTrackCredits: PropTypes.func.isRequired,
  onFocusControl: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  promotion: PropTypes.object,
}

export default ForgotPassword

