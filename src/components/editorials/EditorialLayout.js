// @flow
import { List } from 'immutable'
import React from 'react'
import EditorialContainer from '../../containers/EditorialContainer'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------
// Cells
const outerCell = css(
  s.flex,
  s.flexWrap,
  s.fullWidth,
  { height: '100vw' },
  s.overflowHidden,
)

const nestedCell = css(
  outerCell,
  media(s.minBreak2, { height: 'calc(50% - 10px)' }),
  media(s.minBreak4, { height: 'calc(50% - 20px)' }),
)

const nestedSplitCell = css(
  { ...nestedCell },
  media(s.minBreak2, s.flex2),
)

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
// Grid
const col66 = css(
  media(s.minBreak2, { width: 'calc(66.66666% - 10px)' }),
  media(s.minBreak4, { width: 'calc(66.66666% - 20px)' }),
)

const col33 = css(
  media(s.minBreak2, { width: 'calc(33.33333% - 10px)' }),
  media(s.minBreak4, { width: 'calc(33.33333% - 20px)' }),
)

const col33Middle = css(
  media(s.minBreak2, { width: 'calc(33.33333% - 20px)' }),
  media(s.minBreak4, { width: 'calc(33.33333% - 40px)' }),
)

const row420 = css(media(s.minBreak2, { height: 420 }))
const row840 = css(media(s.minBreak2, { height: 840 }))

const pushRight = css(media(s.minBreak2, s.mr10), media(s.minBreak4, s.mr20))
const pushDown = css(s.mb10, media(s.minBreak2, s.mb20), media(s.minBreak4, s.mb40))
const pushLeft = css(media(s.minBreak2, s.ml10), media(s.minBreak4, s.ml20))
const pushRightAndLeft = css(media(s.minBreak2, s.mx10), media(s.minBreak4, s.mx20))

// -------------------------------------

const sectionStyle = css(
  s.flex,
  s.flexWrap,
  s.mxAuto,
  { maxWidth: 1360 },
  media(s.minBreak2, s.px20),
  media('(min-width: 87.5em)', s.px0), // 1400px
)

