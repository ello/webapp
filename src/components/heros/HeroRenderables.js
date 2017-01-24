import React, { PropTypes } from 'react'
import BackgroundImage from '../assets/BackgroundImage'
import {
  HeroAppStores,
  HeroPromotionCredits,
  HeroPromotionCTA,
  HeroScrollToContentButton,
  HeroShareUserButton,
} from './HeroParts'
import { ZeroStream } from '../zeros/Zeros'
import UserContainer from '../../containers/UserContainer'

// -------------------------------------

export const HeroBroadcast = ({ broadcast, onDismiss }) =>
  <ZeroStream onDismiss={onDismiss}>{broadcast}</ZeroStream>

HeroBroadcast.propTypes = {
  broadcast: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

// -------------------------------------

export const HeroProfile = ({ dpi, sources, userId, useGif }) =>
  <div className="HeroProfile">
    <BackgroundImage
      className="inHeroProfile hasOverlay6"
      dpi={dpi}
      sources={sources}
      useGif={useGif}
    />
    <UserContainer userId={userId} type="profile" />
    <HeroShareUserButton />
    <HeroScrollToContentButton />
  </div>

HeroProfile.propTypes = {
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
  userId: PropTypes.string,
  useGif: PropTypes.bool.isRequired,
}
HeroProfile.defaultProps = {
  sources: null,
  userId: null,
}

// -------------------------------------

export const HeroPromotionAuth = (props) => {
  const { creditSources, creditUsername, dpi, sources } = props
  return (
    <div className="HeroPromotionAuth fullscreen">
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      {creditUsername ?
        <HeroPromotionCredits sources={creditSources} username={creditUsername} /> : null
      }
      <HeroAppStores />
    </div>
  )
}

HeroPromotionAuth.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
}
HeroPromotionAuth.defaultProps = {
  creditSources: null,
  creditUsername: null,
  sources: null,
}

// -------------------------------------

export const HeroPromotionCategory = (props) => {
  const { creditLabel, creditSources, creditUsername, description, dpi, name, sources } = props
  const { ctaCaption, ctaHref, isLoggedIn, isMobile } = props
  return (
    <div className="HeroPromotion HeroPromotionCategory">
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      <div className="HeroPromotionCaption isCentered">
        <h1 className="HeroPromotionCategoryHeading"><span>{name}</span></h1>
        <p className="HeroPromotionCategoryCopy">{description}</p>
        {!isMobile &&
          <HeroPromotionCTA caption={ctaCaption} isLoggedIn={isLoggedIn} to={ctaHref} />
        }
      </div>
      { isMobile &&
        <div className="HeroPromotionMobileActions">
          <HeroPromotionCTA caption={ctaCaption} isLoggedIn={isLoggedIn} to={ctaHref} />
          {creditUsername &&
            <HeroPromotionCredits
              label={creditLabel}
              sources={creditSources}
              username={creditUsername}
            />
          }
        </div>
      }
      {!isMobile && creditUsername &&
        <HeroPromotionCredits
          label={creditLabel}
          sources={creditSources}
          username={creditUsername}
        />
      }
    </div>
  )
}

HeroPromotionCategory.propTypes = {
  creditLabel: PropTypes.string.isRequired,
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  description: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  sources: PropTypes.object,
}
HeroPromotionCategory.defaultProps = {
  creditSources: null,
  creditUsername: null,
  ctaCaption: null,
  ctaHref: null,
  sources: null,
}

// -------------------------------------

export const HeroPromotionPage = (props) => {
  const { creditSources, creditUsername, dpi, header, sources, subheader } = props
  const { ctaCaption, ctaHref, isLoggedIn } = props
  return (
    <div className="HeroPromotion HeroPromotionPage">
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      <div className="HeroPromotionCaption">
        <h1 className="HeroPromotionHeading">{header}</h1>
        <h2 className="HeroPromotionSubheading">{subheader}</h2>
        <HeroPromotionCTA caption={ctaCaption} isLoggedIn={isLoggedIn} to={ctaHref} />
      </div>
      {creditUsername &&
        <HeroPromotionCredits sources={creditSources} username={creditUsername} />
      }
    </div>
  )
}

HeroPromotionPage.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  sources: PropTypes.object,
  subheader: PropTypes.string.isRequired,
}
HeroPromotionPage.defaultProps = {
  creditSources: null,
  creditUsername: null,
  ctaCaption: null,
  ctaHref: null,
  sources: null,
}

