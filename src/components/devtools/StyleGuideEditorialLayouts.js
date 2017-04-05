// @flow
import React from 'react'
import { css, media, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

const editorials = [
  { title: 'Editorial 00', bgc: 'magenta' },
  { title: 'Editorial 01', bgc: 'blue' },
  { title: 'Editorial 02', bgc: 'red' },
  { title: 'Editorial 03', bgc: 'green' },
  { title: 'Editorial 04', bgc: 'purple' },
  { title: 'Editorial 05', bgc: 'olive' },
  { title: 'Editorial 06', bgc: 'teal' },
  { title: 'Editorial 07', bgc: 'orange' },
  { title: 'Editorial 08', bgc: 'darkolivegreen' },
  { title: 'Editorial 10', bgc: 'darkred' },
  { title: 'Editorial 11', bgc: 'palevioletred' },
  { title: 'Editorial 12', bgc: 'midnightblue' },
  { title: 'Editorial 13', bgc: 'peru' },
  { title: 'Editorial 14', bgc: 'salmon' },
  { title: 'Editorial 15', bgc: 'slategrey' },
  { title: 'Editorial 16', bgc: 'steelblue' },
  { title: 'Editorial 17', bgc: 'rebeccapurple' },
  { title: 'Editorial 18', bgc: 'lightcoral' },
  { title: 'Editorial 19', bgc: 'orangered' },
  { title: 'Editorial 20', bgc: 'plum' },
  { title: 'Editorial 21', bgc: 'mediumorchid' },
  { title: 'Editorial 22', bgc: 'mediumslateblue' },
  { title: 'Editorial 23', bgc: 'saddlebrown' },
  { title: 'Editorial 24', bgc: 'seagreen' },
  { title: 'Editorial 25', bgc: 'goldenrod' },
]

// -------------------------------------

const sectionStyle = css(s.flex, s.flexWrap, s.justifySpaceAround, s.wrapperPaddingX, s.pb40)
const footerStyle = css(s.fullWidth, s.selfStart)
const footerHeadingStyle = css(s.fontSize18)
const footerListStyle = css({ maxWidth: 640 })

// -------------------------------------

const moduleStyle = css(
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fullWidth,
  s.fullHeight,
  s.transitionOpacity,
  parent('.hideDebugModules', { opacity: 0.1 }),
)

type ModuleProps = {
  bgc: string,
  title: string,
}

const Module = (props: ModuleProps) =>
  <div className={moduleStyle} style={{ backgroundColor: props.bgc }}>
    <span>{props.title}</span>
  </div>

// -------------------------------------

const outlineStyle = css({ outline: '1px dashed black' })
const pushRightStyle = css(media(s.minBreak2, s.mr10), media(s.minBreak4, s.mr20))
const pushDownStyle = css(s.mb5, media(s.minBreak2, s.mb20), media(s.minBreak4, s.mb40))
const pushLeftStyle = css(media(s.minBreak2, s.ml10), media(s.minBreak4, s.ml20))
const pushRightAndLeftStyle = css(pushRightStyle, pushLeftStyle)

const cellStyle = css(s.flex, s.flexWrap, s.fullWidth, s.overflowHidden, s.colorWhite)
const outerCellStyle = css(cellStyle, pushDownStyle, { height: 360 }, outlineStyle)
const innerCellStyle = css(
  cellStyle,
  { height: 360 },
  media(s.minBreak2, { height: 'calc(50% - 10px)' }),
  media(s.minBreak4, { height: 'calc(50% - 20px)' }),
)

// Cells
const cellStyle66Break2 = media(s.minBreak2, { width: 'calc(66.66666% - 10px)' })
const cellStyle66Break4 = media(s.minBreak4, { width: 'calc(66.66666% - 20px)' })
const cellStyle50Break2 = media(s.minBreak2, { width: 'calc(50% - 10px)' })
const cellStyle50Break4 = media(s.minBreak4, { width: 'calc(50% - 20px)' })
const cellStyle33Break2 = media(s.minBreak2, { width: 'calc(33.33333% - 10px)' })
const cellStyle33Break4 = media(s.minBreak4, { width: 'calc(33.33333% - 20px)' })
const cellStyle32Break2 = media(s.minBreak2, { width: 'calc(32.33333% - 10px)' })
const cellStyle32Break4 = media(s.minBreak4, { width: 'calc(32.33333% - 20px)' })

// Row (maybe layout1.row1 instead? Need to see if height is variable between media queries)
const row360 = css(media(s.minBreak2, { height: 360 }))
const row420 = css(media(s.minBreak2, { height: 420 }))
const row640 = css(media(s.minBreak2, { height: 640 }))
const row840 = css(media(s.minBreak2, { height: 840 }))

// -------------------------------------
const layout1 = {
  cell00: css(outerCellStyle, cellStyle66Break2, cellStyle66Break4, row420, pushRightStyle),
  cell01: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row420, pushLeftStyle),
  cell02: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row840, pushRightStyle),
  cell03: css(outerCellStyle, cellStyle66Break2, cellStyle66Break4, row840, pushLeftStyle),
  cell04: css(outerCellStyle, /* cellStyle100Break2, */ /* cellStyle100Break4, */ row420),
  cell05: css(outerCellStyle, cellStyle50Break2, cellStyle50Break4, row420, pushRightStyle),
  cell06: css(outerCellStyle, cellStyle50Break2, cellStyle50Break4, row420, pushLeftStyle),
  cell07: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row420, pushRightStyle),
  cell08: css(outerCellStyle, cellStyle32Break2, cellStyle32Break4, row420, pushRightAndLeftStyle),
  cell09: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row420, pushLeftStyle),
  cell10: css(outerCellStyle, cellStyle66Break2, cellStyle66Break4, row840, pushRightStyle),
  cell11: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row840, pushLeftStyle),
  cell12: css(outerCellStyle, /* cellStyle100Break2, */ /* cellStyle100Break4, */ row360),
  cell13: css(outerCellStyle, cellStyle50Break2, cellStyle50Break4, row420, pushRightStyle),
  cell14: css(outerCellStyle, cellStyle50Break2, cellStyle50Break4, row420, pushLeftStyle),
  cell15: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row420, pushRightStyle),
  cell16: css(outerCellStyle, cellStyle66Break2, cellStyle66Break4, row420, pushLeftStyle),
  cell17: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row640, pushRightStyle),
  cell18: css(outerCellStyle, cellStyle32Break2, cellStyle32Break4, row640, pushRightAndLeftStyle),
  cell19: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row640, pushLeftStyle),
  cell20: css(outerCellStyle, cellStyle66Break2, cellStyle66Break4, row840, pushRightStyle),
  cell21: css(outerCellStyle, cellStyle33Break2, cellStyle33Break4, row840, pushLeftStyle),
}

