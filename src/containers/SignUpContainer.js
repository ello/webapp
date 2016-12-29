import React from 'react'
import { MainView } from '../components/views/MainView'
import RegistrationRequestForm from '../components/forms/RegistrationRequestForm'

export default () =>
  <MainView className="Authentication">
    <div className="AuthenticationFormDialog">
      <RegistrationRequestForm />
    </div>
  </MainView>

