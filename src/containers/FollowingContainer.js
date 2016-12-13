import React, { Component } from 'react'
import { loadFriends } from '../actions/stream'
import { Following } from '../components/views/Following'

export default class FollowingContainer extends Component {
  static preRender = store =>
    store.dispatch(loadFriends())

  shouldComponentUpdate() {
    return true
  }

  render() {
    return <Following streamAction={loadFriends()} />
  }
}

