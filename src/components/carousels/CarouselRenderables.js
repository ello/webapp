// @flow
import React, { Component } from 'react'
import TWEEN from 'tween.js'
import { scrollToPosition } from '../../lib/jello'
import CycleContainer from '../../containers/CycleContainer'
import TimerContainer from '../../containers/TimerContainer'
import { addScrollTarget, removeScrollTarget } from '../viewport/ScrollComponent'
import { Carousel, NextPaddle, PrevPaddle } from './CarouselParts'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

const getWrapperWidth = wrapper => (wrapper && wrapper.offsetWidth) || 0

const editorialWrapperStyle = css(s.relative, s.fullHeight)
const editorialNavStyle = css(
  s.absolute,
  s.zIndex3,
  { top: 0, right: 0 },
  media(s.minBreak2, { top: 5, right: 5 }),
)

type EditorialComponentProps = {
  children: React.Element<*>,
  goto: () => {},
  index: number,
  isContinuous: boolean,
  limit: number,
  next: () => {},
  previous: () => {},
  start: () => {},
  stop: () => {},
  tickCount: number,
}

type EditorialComponentState = {
  isScrolling: boolean,
}

type ScrollProps = {
  scrollX: number,
}

class EditorialComponent extends Component {
  props: EditorialComponentProps
  state: EditorialComponentState
  scrollObject: {
    component: React.Component<*, EditorialComponentProps, EditorialComponentState>,
    element: React.Element<*>
  } | null
  scrollable: React.Element<*> | null
  wrapper: HTMLElement | null

  state = { isScrolling: false }

  componentWillMount() {
    if (this.props.limit <= 1) {
      this.props.stop()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tickCount !== nextProps.tickCount) {
      this.props.next()
    }
    if (this.props.index !== nextProps.index && this.scrollable) {
      this.scrollToIndex(nextProps.index)
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.isContinuous && nextProps.index !== this.props.index) {
      return true
    }
    return false
  }

  componentWillUnmount() {
    removeScrollTarget(this.scrollObject)
  }

  onClickNext = () => {
    const { next, start, stop } = this.props
    stop()
    next()
    start()
  }

  onClickPrevious = () => {
    const { previous, start, stop } = this.props
    stop()
    previous()
    start()
  }

  onScrollCompleteTarget = (props: ScrollProps) => {
    if (this.state.isScrolling) { return }
    const { goto, index } = this.props
    const { scrollX } = props
    const wrapperWidth = getWrapperWidth(this.wrapper)
    const newIndex = Math.floor((scrollX + (wrapperWidth / 2)) / wrapperWidth)
    if (newIndex !== index) {
      goto(newIndex)
    } else {
      this.scrollToIndex(newIndex)
    }
  }

  scrollToIndex = (index) => {
    const wrapperWidth = getWrapperWidth(this.wrapper)
    this.setState({ isScrolling: true })
    scrollToPosition(wrapperWidth * index, 0, {
      el: this.scrollable,
      onComplete: () => { this.setState({ isScrolling: false }) },
      easing: TWEEN.Easing.Exponential.Out,
      duration: 750,
    })
  }

  addScrollCapabilities = (comp) => {
    if (!this.wrapper) {
      this.wrapper = comp
      this.scrollable = comp.querySelector('[data-slides]')
      this.scrollObject = { component: this, element: this.scrollable }
      addScrollTarget(this.scrollObject)
    }
  }

  render() {
    const { children, index, isContinuous, limit } = this.props
    return (
      <div className={editorialWrapperStyle} ref={this.addScrollCapabilities} >
        <Carousel>
          {children}
        </Carousel>
        { limit > 1 &&
          <nav className={editorialNavStyle}>
            { (isContinuous || index !== 0) &&
              <PrevPaddle onClick={this.onClickPrevious} />
            }
            { (isContinuous || index !== limit) &&
              <NextPaddle onClick={this.onClickNext} />
            }
          </nav>
        }
      </div>
    )
  }
}

// eslint-disable-next-line import/prefer-default-export
export const EditorialCarousel = TimerContainer(CycleContainer(EditorialComponent))

