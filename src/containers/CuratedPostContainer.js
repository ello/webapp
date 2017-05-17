// @flow
import { is } from 'immutable'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectDPI } from '../selectors/gui'
import {
  selectPost,
  selectPostAuthorUsername,
  selectPostDetailPath,
  selectPostFirstImage,
  selectPostIsEmpty,
} from '../selectors/post'
import { CuratedPost } from '../components/editorials/EditorialRenderables'

type Props = {
  dpi: string,
  detailPath: string,
  post: any,
  sources: any,
  title: string,
  username: string,
}

const makeMapStateToProps = () => (
  (state: any, props: any) => ({
    detailPath: selectPostDetailPath(state, props),
    dpi: selectDPI(state),
    isPostEmpty: selectPostIsEmpty(state, props),
    post: selectPost(state, props),
    sources: selectPostFirstImage(state, props),
    username: selectPostAuthorUsername(state, props),
  })
)

class CuratedPostContainer extends Component {
  props: Props

  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.isPostEmpty) { return false }
    return !is(nextProps.post, this.props.post)
  }

  render() {
    const props = {
      dpi: this.props.dpi,
      detailPath: this.props.detailPath,
      sources: this.props.sources,
      title: this.props.title,
      username: this.props.username,
    }
    return <CuratedPost {...props} />
  }
}

export default connect(makeMapStateToProps)(CuratedPostContainer)

