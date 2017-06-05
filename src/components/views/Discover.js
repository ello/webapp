import React from 'react'
import PropTypes from 'prop-types'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const Discover = ({
  streamAction,
  inAllCategories,
  }) =>
    <MainView className="Discover">
      <StreamContainer className={inAllCategories ? 'inAllCategories' : null} action={streamAction} />
    </MainView>

Discover.propTypes = {
  inAllCategories: PropTypes.bool.isRequired,
  streamAction: PropTypes.object.isRequired,
}

export default Discover

