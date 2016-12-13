import React, { Component } from 'react'
import { MainView } from '../components/views/MainView'
import RegistrationRequestForm from '../components/forms/RegistrationRequestForm'

export default class SignUpContainer extends Component {
  shouldComponentUpdate() {
    return true
  }

  render() {
    return (
      <MainView className="Authentication">
        <div className="AuthenticationFormDialog">
          <RegistrationRequestForm />
        </div>
      </MainView>
    )
  }
}

