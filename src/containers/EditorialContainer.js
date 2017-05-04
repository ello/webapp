// @flow
import { is, Map } from 'immutable'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ExternalEditorial,
  CuratedPostEditorial,
  PostEditorial,
} from '../components/editorials/EditorialRenderables'
import type { EditorialProps } from '../types/flowtypes'

// TODO: Selectors!
const makeMapStateToProps = () => (
  (state: any, props: EditorialProps) => (
    {
      editorial: state.json.getIn(['editorials', props.editorialId], Map()),
    }
  )
)

class EditorialContainer extends Component {
  props: EditorialProps

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.editorialId !== this.props.editorialId ||
      !is(nextProps.editorial, this.props.editorial)
    )
  }


  render() {
    switch (this.props.editorial.get('kind')) {
      case 'post_stream':
        return <CuratedPostEditorial {...this.props} />
      case 'external':
        return <ExternalEditorial {...this.props} />
      case 'post':
      default:
        return <PostEditorial {...this.props} />
    }
  }
}

export default connect(makeMapStateToProps)(EditorialContainer)

