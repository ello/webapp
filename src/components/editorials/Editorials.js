// @flow
import React from 'react'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const moduleStyle = css(
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fullWidth,
  s.mb20,
  { height: '100vw', maxHeight: 420 },
  s.transitionOpacity,
)

type ModuleProps = {
  editorialId: string,
}

const Module = (props: ModuleProps) => (
  <div className={moduleStyle} style={{ backgroundColor: 'magenta' }}>
    <span>{props.editorialId}</span>
  </div>
)

// -------------------------------------

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
  editorialIds: Array<string>,
}

export default(props: Props) => (
  <section className={sectionStyle}>
    { props.editorialIds.map(id => <Module key={`module-${id}`} editorialId={id} />) }
  </section>
)

