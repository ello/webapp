// @flow
import React, { PureComponent } from 'react'
import random from 'lodash/random'

type Props = {
  autoStart: boolean,
  maxTicks: number,
  timerDuration: number,
  timerRange: number,
}

type State = {
  tickCount: number,
}

const getDuration = (duration, range) => (
  range ? random(duration - range, duration + range) : duration
)

export default (ComposedComponent: any) => (
  class extends PureComponent {
    props: Props
    state: State = { tickCount: 0 }
    timerId: number | null
    duration: number = getDuration(this.props.timerDuration, this.props.timerRange)

    static defaultProps = {
      autoStart: true,
      maxTicks: 0,
      timerDuration: 1000,
      timerRange: 0,
    }

    componentDidMount() {
      if (this.props.autoStart) { this.start() }
    }

    componentWillUnmount() {
      this.stop()
    }

    onTimerComplete = () => {
      const { maxTicks } = this.props
      const nextTickCount = this.state.tickCount + 1
      if (!maxTicks || nextTickCount <= maxTicks) {
        this.tick()
      } else if (maxTicks && nextTickCount >= maxTicks) {
        this.finish()
      }
    }

    start = () => {
      this.stop()
      this.timerId = setTimeout(this.onTimerComplete, this.duration)
    }

    stop = () => {
      if (this.timerId) {
        clearTimeout(this.timerId)
        this.timerId = null
      }
    }

    finish = () => {
      this.stop()
      this.setState({ tickCount: this.props.maxTicks })
    }

    tick = () => {
      this.setState({ tickCount: this.state.tickCount + 1 })
      this.start()
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.state}
          start={this.start}
          stop={this.stop}
          finish={this.finish}
        />
      )
    }
  }
)

