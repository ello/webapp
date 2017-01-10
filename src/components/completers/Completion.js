import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { getSelectionContainerElement } from '../editor/SelectionUtil'

export default class Completion extends Component {

  static propTypes = {
    asset: PropTypes.element.isRequired,
    className: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  onClickCompletion = (e) => {
    const { onClick } = this.props
    const node = getSelectionContainerElement()
    onClick({ value: this.getValue(), e })
    if (node) { node.focus() }
  }

  getValue() {
    return this.props.label
  }

  render() {
    const { asset, label, className } = this.props
    return (
      <button
        className={classNames('Completion', className)}
        onClick={this.onClickCompletion}
      >
        {asset}
        <span className="CompletionLabel">{label}</span>
      </button>
    )
  }
}

