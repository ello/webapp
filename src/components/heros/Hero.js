import React, { PropTypes } from 'react'
import Promotion from '../assets/Promotion'
import { ZeroStream } from '../zeros/Zeros'
import UserContainer from '../../containers/UserContainer'

const styles = {
  backgroundColor: 'white',
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
  user,
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
    { hasCoverProfile && user ?
      <div
        className="FakeCover"
        style={{ backgroundImage: `url(${user.coverImage[coverDPI].url})` }}
      >
        <UserContainer user={user} type="profile" />
      </div> : null
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
  user: PropTypes.object,
}

export default Hero

