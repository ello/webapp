import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {
  selectProfileIsCollaborateable,
  selectProfileIsHireable,
} from 'ello-brains/selectors/profile'
import { trackEvent } from 'ello-brains/actions/analytics'
import { preferenceToggleChanged } from '../helpers/junk_drawer'
import OnboardingCollaborate from '../components/onboarding/OnboardingCollaborate'

const prefs = [
  {
    id: 'isHireable',
    term: 'Get Hired',
    desc: 'Enable brands, publications, and people that want to pay you for your work to email you.',
  },
  {
    id: 'isCollaborateable',
    term: 'Collaborate',
    desc: 'Enable fellow creators that want to collaborate to email you.',
  },
]

function mapStateToProps(state) {
  return {
    isCollaborateable: selectProfileIsCollaborateable(state),
    isHireable: selectProfileIsHireable(state),
  }
}

class OnboardingCollaborateContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isCollaborateable: PropTypes.bool.isRequired,
    isHireable: PropTypes.bool.isRequired,
  }

  static childContextTypes = {
    nextLabel: PropTypes.string,
    onDoneClick: PropTypes.func,
    onNextClick: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      nextLabel: 'Invite Cool People',
      onDoneClick: this.onDoneClick,
      onNextClick: this.onNextClick,
    }
  }

  shouldComponentUpdate() {
    return false
  }

  onDoneClick = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('Onboarding.Collaborate.Done.Clicked'))
    this.trackOnboardingEvents()
    dispatch(push('/following'))
  }

  onNextClick = () => {
    const { dispatch } = this.props
    this.trackOnboardingEvents()
    dispatch(push('/onboarding/invitations'))
  }

  trackOnboardingEvents = () => {
    const { dispatch, isCollaborateable, isHireable } = this.props
    if (isCollaborateable) {
      dispatch(trackEvent('Onboarding.Collaborate.isCollaborateable.Yes'))
    }
    if (isHireable) {
      dispatch(trackEvent('Onboarding.Collaborate.isHireable.Yes'))
    }
  }

  render() {
    return (
      <OnboardingCollaborate
        onToggleChange={preferenceToggleChanged}
        prefs={prefs}
      />
    )
  }
}

export default connect(mapStateToProps)(OnboardingCollaborateContainer)

