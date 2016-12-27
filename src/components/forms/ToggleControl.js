import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'

class ToggleControl extends Component {

  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    isChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
  }

  componentWillMount() {
    const { isChecked } = this.props
    this.state = {
      checked: isChecked,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isChecked } = nextProps
    const { checked } = this.state
    if (checked !== isChecked && typeof isChecked !== 'undefined') {
      this.setState({
        checked: isChecked,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isChecked } = nextProps
    if (typeof isChecked === 'undefined') { return false }
    return shallowCompare(this, nextProps, nextState)
  }

  onChangeControl = () => {
    const { onChange, id } = this.props
    const { checked } = this.state
    const newCheckedState = !checked
    this.setState({ checked: newCheckedState })
    if (typeof onChange === 'function') {
      onChange({ [id]: newCheckedState })
    }
  }

  render() {
    const { className, id, isDisabled } = this.props
    const { checked } = this.state
    return (
      <label
        className={classNames('ToggleControl', className, { isChecked: checked })}
        disabled={isDisabled}
        htmlFor={id}
      >
        <input
          checked={checked}
          className="invisible"
          id={id}
          onChange={this.onChangeControl}
          type="checkbox"
        />
        <span>{checked ? 'Yes' : 'No'}</span>
      </label>
    )
  }

}

export default ToggleControl

