import React, { PropTypes } from 'react'
import classNames from 'classnames'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import { ElloOutlineMark } from '../assets/Icons'
import InfoForm from '../forms/InfoForm'
import Uploader from '../uploaders/Uploader'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'

const OnboardingSettings = (props, context) => {
  const { avatar, isAvatarBlank, saveAvatar } = context
  const { coverImage, isCoverImageBlank, saveCover } = context
  const { isNextDisabled } = props
  return (
    <MainView className="Onboarding OnboardingSettings">
      <h1 className="OnboardingHeading">
        <span>Grow your creative influence. </span>
        <span>Completed profiles get way more views.</span>
      </h1>
      <div className="OnboardingCoverPicker">
        <Uploader
          className={classNames('isCoverUploader', { isCoverImageBlank })}
          line1="2560 x 1440"
          line2="Animated Gifs work too"
          saveAction={saveCover}
          title="Upload Header"
        />
        <BackgroundImage
          className="hasOverlay6 inOnboarding"
          sources={coverImage}
          useGif
        />
      </div>
      <div className="OnboardingAvatarPicker" >
        <Uploader
          className={classNames('isAvatarUploader isXLUploader', { isAvatarBlank })}
          title="Upload Avatar"
          line1="360 x 360"
          line2="Animated Gifs work too"
          saveAction={saveAvatar}
        />
        {isAvatarBlank ? <ElloOutlineMark /> : null}
        <Avatar
          className="isXLarge"
          size="large"
          sources={avatar}
          useGif
        />
      </div>
      <InfoForm
        className="OnboardingInfoForm"
        isOnboardingControl
        controlClassModifiers="isOnboardingControl"
        tabIndexStart={1}
      />
      <OnboardingNavbar
        isNextDisabled={isNextDisabled}
      />
    </MainView>
  )
}

OnboardingSettings.propTypes = {
  isNextDisabled: PropTypes.bool,
}
OnboardingSettings.defaultProps = {
  isNextDisabled: false,
}
OnboardingSettings.contextTypes = {
  avatar: PropTypes.object,
  coverImage: PropTypes.object,
  isAvatarBlank: PropTypes.bool,
  isCoverImageBlank: PropTypes.bool,
  saveAvatar: PropTypes.func.isRequired,
  saveCover: PropTypes.func.isRequired,
}

export default OnboardingSettings

