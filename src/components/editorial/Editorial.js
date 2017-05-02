// @flow
import React from 'react'
import { MainView } from '../views/MainView'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const moduleStyle = css(
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fullWidth,
  { height: '100vw', maxHeight: 420 },
  s.transitionOpacity,
)

type ModuleProps = {
  bgc: string,
  title: string,
}

const Module = (props: ModuleProps) => (
  <div className={moduleStyle} style={{ backgroundColor: props.bgc }}>
    <span>{props.title}</span>
  </div>
)

// -------------------------------------

const textStyle = css(s.fontSize18, s.colorA)
const sectionStyle = css(
  s.flex,
  s.flexWrap,
  s.justifySpaceAround,
  s.wrapperPaddingX,
  { maxWidth: 1360 },
  s.mxAuto,
  s.pb40,
)

type Props = {
  modules: Array<ModuleProps>,
}

export default(props: Props) => (
  <MainView className="Editorial">
    <h1 className={textStyle}>Editorial</h1>
    <section className={sectionStyle}>
      { props.modules.map(mod => <Module {...mod} />) }
    </section>
  </MainView>
)

