import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import RegionTools from './RegionTools'
import { ElloBuyButton } from './ElloBuyButton'

class Block extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    editorId: PropTypes.string.isRequired,
    linkURL: PropTypes.string,
    onRemoveBlock: PropTypes.func.isRequired,
    uid: PropTypes.number.isRequired,
  }

  static defaultProps = {
    className: null,
    linkURL: null,
  }

  static defaultProps = {
    data: '',
    ref: 'editable',
  }

  removeBlock = () => {
    const { onRemoveBlock, uid } = this.props
    onRemoveBlock(uid)
  }

  render() {
    const { children, className, editorId, linkURL, uid } = this.props
    return (
      <div
        className={classNames('editor-block', className)}
        data-collection-id={uid}
        data-editor-id={editorId}
        ref={(comp) => { this.editorBlock = comp }}
      >
        {children}
        {
          linkURL && linkURL.length ?
            <ElloBuyButton to={linkURL} /> :
            null
        }
        <RegionTools editorId={editorId} onRemoveBlock={this.removeBlock} />
      </div>
    )
  }

}

export default Block

