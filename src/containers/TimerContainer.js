// @flow
import React, { PureComponent } from 'react'
import random from 'lodash/random'

// TODO:
// 1. Fix naming
// 2. Allow `timerDuration` configuration as property + `timerRange` setting
// 3. Only render when necessary
// 4. Only compose necessary props for composed component

type Props = {
  autoStart: boolean,
  maxTicks: number,
}

type State = {
  tickCount: number,
}


export default (ComposedComponent: any) => (
  class extends PureComponent {
    props: Props
    state: State = { tickCount: 0 }
    timerId: number | null
    timerDuration: number = 5000

    static defaultProps = {
      autoStart: true,
      maxTicks: 0,
    }

    componentDidMount() {
      this.timerDuration = random(4000, 6666)
      // console.log('timer.create', this.timerDuration, this.props.maxTicks)
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
      this.timerId = setTimeout(this.onTimerComplete, this.timerDuration)
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
      // console.log('timer.finished', this.timerDuration)
    }

    tick = () => {
      this.setState({ tickCount: this.state.tickCount + 1 })
      // console.log('timer.tick', this.timerDuration)
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

