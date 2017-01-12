import React, { PropTypes } from 'react'
import OnboardingNavbar from '../onboarding/OnboardingNavbar'
import PasswordControl from '../forms/PasswordControl'
import UsernameControl from '../forms/UsernameControl'
import { MainView } from '../views/MainView'
import { signupPath } from '../../networking/api'

const Join = (props) => {
  const {
    email,
    isValid,
    onChangePasswordControl,
    onChangeUsernameControl,
    onSubmit,
    passwordRenderStatus,
    passwordStatus,
    usernameRenderStatus,
    usernameStatus,
    usernameSuggestions,
  } = props
  const domain = ENV.AUTH_DOMAIN
  return (
    <MainView className="Authentication isJoinForm">
      <div className="AuthenticationFormDialog">
        <form
          action={signupPath().path}
          className="AuthenticationForm"
          id="RegistrationForm"
          method="POST"
          noValidate="novalidate"
          onSubmit={onSubmit}
          role="form"
        >
          <UsernameControl
            autoFocus={email && email.length}
            classList="isSimpleWhiteControl"
            label="Username"
            onChange={onChangeUsernameControl}
            placeholder="Username"
            status={usernameStatus}
            renderStatus={usernameRenderStatus}
            suggestions={usernameSuggestions}
            tabIndex="1"
          />
          <PasswordControl
            classList="isSimpleWhiteControl"
            label="Password"
            onChange={onChangePasswordControl}
            placeholder="Password"
            status={passwordStatus}
            renderStatus={passwordRenderStatus}
            tabIndex="2"
          />
        </form>
        <p className="AuthenticationTermsCopy">
          By continuing you are agreeing to our <a href={`${domain}/wtf/post/policies`}>Terms</a>.
        </p>
      </div>
      <OnboardingNavbar
        isNextDisabled={!isValid}
      />
    </MainView>
  )
}
Join.propTypes = {
  email: PropTypes.string,
  isValid: PropTypes.bool.isRequired,
  onChangePasswordControl: PropTypes.func.isRequired,
  onChangeUsernameControl: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  passwordRenderStatus: PropTypes.func,
  passwordStatus: PropTypes.string.isRequired,
  usernameRenderStatus: PropTypes.func,
  usernameStatus: PropTypes.string.isRequired,
  usernameSuggestions: PropTypes.array,
}
Join.defaultProps = {
  email: null,
  passwordRenderStatus: null,
  usernameRenderStatus: null,
  usernameSuggestions: null,
}

export default Join

