import React from 'react'
import { loadFollowing } from 'ello-brains/actions/stream'
import { Following } from '../components/views/Following'

const FollowingContainer = () =>
  <Following streamAction={loadFollowing()} />

export default FollowingContainer

