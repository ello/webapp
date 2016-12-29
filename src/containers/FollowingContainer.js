import React, { PureComponent } from 'react'
import { loadFriends } from '../actions/stream'
import { Following } from '../components/views/Following'

export default class FollowingContainer extends PureComponent {
  static preRender = store =>
    store.dispatch(loadFriends())

  render() {
    return <Following streamAction={loadFriends()} />
  }
}

