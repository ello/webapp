import React, { PropTypes } from 'react'
import Promotion from '../assets/Promotion'
import { ZeroStream } from '../zeros/Zeros'
import UserContainer from '../../containers/UserContainer'
import BackgroundImage from '../assets/BackgroundImage'

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
  <div className="Hero" >
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
      <div className="FakeCover">
        <BackgroundImage
          className="hasOverlay inHero"
          coverImage={user.coverImage}
          to={`/${user.username}`}
        />
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

