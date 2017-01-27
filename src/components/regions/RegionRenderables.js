import React, { PropTypes } from 'react'
import EmbedRegion from '../regions/EmbedRegion'
import ImageRegion from '../regions/ImageRegion'
import TextRegion from '../regions/TextRegion'

export function RegionItems(props) {
  const { assets, columnWidth, commentOffset, content, contentWidth,
    detailPath, innerHeight, isGridMode } = props
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
            isGridMode={isGridMode}
            key={`TextRegion_${region.get('data')}`}
          />,
        )
        break
      case 'image':
        cells.push(
          <ImageRegion
            assets={assets}
            buyLinkURL={region.get('linkUrl')}
            columnWidth={columnWidth}
            commentOffset={commentOffset}
            content={region.get('data')}
            contentWidth={contentWidth}
            detailPath={detailPath}
            innerHeight={innerHeight}
            isGridMode={isGridMode}
            key={`ImageRegion_${JSON.stringify(region.get('data'))}`}
            links={region.get('links')}
          />,
        )
        break
      case 'embed':
        cells.push(
          <EmbedRegion
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
  assets: PropTypes.object,
  columnWidth: PropTypes.number.isRequired,
  commentOffset: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  contentWidth: PropTypes.number.isRequired,
  detailPath: PropTypes.string.isRequired,
  innerHeight: PropTypes.number.isRequired,
  isGridMode: PropTypes.bool.isRequired,
}
RegionItems.defaultProps = {
  assets: null,
}


export function regionItemsForNotifications(content, postDetailPath = null, assets) {
  const imageAssets = []
  const texts = []
  content.forEach((region) => {
    switch (region.get('kind')) {
      case 'text':
        texts.push(
          <TextRegion
            content={region.get('data')}
            isGridMode={false}
            key={`TextRegion_${region.get('data')}`}
            postDetailPath={postDetailPath}
          />,
        )
        break
      case 'image':
        imageAssets.push(
          <ImageRegion
            buyLinkURL={region.get('linkUrl')}
            assets={assets}
            content={region.get('data')}
            isGridMode
            isNotification
            key={`ImageRegion_${JSON.stringify(region.get('data'))}`}
            links={region.get('links')}
            postDetailPath={postDetailPath}
          />,
        )
        break
      case 'embed':
        imageAssets.push(
          <EmbedRegion
            key={`EmbedRegion_${JSON.stringify(region.get('data'))}`}
            postDetailPath={postDetailPath}
            region={region}
          />,
        )
        break
      case 'rule':
        texts.push(<hr className="NotificationRule" />)
        break
      default:
        break
    }
  })
  return { assets: imageAssets, texts }
}

