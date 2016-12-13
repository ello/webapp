import React, { Component } from 'react'
import { loadNoise } from '../actions/stream'
import { Starred } from '../components/views/Starred'

export default class StarredContainer extends Component {
  static preRender = store =>
    store.dispatch(loadNoise())

  shouldComponentUpdate() {
    return true
  }

  render() {
    return <Starred streamAction={loadNoise()} />
  }
}

