import EnterContainer from '../../containers/EnterContainer'
import JoinContainer from '../../containers/JoinContainer'
import SignUpContainer from '../../containers/SignUpContainer'
import ForgotPasswordContainer from '../../containers/ForgotPasswordContainer'

export default (store) => {
  function onEnter(nextState, replace) {
    const {
      authentication: { isLoggedIn },
      gui: { homeStream },
    } = store.getState()
    if (isLoggedIn) {
      replace({ pathname: homeStream, state: nextState })
    }
  }

  return [
    {
      path: 'enter',
      getComponents(location, cb) {
        cb(null, EnterContainer)
      },
      onEnter,
    },
    {
      path: 'join(/:invitationCode)',
      getComponents(location, cb) {
        cb(null, JoinContainer)
      },
      onEnter,
    },
    {
      path: 'signup',
      getComponents(location, cb) {
        cb(null, SignUpContainer)
      },
      onEnter,
    },
    {
      path: 'forgot-password',
      getComponents(location, cb) {
        cb(null, ForgotPasswordContainer)
      },
      onEnter,
    },
  ]
}

