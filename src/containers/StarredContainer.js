import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { loadNoise } from '../actions/stream'
import { Starred } from '../components/views/Starred'

export default class StarredContainer extends Component {
  static preRender = (store) =>
    store.dispatch(loadNoise())

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    return <Starred streamAction={loadNoise()} />
  }
}

