/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react'
import Block from './Block'

export function reloadPlayers() {
  if (typeof window !== 'undefined' && window.embetter) {
    window.embetter.reloadPlayers()
  }
}

class EmbedBlock extends Component {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  componentDidMount() {
    reloadPlayers()
  }

  componentDidUpdate() {
    reloadPlayers()
  }

  render() {
    const { data: { service, url, thumbnailLargeUrl, id } } = this.props
    const children = typeof window !== 'undefined' ?
      window.embetter.utils.playerHTML(
        window.embetter.services[service],
        url,
        thumbnailLargeUrl,
        id,
      ) :
      null
    return (
      <Block {...this.props}>
        <div
          className="editable embed"
          dangerouslySetInnerHTML={{ __html: children }}
        />
      </Block>
    )
  }

}

export default EmbedBlock

