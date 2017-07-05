import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {
  selectAvatar,
  selectCoverImage,
  selectIsAvatarBlank,
  selectIsCoverImageBlank,
  selectIsInfoFormBlank,
} from 'ello-brains/selectors/profile'
import { selectDPI, selectIsMobile } from 'ello-brains/selectors/gui'
import { trackEvent } from 'ello-brains/actions/analytics'
import { saveAvatar, saveCover } from 'ello-brains/actions/profile'
import OnboardingSettings from '../components/onboarding/OnboardingSettings'


function mapStateToProps(state) {
  const avatar = selectAvatar(state)
  const coverImage = selectCoverImage(state)
  const dpi = selectDPI(state)
  const isAvatarBlank = selectIsAvatarBlank(state)
  const isCoverImageBlank = selectIsCoverImageBlank(state)
  const isMobile = selectIsMobile(state)
  const isInfoFormBlank = selectIsInfoFormBlank(state)
  const isNextDisabled = isAvatarBlank && isCoverImageBlank && isInfoFormBlank
  return {
    avatar,
    coverImage,
    dpi,
    isAvatarBlank,
    isCoverImageBlank,
    isMobile,
    isNextDisabled,
  }
}

class OnboardingSettingsContainer extends PureComponent {

  static propTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isAvatarBlank: PropTypes.bool.isRequired,
    isCoverImageBlank: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    avatar: null,
    coverImage: null,
  }

  static childContextTypes = {
    avatar: PropTypes.object,
    coverImage: PropTypes.object,
    dpi: PropTypes.string.isRequired,
    isAvatarBlank: PropTypes.bool,
    isCoverImageBlank: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func,
    saveAvatar: PropTypes.func,
    saveCover: PropTypes.func,
  }

  getChildContext() {
    const {
      avatar, dispatch, coverImage, dpi, isAvatarBlank, isCoverImageBlank, isMobile, isNextDisabled,
    } = this.props
    return {
      avatar,
      coverImage,
      dpi,
      isAvatarBlank,
      isCoverImageBlank,
      isMobile,
      nextLabel: 'Get Hired & Collaborate',
      onDoneClick: isNextDisabled ? null : this.onDoneClick,
      onNextClick: this.onNextClick,
      saveAvatar: bindActionCreators(saveAvatar, dispatch),
      saveCover: bindActionCreators(saveCover, dispatch),
    }
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
    dispatch(push('/onboarding/collaborate'))
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

