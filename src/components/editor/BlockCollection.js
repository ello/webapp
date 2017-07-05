import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { selectIsPostDetail, selectPathname } from 'ello-brains/selectors/routing'
import * as ACTION_TYPES from 'ello-brains/constants/action_types'
import { addDragObject, removeDragObject } from 'ello-brains/interactions/Drag'
import { selectPropsPostId } from 'ello-brains/selectors/post'
import { selectAvatar } from 'ello-brains/selectors/profile'
import { selectIsMobileGridStream, selectIsNavbarHidden } from 'ello-brains/selectors/gui'
import {
  addBlock,
  addDragBlock,
  addEmptyTextBlock,
  loadReplyAll,
  removeBlock,
  removeDragBlock,
  reorderBlocks,
  saveAsset,
  updateBlock,
} from 'ello-brains/actions/editor'
import { closeOmnibar } from 'ello-brains/actions/omnibar'
import Avatar from '../assets/Avatar'
import Block from './Block'
import EmbedBlock from './EmbedBlock'
import ImageBlock from './ImageBlock'
import QuickEmoji from './QuickEmoji'
import RepostBlock from './RepostBlock'
import TextBlock from './TextBlock'
import PostActionBar from './PostActionBar'
import { scrollToLastTextBlock } from '../../lib/jello'
import { addInputObject, removeInputObject } from './InputComponent'

