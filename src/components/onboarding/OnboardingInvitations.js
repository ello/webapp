import React from 'react'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import InvitationFormContainer from '../../containers/InvitationFormContainer'
import { Title } from './OnboardingParts'

const OnboardingInvitations = () =>
  <MainView className="Onboarding">
    <Title
      text1="Invite some cool people. "
      text2="Make Ello better."
    />
    <InvitationFormContainer />
    <OnboardingNavbar />
  </MainView>

export default OnboardingInvitations

