import React, { PropTypes } from 'react'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const Starred = ({ streamAction }) =>
  <MainView className="Starred">
    <StreamContainer action={streamAction} scrollSessionKey="/starred" />
  </MainView>

Starred.propTypes = {
  streamAction: PropTypes.object.isRequired,
}

export default Starred