function mapStateToProps(state, props) {
  const editor = state.editor.get(props.editorId, Immutable.Map())
  const collection = editor.get('collection')
  const order = editor.get('order')
  let buyLink
  const firstBlock = collection && order ? collection.get(`${order.first()}`) : null
  if (firstBlock) {
    buyLink = firstBlock.get('linkUrl')
  }
  return {
    buyLink,
    avatar: selectAvatar(state),
    collection,
    dragBlock: editor.get('dragBlock'),
    firstBlock,
    hasContent: editor.get('hasContent'),
    hasMedia: editor.get('hasMedia'),
    hasMention: editor.get('hasMention'),
    isLoading: editor.get('isLoading'),
    isPostDetail: selectIsPostDetail(state, props),
    isPosting: editor.get('isPosting'),
    isMobileGridStream: selectIsMobileGridStream(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    order,
    orderLength: order ? order.size : 0,
    pathname: selectPathname(state),
    postId: selectPropsPostId(state, props),
  }
}

class BlockCollection extends PureComponent {

  static propTypes = {
    avatar: PropTypes.object,
    blocks: PropTypes.object,
    buyLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    dragBlock: PropTypes.object,
    editorId: PropTypes.string.isRequired,
    firstBlock: PropTypes.object,
    hasContent: PropTypes.bool,
    hasMedia: PropTypes.bool,
    hasMention: PropTypes.bool,
    isComment: PropTypes.bool,
    isLoading: PropTypes.bool,
    isMobileGridStream: PropTypes.bool,
    isNavbarHidden: PropTypes.bool,
    isOwnPost: PropTypes.bool,
    isPostDetail: PropTypes.bool.isRequired,
    isPostEditing: PropTypes.bool.isRequired,
    isPostReposting: PropTypes.bool.isRequired,
    isPosting: PropTypes.bool,
    order: PropTypes.object.isRequired,
    orderLength: PropTypes.number.isRequired,
    pathname: PropTypes.string.isRequired,
    postId: PropTypes.string,
    repostContent: PropTypes.object,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string,
  }

  static defaultProps = {
    avatar: null,
    buyLink: null,
    blocks: Immutable.List(),
    dragBlock: null,
    firstBlock: null,
    hasContent: false,
    hasMedia: false,
    hasMention: false,
    isComment: false,
    isLoading: false,
    isMobileGridStream: false,
    isNavbarHidden: false,
    isOwnPost: false,
    isPosting: false,
    postId: null,
    repostContent: Immutable.List(),
    submitText: 'Post',
  }

  componentWillMount() {
    const { blocks, dispatch, editorId, repostContent } = this.props
    this.state = { hasDragOver: false }
    if (repostContent.size) {
      dispatch(addBlock({ kind: 'repost', data: repostContent }, editorId))
    }
    if (blocks.size) {
      blocks.forEach((block) => {
        dispatch(addBlock(block.toJS(), editorId, false))
      })
    }
  }

  componentDidMount() {
    const { dispatch, editorId } = this.props
    this.dragObject = { component: this, dragId: editorId }
    dispatch(addEmptyTextBlock(editorId))
    addDragObject(this.dragObject)
    addInputObject(this)
  }

  componentDidUpdate(prevProps) {
    const { editorId, isNavbarHidden, isPostDetail,
      isPostEditing, isPostReposting, order } = this.props
    const isDragging = document.body.classList.contains('isDragging')
    const switchedToEditing = prevProps.isPostEditing !== isPostEditing ||
      prevProps.isPostReposting !== isPostReposting
    const orderWasModified = prevProps.order && order && prevProps.order.size !== order.size
    if (switchedToEditing || (!isPostDetail && !isDragging && orderWasModified)) {
      scrollToLastTextBlock(editorId, isNavbarHidden)
    }
  }

  componentWillUnmount() {
    if (this.dragObject) {
      removeDragObject(this.dragObject)
    }
    removeInputObject(this)
  }

  onCloseOmnibar() {
    const { dispatch, isComment } = this.props
    if (!isComment) {
      dispatch(closeOmnibar())
    }
  }

  onDragStart(props) {
    const { collection, dispatch, editorId } = this.props
    this.blockNode = props.target.parentNode.parentNode
    this.startOffset = this.blockNode.offsetTop
    this.startHeight = this.blockNode.offsetHeight
    this.prevBlock = this.blockNode.previousSibling
    this.nextBlock = this.blockNode.nextSibling
    const dragUid = this.blockNode.dataset.collectionId
    dispatch(addDragBlock(collection.get(`${dragUid}`), editorId))
    // swap the dragging block for a
    // normal block and set the height/width
    const block = {
      data: {
        width: this.blockNode.offsetWidth,
        height: this.blockNode.offsetHeight,
      },
      kind: 'block',
      uid: collection.getIn([`${dragUid}`, 'uid']),
    }
    dispatch(updateBlock(block, dragUid, editorId, true))
    this.onDragMove(props)
    document.body.classList.add('isDragging')
  }

  onDragMove(props) {
    // move the block we are currently dragging
    this.setState({ dragBlockTop: props.dragY + this.startOffset })
    // determine if we should change order
    if (props.dragY < props.lastDragY) {
      this.onDragUp(props)
    } else if (props.dragY > props.lastDragY) {
      this.onDragDown(props)
    }
  }

  onDragUp(props) {
    if (this.prevBlock &&
        !this.prevBlock.classList.contains('readonly') &&
        (props.dragY + this.startOffset) <
        (this.prevBlock.offsetTop + (this.prevBlock.offsetHeight * 0.5))) {
      this.onMoveBlock(-1)
    }
  }

  onDragDown(props) {
    if (this.nextBlock &&
        (props.dragY + this.startOffset + this.startHeight) >
        (this.nextBlock.offsetTop + (this.nextBlock.offsetHeight * 0.5))) {
      this.onMoveBlock(1)
    }
  }

  onMoveBlock(delta) {
    if (!this.blockPlaceholder) return
    const { dispatch, dragBlock, editorId } = this.props
    dispatch(reorderBlocks(dragBlock.get('uid'), delta, editorId))
    const placeholder = this.blockPlaceholder.editorBlock
    this.prevBlock = placeholder.previousSibling
    this.nextBlock = placeholder.nextSibling
  }

  onDragEnd() {
    const { dispatch, dragBlock, editorId } = this.props
    // swap the normal block out for
    // the one that was removed initially
    const dragUid = dragBlock.get('uid')
    dispatch(updateBlock(dragBlock, dragUid, editorId))
    dispatch(removeDragBlock(editorId))
    document.body.classList.remove('isDragging')
    this.setState({ dragBlockTop: null })
    dispatch(addEmptyTextBlock(editorId))
  }

  onDragOver = (e) => {
    e.preventDefault()
    if (!this.state.hasDragOver) {
      this.setState({ hasDragOver: true })
    }
  }

  onDragLeave = () => {
    if (this.state.hasDragOver) {
      this.setState({ hasDragOver: false })
    }
  }

  onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ hasDragOver: false })
    if (e.dataTransfer.files.length) { this.acceptFiles(e.dataTransfer.files) }
    if (e.dataTransfer.types.indexOf('application/json') > -1) {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.username) {
        this.appendText(`@${data.username} `)
      }
      if (data.emojiCode) {
        this.appendText(`${data.emojiCode} `)
      }
      if (data.imgSrc) {
        this.appendText(`![img-drop](${data.imgSrc})\n\n`)
      }
      if (data.href) {
        if (data.href === data.linkText) {
          this.appendText(`${data.href}`)
        } else {
          this.appendText(`[${data.linkText}](${data.href}) `)
        }
      }
    }
  }

  onSubmitPost() {
    const { collection, editorId, hasContent } = this.props
    if (document.activeElement.parentNode.dataset.editorId === editorId &&
        collection.every(block => !block.get('isLoading')) && hasContent) {
      this.submit()
    }
  }

  onInsertEmoji = ({ value }) => {
    this.appendText(value)
  }

  getBlockElement(block) {
    const { editorId } = this.props
    const blockProps = {
      data: block.get('data'),
      editorId,
      key: block.get('uid'),
      kind: block.get('kind'),
      linkURL: block.get('linkUrl'),
      onRemoveBlock: this.remove,
      uid: block.get('uid'),
    }
    switch (block.get('kind')) {
      case 'block':
        return (
          <Block
            {...blockProps}
            className={classNames('BlockPlaceholder', { isUploading: block.get('isLoading') })}
            ref={(comp) => { this.blockPlaceholder = comp }}
          >
            <div style={{ width: block.getIn(['data', 'width']), height: block.getIn(['data', 'height']) }} />
          </Block>
        )
      case 'embed':
        return (
          <EmbedBlock {...blockProps} />
        )
      case 'image':
        return (
          <ImageBlock blob={block.get('blob')} {...blockProps} isUploading={block.get('isLoading')} />
        )
      case 'repost':
        return (
          <RepostBlock {...blockProps} onRemoveBlock={null} />
        )
      case 'text':
        return (
          <TextBlock
            {...blockProps}
            onInput={this.handleTextBlockInput}
            shouldAutofocus={this.shouldAutofocus()}
          />
        )
      default:
        return null
    }
  }

  shouldAutofocus() {
    const { pathname, isComment } = this.props
    const postRegex = /^\/[\w-]+\/post\/.+/
    return !(isComment && postRegex.test(pathname))
  }

  appendText = (content) => {
    const { dispatch, editorId, isNavbarHidden } = this.props
    dispatch({ type: ACTION_TYPES.EDITOR.APPEND_TEXT, payload: { editorId, text: content } })
    scrollToLastTextBlock(editorId, isNavbarHidden)
  }

  remove = (uid) => {
    const { dispatch, editorId } = this.props
    dispatch(removeBlock(uid, editorId))
  }

  handleTextBlockInput = (vo) => {
    const { dragBlock, collection, dispatch, editorId } = this.props
    if (!dragBlock && collection.getIn([`${vo.uid}`, 'data']) !== vo.data) {
      dispatch(updateBlock(vo, vo.uid, editorId))
    }
  }

  replyAll = () => {
    const { dispatch, postId, editorId } = this.props
    dispatch(loadReplyAll(postId, editorId))
  }

  submit = () => {
    const { submitAction } = this.props
    submitAction(this.serialize())
  }

  serialize() {
    const { collection, order } = this.props
    const results = []
    order.forEach((uid) => {
      const block = collection.get(`${uid}`)
      const kind = block.get('kind')
      const data = block.get('data')
      const linkUrl = block.get('linkUrl')
      switch (kind) {
        case 'text':
          if (data && data.length) {
            if (linkUrl && linkUrl.length) {
              results.push({ kind, data, link_url: linkUrl })
            } else {
              results.push({ kind, data })
            }
          }
          break
        case 'repost':
          break
        default:
          if (linkUrl && linkUrl.length) {
            results.push({ kind, data, link_url: linkUrl })
          } else {
            results.push({ kind, data })
          }
          break
      }
    })
    return results
  }

  handleFiles = (e) => {
    if (e.target.files.length) { this.acceptFiles(e.target.files) }
  }

  acceptFiles(files) {
    const { dispatch, editorId } = this.props
    for (let index = 0, len = files.length; index < len; index += 1) {
      if (files.item(index)) {
        dispatch(saveAsset(files[index], editorId))
      }
    }
  }

  render() {
    const {
      buyLink, avatar, cancelAction, collection, dragBlock, editorId, firstBlock,
      hasContent, hasMedia, hasMention, isComment, isLoading, isMobileGridStream,
      isOwnPost, isPosting, order, orderLength, submitText,
    } = this.props
    const { dragBlockTop, hasDragOver } = this.state
    const firstBlockIsText = firstBlock ? /text/.test(firstBlock.get('kind')) : true
    const showQuickEmoji = isComment && firstBlockIsText
    const editorClassNames = classNames('editor', {
      withQuickEmoji: showQuickEmoji,
      hasDragOver,
      hasContent,
      hasMedia,
      hasMention,
      isComment,
      isLoading,
      isPosting,
    })
    return (
      <div
        className={editorClassNames}
        data-placeholder={isComment ? 'Comment...' : 'Add images, embeds, text & links.'}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        {isComment ? <Avatar sources={avatar} /> : null}
        <div
          className="editor-region"
          data-num-blocks={orderLength}
        >
          {order ? order.map(uid => this.getBlockElement(collection.get(`${uid}`))) : null}
          {dragBlock ?
            <div className="DragBlock" style={{ top: dragBlockTop }}>
              {this.getBlockElement(dragBlock)}
            </div> :
            null
          }
        </div>
        {showQuickEmoji ? <QuickEmoji onAddEmoji={this.onInsertEmoji} /> : null}
        <PostActionBar
          buyLink={buyLink}
          cancelAction={cancelAction}
          disableSubmitAction={isPosting || isLoading || !hasContent}
          editorId={editorId}
          handleFileAction={this.handleFiles}
          hasMedia={hasMedia}
          replyAllAction={isComment && isOwnPost && !isMobileGridStream ? this.replyAll : null}
          submitAction={this.submit}
          submitText={submitText}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(BlockCollection)

