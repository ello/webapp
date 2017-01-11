import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { ElloMark } from '../assets/Icons'

const OnboardingNavbar = (props, context) => {
  const { isNextDisabled } = props
  const { nextLabel = 'Continue', onDoneClick, onNextClick } = context
  return (
    <header className="OnboardingNavbar">
      <ElloMark />
      <button
        className={classNames('OnboardingNextButton RoundedButton', { hasDone: !!onDoneClick })}
        disabled={isNextDisabled}
        onClick={onNextClick}
      >
        {nextLabel}
      </button>
      {onDoneClick ?
        <button className="OnboardingDoneButton" onClick={onDoneClick} >{'I\'m Done'}</button>
        : null
      }
    </header>
  )
}

OnboardingNavbar.propTypes = {
  isNextDisabled: PropTypes.bool,
}
OnboardingNavbar.defaultProps = {
  isNextDisabled: false,
}
OnboardingNavbar.contextTypes = {
  nextLabel: PropTypes.string,
  onDoneClick: PropTypes.func,
  onNextClick: PropTypes.func.isRequired,
}

export default OnboardingNavbar

