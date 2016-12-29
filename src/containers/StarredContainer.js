import React, { PureComponent } from 'react'
import { loadNoise } from '../actions/stream'
import { Starred } from '../components/views/Starred'

export default class StarredContainer extends PureComponent {
  static preRender = store =>
    store.dispatch(loadNoise())

  render() {
    return <Starred streamAction={loadNoise()} />
  }
}

