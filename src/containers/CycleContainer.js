// @flow
import React, { PureComponent } from 'react'

const constrainIndex = (index, limit, isContinuous) => {
  if (isContinuous) {
    if (limit && index >= limit) { return 0 }
    if (limit && index < 0) { return limit }
  } else {
    if (limit && index >= limit) { return limit }
    if (limit && index < 0) { return 0 }
  }
  return index
}

type Props = {
  isContinuous: boolean,
  limit: number,
  startIndex: number,
}

type State = {
  index: number,
}

export default (ComposedComponent: any) => (
  class extends PureComponent {
    props: Props
    state: State = { index: this.props.startIndex }

    static defaultProps = {
      isContinuous: false,
      limit: 0,
      startIndex: 0,
    }

    goto = (newIndex: number) => {
      const { isContinuous, limit } = this.props
      const nextIndex = constrainIndex(newIndex, limit, isContinuous)
      if (this.state.index !== nextIndex) {
        this.setState({ index: nextIndex })
      }
    }

    next = () => {
      this.goto(this.state.index + 1)
    }

    previous = () => {
      this.goto(this.state.index - 1)
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.state}
          goto={this.goto}
          next={this.next}
          previous={this.previous}
        />
      )
    }
  }
)