type CellProps = {
  className: string,
  children?: React.Element<*>,
}

const Cell = (props: CellProps) =>
  <div className={props.className}>
    {props.children}
  </div>

Cell.defaultProps = {
  children: null,
}

// -------------------------------------
// TODO: We should be able to generate this including the nesting from `layout1`
export default() =>
  <section className={sectionStyle}>
    <Cell className={layout1.cell00}>
      <Module {...editorials[0]} />
    </Cell>
    <Cell className={layout1.cell01}>
      <Module {...editorials[1]} />
    </Cell>
    <Cell className={layout1.cell02}>
      <Cell className={`${innerCellStyle} ${pushDownStyle}`}>
        <Module {...editorials[2]} />
      </Cell>
      <Cell className={innerCellStyle}>
        <Module {...editorials[3]} />
      </Cell>
    </Cell>
    <Cell className={layout1.cell03}>
      <Module {...editorials[4]} />
    </Cell>
    <Cell className={layout1.cell04}>
      <Module {...editorials[5]} />
    </Cell>
    <Cell className={layout1.cell05}>
      <Module {...editorials[6]} />
    </Cell>
    <Cell className={layout1.cell06}>
      <Module {...editorials[7]} />
    </Cell>
    <Cell className={layout1.cell07}>
      <Module {...editorials[8]} />
    </Cell>
    <Cell className={layout1.cell08}>
      <Module {...editorials[9]} />
    </Cell>
    <Cell className={layout1.cell09}>
      <Module {...editorials[10]} />
    </Cell>
    <Cell className={layout1.cell10}>
      <Cell className={`${innerCellStyle} ${pushDownStyle}`}>
        <Module {...editorials[11]} />
      </Cell>
      <Cell className={innerCellStyle}>
        <Module {...editorials[12]} />
      </Cell>
    </Cell>
    <Cell className={layout1.cell11}>
      <Module {...editorials[13]} />
    </Cell>
    <Cell className={layout1.cell12}>
      <Module {...editorials[14]} />
    </Cell>
    <Cell className={layout1.cell13}>
      <Module {...editorials[15]} />
    </Cell>
    <Cell className={layout1.cell14}>
      <Module {...editorials[16]} />
    </Cell>
    <Cell className={layout1.cell15}>
      <Module {...editorials[17]} />
    </Cell>
    <Cell className={layout1.cell16}>
      <Module {...editorials[18]} />
    </Cell>
    <Cell className={layout1.cell17}>
      <Module {...editorials[19]} />
    </Cell>
    <Cell className={layout1.cell18}>
      <Module {...editorials[20]} />
    </Cell>
    <Cell className={layout1.cell19}>
      <Module {...editorials[21]} />
    </Cell>
    <Cell className={layout1.cell20}>
      <Cell className={`${innerCellStyle} ${pushDownStyle}`}>
        <Module {...editorials[22]} />
      </Cell>
      <Cell className={innerCellStyle}>
        <Module {...editorials[23]} />
      </Cell>
    </Cell>
    <Cell className={layout1.cell21}>
      <Module {...editorials[24]} />
    </Cell>

    <footer className={footerStyle}>
      <h2 className={footerHeadingStyle}>Notes:</h2>
      <ol className={footerListStyle}>
        <li>Cells have a dashed outline, they are for <strong>layouts</strong></li>
        <li>
          Modules (Editorials) have a colored background, they are for <strong>content</strong>
        </li>
        <li>
          The shortcut keys of <code>g</code> <code>a</code> will dim the
          Modules (easier to see Cells)
        </li>
        <li>There are 25 Modules in 22 Cells</li>
        <li>Editorials 02 and 03 are nested in a parent cell</li>
        <li>Editorials 12 and 13 are nested in a parent cell</li>
        <li>Editorials 23 and 24 are nested in a parent cell</li>
        <li>
          Nested Editorials must stay in their parent cell wrapper. The wrapper
          is required to split the cell vertically. This means on larger screen
          sizes when Editorial 02 moves up to the first row, Editorial 03 will
          have to travel to the first row with 02.
        </li>
        <li>Current demo covers mobile and laptop layouts only.</li>
      </ol>
    </footer>
  </section>

