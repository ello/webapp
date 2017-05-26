// @flow
import React, { Component } from 'react'
import { scrollToPosition } from '../../lib/jello'
import CycleContainer from '../../containers/CycleContainer'
import TimerContainer from '../../containers/TimerContainer'
import { addScrollTarget, removeScrollTarget } from '../viewport/ScrollComponent'
import { Carousel, NextPaddle, PrevPaddle } from './CarouselParts'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

// TODO:
// 1. Fix naming (limit, etc.)
// 2. Cache DOM lookup
// 3. Handle scroll events to update the current slide index
// 4. Test resize

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
  index: number,
  isContinuous: boolean,
  limit: number,
  tickCount: number,
  next: () => {},
  previous: () => {},
  start: () => {},
  stop: () => {},
  goto: () => {},
}

type ScrollProps = {
  scrollPercentX: number,
  scrollScreenX: number,
  // scrollWidth: number,
  // scrollX: number,
}

class EditorialComponent extends Component {
  props: EditorialComponentProps
  scrollable: any | null
  scrollObject: any | null
  wrapper: any | null
  scrollScreenX: number
  isScrolling: boolean

  componentWillReceiveProps(nextProps) {
    if (this.props.tickCount !== nextProps.tickCount) {
      // this.props.next()
    }
    if (this.props.index !== nextProps.index && !this.isScrolling) {
      const wrapperWidth = getWrapperWidth(this.wrapper)
      if (this.scrollable) {
        this.isScrolling = true
        console.log('stuff', this.props.index, nextProps.index, wrapperWidth, wrapperWidth * nextProps.index)
        scrollToPosition(wrapperWidth * nextProps.index, 0, {
          el: this.scrollable,
          onComplete: () => { this.isScrolling = false },
        })
      }
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

  // onScrollTarget = (props: ScrollProps) => {
  //   const { limit } = this.props
  //   const { scrollX, scrollWidth, scrollScreenX, scrollPercentX } = props

  //   const oldPercent = Math.abs((scrollPercentX * (limit + 1)) - ((scrollScreenX + 1) * 100))

  //   const scrollMax = Math.round((scrollWidth / (limit + 1)) / (scrollScreenX + 1))
  //   const percent = getScrollPercent(0, scrollMax, scrollX)

  //   if (percent !== 0) {
  //     console.log('onScrollTarget', oldPercent)
  //   }
  // }

  onScrollCompleteTarget = (props: ScrollProps) => {
    if (this.isScrolling) { return }
    const { limit, next, previous } = this.props
    const { scrollScreenX, scrollPercentX } = props
    const percent = Math.abs((scrollPercentX * (limit + 1)) - ((scrollScreenX + 1) * 100))

    if (percent > 0 && percent < 50 && props.scrollDirection === 'right') {
      console.log('onScrollCompleteTarget next', percent, props, this.props.index, props.scrollScreenX)
      next()
    } else if (percent >= 50 && percent < 100 && props.scrollDirection === 'left') {
      console.log('onScrollCompleteTarget previous', percent, props, this.props.index, props.scrollScreenX)
      previous()
    }
  }

  setElements = (comp) => {
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
      <div className={editorialWrapperStyle} ref={this.setElements} >
        <Carousel>
          {children}
        </Carousel>
        <nav className={editorialNavStyle}>
          { (isContinuous || index !== 0) &&
            <PrevPaddle onClick={this.onClickPrevious} />
          }
          { (isContinuous || index !== limit) &&
            <NextPaddle onClick={this.onClickNext} />
          }
        </nav>
      </div>
    )
  }
}

// eslint-disable-next-line import/prefer-default-export
export const EditorialCarousel = TimerContainer(CycleContainer(EditorialComponent))

