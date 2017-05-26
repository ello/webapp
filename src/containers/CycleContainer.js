// @flow
import React, { PureComponent } from 'react'
import { List } from 'immutable'

// TODO:
// 1. Fix naming (limit, etc.)
// 2. Pass `limit` explicitly instead of passing and infering from children
// 3. Only render when necessary
// 4. Only compose necessary props for composed component

const constrainIndex = (index, limit, isContinuous) => {
  if (isContinuous) {
    if (limit && index > limit) { return 0 }
    if (limit && index < 0) { return limit }
  } else {
    if (limit && index > limit) { return limit }
    if (limit && index < 0) { return 0 }
  }
  return index
}

type Props = {
  children: List<*>,
  isContinuous: boolean,
  limit?: number,
  startIndex: number,
}

type State = {
  index: number,
  limit: number,
}

export default (ComposedComponent: any) => (
  class extends PureComponent {
    props: Props
    state: State = {
      index: this.props.startIndex,
      limit: this.props.limit || (this.props.children && this.props.children.size - 1) || 0,
    }

    static defaultProps = {
      isContinuous: false,
      limit: null,
      startIndex: 0,
    }

    goto = (newIndex: number) => {
      const { isContinuous } = this.props
      const { index, limit } = this.state
      const nextIndex = constrainIndex(newIndex, limit, isContinuous)
      if (index !== nextIndex) {
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

