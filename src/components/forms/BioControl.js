import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import FormControl from './FormControl'

class BioControl extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  }

  static defaultProps = {
    className: 'BioControl',
    id: 'unsanitized_short_bio',
    label: 'Bio',
    name: 'user[unsanitized_short_bio]',
    placeholder: 'Bio',
  }

  componentWillMount() {
    const { text } = this.props
    this.state = { textLength: text ? text.length : 0 }
  }

  onChangeControl = (vo) => {
    const { id, onChange } = this.props
    const { textLength } = this.state
    const len = vo[id] ? vo[id].length : 0
    if (textLength !== len) {
      this.setState({ textLength: len })
    }
    if (id && typeof onChange === 'function') {
      onChange(vo)
    }
  }

  isValidBioLength() {
    const { textLength } = this.state
    return textLength > 666
  }

  // For consistency we should probably move the checks up to Validators and
  // let the Container control the state. The component is more portable this
  // way but it's still weird. Exceeding isn't really an error either.
  render() {
    const { textLength } = this.state
    const hasExceeded = this.isValidBioLength()
    const label = hasExceeded ? `Bio ${textLength}` : 'Bio'
    return (
      <FormControl
        {...this.props}
        className={classNames({ hasExceeded })}
        autoCapitalize="off"
        autoCorrect="off"
        kind="textarea"
        label={label}
        onChange={this.onChangeControl}
        type="text"
      />
    )
  }
}

export default BioControl

