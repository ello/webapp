import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class ContentWarningButton extends Component {

  static propTypes = {
    contentWarning: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.state = {
      isOpen: false,
    }
  }

  onClickToggle = () => {
    const { isOpen } = this.state
    const newIsOpen = !isOpen
    this.setState({ isOpen: newIsOpen })
  }

  render() {
    const { contentWarning } = this.props
    const { isOpen } = this.state
    const classes = classNames('ContentWarningButton', { isOpen })
    return (
      <button className={classes} onClick={this.onClickToggle}>
        <span className="ContentWarningButtonMessage">
          {contentWarning}
        </span>
        <span className="ContentWarningButtonStateLabel">
          {isOpen ? 'Hide' : 'View'}
        </span>
      </button>
    )
  }
}

