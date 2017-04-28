import OnboardingCategoriesContainer from '../../containers/OnboardingCategoriesContainer'
import OnboardingCollaborateContainer from '../../containers/OnboardingCollaborateContainer'
import OnboardingInvitationsContainer from '../../containers/OnboardingInvitationsContainer'
import OnboardingSettingsContainer from '../../containers/OnboardingSettingsContainer'
import { ONBOARDING_VERSION } from '../../constants/application_types'

export default (store) => {
  function onEnter(nextState, replace) {
    const state = store.getState()
    if (state.profile.get('webOnboardingVersion') === ONBOARDING_VERSION) {
      replace({ pathname: '/', state: nextState })
    }
  }

  return [
    {
      path: 'onboarding/categories',
      getComponent(location, cb) {
        cb(null, OnboardingCategoriesContainer)
      },
      onEnter,
    },
    {
      path: 'onboarding/settings',
      getComponent(location, cb) {
        cb(null, OnboardingSettingsContainer)
      },
    },
    {
      path: 'onboarding/collaborate',
      getComponent(location, cb) {
        cb(null, OnboardingCollaborateContainer)
      },
    },
    {
      path: 'onboarding/invitations',
      getComponent(location, cb) {
        cb(null, OnboardingInvitationsContainer)
      },
    },
  ]
}