export default({ ids }: { ids: List<string> }) => (
  <section className={sectionStyle}>
    { /* Row 1 */ }
    { ids.get(0) &&
      <Cell className={`${outerCell} ${col66} ${row420} ${pushDown} ${pushRight}`}>
        <EditorialContainer editorialId={ids.get(0)} />
      </Cell>
    }
    { ids.get(1) &&
      <Cell className={`${outerCell} ${col33} ${row420} ${pushDown} ${pushLeft}`}>
        <EditorialContainer editorialId={ids.get(1)} />
      </Cell>
    }

    { /* Row 2 */ }
    { ids.get(2) &&
      <Cell className={`${outerCell} ${col33} ${row420} ${pushDown} ${pushRight}`}>
        <EditorialContainer editorialId={ids.get(2)} />
      </Cell>
    }
    { ids.get(3) &&
      <Cell className={`${outerCell} ${col33Middle} ${row420} ${pushDown} ${pushRightAndLeft}`}>
        <EditorialContainer editorialId={ids.get(3)} />
      </Cell>
    }
    { ids.get(4) &&
      <Cell className={`${outerCell} ${col33} ${row420} ${pushDown} ${pushLeft}`}>
        <EditorialContainer editorialId={ids.get(4)} />
      </Cell>
    }

    { /* Row 3 */ }
    { ids.get(5) &&
      <Cell className={`${outerCell} ${col66} ${row840} ${pushDown} ${pushRight}`}>
        <EditorialContainer editorialId={ids.get(5)} />
      </Cell>
    }
    { ids.get(6) &&
      <Cell className={`${outerCell} ${col33} ${row840} ${pushDown} ${pushLeft}`}>
        <Cell className={`${nestedCell} ${pushDown}`}>
          <EditorialContainer editorialId={ids.get(6)} />
        </Cell>
        { ids.get(7) &&
          <Cell className={nestedCell}>
            <EditorialContainer editorialId={ids.get(7)} />
          </Cell>
        }
      </Cell>
    }

    { /* Row 4 */ }
    { ids.get(8) &&
      <Cell className={`${outerCell} ${col33} ${row840} ${pushDown} ${pushRight}`}>
        <EditorialContainer editorialId={ids.get(8)} />
      </Cell>
    }
    { ids.get(9) &&
      <Cell className={`${outerCell} ${col66} ${row840} ${pushDown} ${pushLeft}`}>
        <Cell className={`${nestedCell} ${pushDown}`}>
          <EditorialContainer editorialId={ids.get(9)} />
        </Cell>
        { ids.get(10) &&
          <Cell className={`${nestedSplitCell} ${pushDown} ${pushRight}`}>
            <EditorialContainer editorialId={ids.get(10)} />
          </Cell>
        }
        { ids.get(11) &&
          <Cell className={`${nestedSplitCell} ${pushDown} ${pushLeft}`}>
            <EditorialContainer editorialId={ids.get(11)} />
          </Cell>
        }
      </Cell>
    }

    { /* Reverse */ }

    { /* Row 5 (1) */ }
    { ids.get(12) &&
      <Cell className={`${outerCell} ${col33} ${row420} ${pushDown} ${pushRight}`}>
        <EditorialContainer editorialId={ids.get(12)} />
      </Cell>
    }
    { ids.get(13) &&
      <Cell className={`${outerCell} ${col66} ${row420} ${pushDown} ${pushLeft}`}>
        <EditorialContainer editorialId={ids.get(13)} />
      </Cell>
    }

    { /* Row 6 (2) */ }
    { ids.get(14) &&
      <Cell className={`${outerCell} ${col33} ${row420} ${pushDown} ${pushRight}`}>
        <EditorialContainer editorialId={ids.get(14)} />
      </Cell>
    }
    { ids.get(15) &&
      <Cell className={`${outerCell} ${col33Middle} ${row420} ${pushDown} ${pushRightAndLeft}`}>
        <EditorialContainer editorialId={ids.get(15)} />
      </Cell>
    }
    { ids.get(16) &&
      <Cell className={`${outerCell} ${col33} ${row420} ${pushDown} ${pushLeft}`}>
        <EditorialContainer editorialId={ids.get(16)} />
      </Cell>
    }

    { /* Row 7 (3) */ }
    { ids.get(17) &&
      <Cell className={`${outerCell} ${col33} ${row840} ${pushDown} ${pushRight}`}>
        <Cell className={`${nestedCell} ${pushDown}`}>
          <EditorialContainer editorialId={ids.get(17)} />
        </Cell>
        { ids.get(18) &&
          <Cell className={nestedCell}>
            <EditorialContainer editorialId={ids.get(18)} />
          </Cell>
        }
      </Cell>
    }
    { ids.get(19) &&
      <Cell className={`${outerCell} ${col66} ${row840} ${pushDown} ${pushLeft}`}>
        <EditorialContainer editorialId={ids.get(19)} />
      </Cell>
    }

    { /* Row 8 (4) */ }
    { ids.get(20) &&
      <Cell className={`${outerCell} ${col66} ${row840} ${pushDown} ${pushRight}`}>
        <Cell className={`${nestedCell} ${pushDown}`}>
          <EditorialContainer editorialId={ids.get(20)} />
        </Cell>
        { ids.get(21) &&
          <Cell className={`${nestedSplitCell} ${pushDown} ${pushRight}`}>
            <EditorialContainer editorialId={ids.get(21)} />
          </Cell>
        }
        { ids.get(22) &&
          <Cell className={`${nestedSplitCell} ${pushDown} ${pushLeft}`}>
            <EditorialContainer editorialId={ids.get(22)} />
          </Cell>
        }
      </Cell>
    }
    { ids.get(23) &&
      <Cell className={`${outerCell} ${col33} ${row840} ${pushDown} ${pushLeft}`}>
        <EditorialContainer editorialId={ids.get(23)} />
      </Cell>
    }
  </section>
)

