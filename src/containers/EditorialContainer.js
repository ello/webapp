// @flow
import React, { Component } from 'react'
import { MainView } from '../components/views/MainView'
import StreamContainer from './StreamContainer'
import { editorials } from '../actions/editorials'

export default class extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <MainView className="Editorial">
        <StreamContainer action={editorials()} shouldInfiniteScroll={false} />
      </MainView>
    )
  }
}

