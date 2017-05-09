// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editorials } from '../actions/editorials'
import StreamContainer from '../containers/StreamContainer'
import { MainView } from '../components/views/MainView'
import { selectQueryPreview } from '../selectors/routing'
import { getQueryParamValue } from '../helpers/uri_helper'
import { media } from '../styles/jss'
import { maxBreak2 } from '../styles/jso'

const streamStyle = media(maxBreak2, {
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
})

const mapStateToProps = (state) => ({
  isPreview: selectQueryPreview(state) === 'true',
})

class EditorialPage extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <MainView className="Editorial">
        <StreamContainer
          action={editorials(this.props.isPreview)}
          className={`${streamStyle}`}
          shouldInfiniteScroll={false}
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(EditorialPage)

