import Immutable from 'immutable'
import React from 'react'
import PropTypes from 'prop-types'
import EmbedRegion from '../regions/EmbedRegion'
import ImageRegion from '../regions/ImageRegion'
import TextRegion from '../regions/TextRegion'
import { isIOS } from '../../lib/jello'

export function RegionItems(props) {
  const { columnWidth, commentOffset, content, contentWidth,
    detailPath, innerHeight, isComment, isGridMode, isPostDetail } = props
  // sometimes the content is null/undefined for some reason
  if (!content) { return null }
  const cells = []
  content.forEach((region) => {
    switch (region.get('kind')) {
      case 'text':
        cells.push(
          <TextRegion
            content={region.get('data')}
            detailPath={detailPath}
            isComment={isComment}
            isGridMode={isGridMode}
            key={`TextRegion_${region.get('data')}`}
          />,
        )
        break
      case 'image': {
        const asset = region.get('asset')
        cells.push(
          <ImageRegion
            asset={asset}
            buyLinkURL={region.get('linkUrl')}
            columnWidth={columnWidth}
            commentOffset={commentOffset}
            content={region.get('data')}
            contentWidth={contentWidth}
            detailPath={detailPath}
            innerHeight={innerHeight}
            isComment={isComment}
            isGridMode={isGridMode}
            key={`ImageRegion_${JSON.stringify(region.get('data'))}`}
            shouldUseVideo={!!(asset && asset.getIn(['attachment', 'video'], Immutable.Map()).size) && !isIOS() && !isPostDetail}
          />,
        )
        break
      }
      case 'embed':
        cells.push(
          <EmbedRegion
            detailPath={detailPath}
            isComment={isComment}
            key={`EmbedRegion_${JSON.stringify(region.get('data'))}`}
            region={region}
          />,
        )
        break
      default:
        break
    }
  })
  // loop through cells to grab out image/text
  return <div>{cells}</div>
}
RegionItems.propTypes = {
  columnWidth: PropTypes.number.isRequired,
  commentOffset: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  contentWidth: PropTypes.number.isRequired,
  detailPath: PropTypes.string.isRequired,
  innerHeight: PropTypes.number.isRequired,
  isComment: PropTypes.bool,
  isGridMode: PropTypes.bool.isRequired,
  isPostDetail: PropTypes.bool.isRequired,
}
RegionItems.defaultProps = {
  isComment: false,
}

export function regionItemsForNotifications(content, detailPath) {
  const imageAssets = []
  const texts = []
  content.forEach((region) => {
    switch (region.get('kind')) {
      case 'text':
        texts.push(
          <TextRegion
            content={region.get('data')}
            detailPath={detailPath}
            isGridMode={false}
            key={`TextRegion_${region.get('data')}`}
          />,
        )
        break
      case 'image': {
        const asset = region.get('asset')
        imageAssets.push(
          <ImageRegion
            asset={asset}
            buyLinkURL={region.get('linkUrl')}
            content={region.get('data')}
            detailPath={detailPath}
            isGridMode
            isNotification
            key={`ImageRegion_${JSON.stringify(region.get('data'))}`}
            links={region.get('links')}
            shouldUseVideo={!!(asset && asset.getIn(['attachment', 'video'], Immutable.Map()).size) && !isIOS()}
          />,
        )
        break
      }
      case 'embed':
        imageAssets.push(
          <EmbedRegion
            detailPath={detailPath}
            key={`EmbedRegion_${JSON.stringify(region.get('data'))}`}
            region={region}
          />,
        )
        break
      // Hidden <hr>
      case 'rule':
        texts.push(<hr style={{ margin: '0.375rem', border: 0 }} key={`NotificationRule_${detailPath}`} />)
        break
      default:
        break
    }
  })
  return { assets: imageAssets, texts }
}

