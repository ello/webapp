// @flow
import React, { Component } from 'react'
import { editorials } from '../actions/editorials'
import StreamContainer from '../containers/StreamContainer'
import { MainView } from '../components/views/MainView'
import { css } from '../styles/jss'

const streamStyle = css({
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
})

export default class extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <MainView className="Editorial">
        <StreamContainer
          action={editorials()}
          className={`${streamStyle}`}
          shouldInfiniteScroll={false}
        />
      </MainView>
    )
  }
}

