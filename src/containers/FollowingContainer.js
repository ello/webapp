import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { loadFriends } from '../actions/stream'
import { Following } from '../components/views/Following'

export default class FollowingContainer extends Component {
  static preRender = store =>
    store.dispatch(loadFriends())

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    return <Following streamAction={loadFriends()} />
  }
}

