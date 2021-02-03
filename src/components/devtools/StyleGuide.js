import React from 'react'
import { MainView } from '../views/MainView'
// import StyleGuideIcons from './StyleGuideIcons'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

const headerStyle = css(s.wrapperPaddingX, s.pt20, media(s.minBreak2, s.pt40))
const h1Style = css(s.fontSize24)
const navStyle = css(s.flex, s.py20)
const buttonStyle = css(s.fontSize18, s.mr10)

export default () =>
  (<MainView className="StyleGuide">
    <header className={headerStyle}>
      <h1 className={h1Style}>Ello style guide</h1>
      <nav className={navStyle}>
        <button className={buttonStyle}>Icons</button>
      </nav>
    </header>
  </MainView>)

// <StyleGuideIcons />

