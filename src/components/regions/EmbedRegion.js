import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { ElloBuyButton } from '../editor/ElloBuyButton'

const EmbedRegion = ({ region }) => {
  const data = {}
  data[`data-${region.getIn(['data', 'service'])}-id`] = region.getIn(['data', 'id'])
  return (
    <div className="EmbedRegion">
      <div className="embetter" {...data}>
        <Link className="EmbedRegionContent" to={region.getIn(['data', 'url'])}>
          <img src={region.getIn(['data', 'thumbnailLargeUrl'])} alt={region.getIn(['data', 'service'])} />
        </Link>
        {
          region.get('linkUrl') && region.get('linkUrl').size ?
            <ElloBuyButton to={region.get('linkUrl')} /> :
            null
        }
      </div>
    </div>
  )
}
EmbedRegion.propTypes = {
  region: PropTypes.object.isRequired,
}

export default EmbedRegion

