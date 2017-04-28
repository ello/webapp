// @flow
import React, { Component } from 'react'
import { MainView } from '../components/views/MainView'

export default class extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <MainView className="Editorial">
        Editorial
      </MainView>
    )
  }
}

