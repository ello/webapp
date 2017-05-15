// @flow
/* eslint-disable import/prefer-default-export */
import React from 'react'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

type TitleProps = {
  text1: string,
  text2: string,
}

const titleStyle = css(
  { maxWidth: 480, paddingBottom: 23 },
  s.pt10,
  s.px10,
  s.mxAuto,
  s.fontSize16,
  media(s.minBreak2, { paddingTop: 70, paddingBottom: 70 }, s.fontSize24),
)

const text1Style = css(s.colorBlack)
const text2Style = css(s.colorA)

export const Title = (props: TitleProps) => (
  <h1 className={titleStyle}>
    <span className={text1Style}>{props.text1}</span>
    <span className={text2Style}>{props.text2}</span>
  </h1>
)

