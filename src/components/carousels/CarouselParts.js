// @flow
import React from 'react'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const slidesStyle = css(
  s.flex,
  s.fullWidth,
  s.fullHeight,
  s.overflowScrollWebX,
  s.borderGreen,
)

type SlidesProps = {
  children: React.Element<*>,
}

export const Slides = (props: SlidesProps) => (
  <div className={slidesStyle} data-type="Slides">
    {props.children}
  </div>
)

// -------------------------------------

const slideStyle = css(
  s.flex,
  { minWidth: '100%' },
  s.fullWidth,
  s.fullHeight,
  s.borderBlack,
)

type SlideProps = {
  children: React.Element<*>,
}

export const Slide = (props: SlideProps) => (
  <article className={slideStyle} data-type="Slide">
    { props.children }
  </article>
)

