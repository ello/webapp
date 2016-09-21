import React, { PropTypes } from 'react'
import Promotion from '../assets/Promotion'
import { ZeroStream } from '../zeros/Zeros'
import UserContainer from '../../containers/UserContainer'
import BackgroundImage from '../assets/BackgroundImage'

const HeroProfile = ({ dpi, sources, userId, useGif }) =>
  <div className="HeroImage">
    <BackgroundImage
      className="hasOverlay inHero"
      sources={sources}
      dpi={dpi}
      useGif={useGif}
    />
    <UserContainer userId={userId} type="profile" />
  </div>

HeroProfile.propTypes = {
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
  userId: PropTypes.string,
  useGif: PropTypes.bool,
}

const Hero = (props) => {
  const { dpi } = props
  const { broadcast, onDismissZeroStream } = props
  const { hasPromotion, isLoggedIn, onClickTrackCredits, promotion } = props
  const { sources, hasCoverProfile, userId, useGif } = props

  const getHeroImage = () => {
    if (hasPromotion) {
      return (
        <Promotion
          coverDPI={dpi}
          isLoggedIn={isLoggedIn}
          onClickTrackCredits={onClickTrackCredits}
          promotion={promotion}
        />
      )
    } else if (userId && hasCoverProfile) {
      return <HeroProfile dpi={dpi} sources={sources} userId={userId} useGif={useGif} />
    }
    return null
  }

  // Render the Hero...
  return (
    <div className="Hero" >
      { broadcast ?
        <ZeroStream onDismiss={onDismissZeroStream}>{broadcast}</ZeroStream> : null
      }
      { getHeroImage() }
    </div>
  )
}

Hero.propTypes = {
  broadcast: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  hasCoverProfile: PropTypes.bool,
  hasPromotion: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  onClickTrackCredits: PropTypes.func.isRequired,
  onDismissZeroStream: PropTypes.func.isRequired,
  promotion: PropTypes.object,
  sources: PropTypes.object,
  useGif: PropTypes.bool,
  userId: PropTypes.string,
}

export default Hero

