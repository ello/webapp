import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { MainView } from '../components/views/MainView'
import RegistrationRequestForm from '../components/forms/RegistrationRequestForm'

export default class SignupContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    return (
      <MainView className="Authentication">
        <div className="AuthenticationFormDialog">
          <RegistrationRequestForm {...this.props} />
        </div>
      </MainView>
    )
  }
}

