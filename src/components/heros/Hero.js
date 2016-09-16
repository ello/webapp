import React, { PropTypes } from 'react'
import Promotion from '../assets/Promotion'
import { ZeroStream } from '../zeros/Zeros'

const styles = {
  backgroundColor: 'white',
}

const fauxCover = {
  height: 'calc(100vh - 80px)',
  backgroundColor: 'lightgreen',
  textAlign: 'center',
}

const Hero = ({
  broadcast,
  coverDPI,
  hasCoverProfile,
  hasPromotion,
  isLoggedIn,
  onClickTrackCredits,
  onDismissZeroStream,
  promotion,
}) =>
  <div className="Hero" style={{ ...styles }}>
    <div style={{ height: 80 }} />
    { broadcast ?
      <ZeroStream onDismiss={onDismissZeroStream}>{broadcast}</ZeroStream> : null
    }
    { hasPromotion ?
      <Promotion
        coverDPI={coverDPI}
        isLoggedIn={isLoggedIn}
        onClickTrackCredits={onClickTrackCredits}
        promotion={promotion}
      /> : null
    }
    { hasCoverProfile ?
      <div style={{ ...fauxCover }}>Cover Profile 2.0</div> : null
    }
  </div>

Hero.propTypes = {
  broadcast: PropTypes.string,
  coverDPI: PropTypes.string.isRequired,
  hasCoverProfile: PropTypes.bool,
  hasPromotion: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  onClickTrackCredits: PropTypes.func.isRequired,
  onDismissZeroStream: PropTypes.func.isRequired,
  promotion: PropTypes.object,
}

export default Hero

