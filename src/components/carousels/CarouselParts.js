// @flow
import React, { Children } from 'react'
import { ArrowIcon } from '../assets/Icons'
import { css, hover, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const slidesStyle = css(
  s.flex,
  s.fullWidth,
  s.fullHeight,
  s.overflowScrollWebX,
)

type SlidesProps = {
  children?: React.Element<*>,
}

export const Slides = (props: SlidesProps) => (
  <div className={slidesStyle} data-slides >
    {props.children}
  </div>
)

Slides.defaultProps = {
  children: null,
}

// -------------------------------------

const slideStyle = css(
  s.flex,
  { minWidth: '100%' },
  s.fullWidth,
  s.fullHeight,
)

type SlideProps = {
  children?: React.Element<*>,
}

export const Slide = (props: SlideProps) => (
  <article className={slideStyle}>
    { props.children }
  </article>
)

Slide.defaultProps = {
  children: null,
}

// -------------------------------------

type CarouselProps = {
  children?: React.Element<*>,
}

export const Carousel = (props: CarouselProps) => {
  const children = Children.map(props.children, child => (
    <Slide>
      {child}
    </Slide>
  ))
  return (
    <Slides>
      {children}
    </Slides>
  )
}

Carousel.defaultProps = {
  children: null,
}

// -------------------------------------

const paddleStyle = css(
  s.wv30,
  s.hv30,
  s.transitionColor,
  s.colorWhite,
  hover(s.colorA),
)

const nextPaddleStyle = css(
  { ...paddleStyle },
)

export const NextPaddle = (props: any) => (
  <button className={nextPaddleStyle} type="button" {...props} >
    <ArrowIcon />
  </button>
)

const prevPaddleStyle = css(
  { ...paddleStyle },
  select('& > .ArrowIcon', s.rotate180),
)

export const PrevPaddle = (props: any) => (
  <button className={prevPaddleStyle} type="button" {...props} >
    <ArrowIcon />
  </button>
)

