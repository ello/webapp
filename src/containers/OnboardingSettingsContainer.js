import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { trackEvent } from '../actions/analytics'
import { saveAvatar, saveCover } from '../actions/profile'
import {
  selectAvatar,
  selectCoverImage,
  selectIsAvatarBlank,
  selectIsCoverImageBlank,
  selectIsInfoFormBlank,
} from '../selectors/profile'
import OnboardingSettings from '../components/onboarding/OnboardingSettings'


function mapStateToProps(state) {
  const avatar = selectAvatar(state)
  const coverImage = selectCoverImage(state)
  const isAvatarBlank = selectIsAvatarBlank(state)
  const isCoverImageBlank = selectIsCoverImageBlank(state)
  const isInfoFormBlank = selectIsInfoFormBlank(state)
  const isNextDisabled = isAvatarBlank && isCoverImageBlank && isInfoFormBlank
  return {
    avatar,
    coverImage,
    isAvatarBlank,
    isCoverImageBlank,
    isNextDisabled,
  }
}

class OnboardingSettingsContainer extends Component {

  static propTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isAvatarBlank: PropTypes.bool.isRequired,
    isCoverImageBlank: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired,
  }

  static childContextTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    isAvatarBlank: PropTypes.bool,
    isCoverImageBlank: PropTypes.bool,
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func,
    saveAvatar: PropTypes.func,
    saveCover: PropTypes.func,
  }

  getChildContext() {
    const {
      avatar, dispatch, coverImage, isAvatarBlank, isCoverImageBlank, isNextDisabled,
    } = this.props
    return {
      avatar,
      coverImage,
      isAvatarBlank,
      isCoverImageBlank,
      nextLabel: 'Invite Cool People',
      onDoneClick: isNextDisabled ? null : this.onDoneClick,
      onNextClick: this.onNextClick,
      saveAvatar: bindActionCreators(saveAvatar, dispatch),
      saveCover: bindActionCreators(saveCover, dispatch),
    }
  }

  shouldComponentUpdate() {
    return true
  }

  onDoneClick = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('Onboarding.Settings.Done.Clicked'))
    this.trackOnboardingEvents()
    dispatch(push('/following'))
  }

  onNextClick = () => {
    const { dispatch } = this.props
    this.trackOnboardingEvents()
    dispatch(push('/onboarding/invitations'))
  }

  trackOnboardingEvents = () => {
    const { dispatch, isAvatarBlank, isCoverImageBlank } = this.props
    if (!isAvatarBlank) {
      dispatch(trackEvent('Onboarding.Settings.Avatar.Completed'))
    }
    if (!isCoverImageBlank) {
      dispatch(trackEvent('Onboarding.Settings.CoverImage.Completed'))
    }
    if (document.getElementById('name').value.length) {
      dispatch(trackEvent('Onboarding.Settings.Name.Completed'))
    }
    if (document.getElementById('unsanitized_short_bio').value.length) {
      dispatch(trackEvent('Onboarding.Settings.Bio.Completed'))
    }
    if (document.getElementById('external_links').value.length) {
      dispatch(trackEvent('Onboarding.Settings.Links.Completed'))
    }
  }

  render() {
    return <OnboardingSettings isNextDisabled={this.props.isNextDisabled} />
  }
}

export default connect(mapStateToProps)(OnboardingSettingsContainer)

