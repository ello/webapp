// @flow
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ChevronIcon, ListIcon, GridIcon } from '../assets/Icons'
import { FooterForm, FooterLink, FooterTool } from '../footer/FooterParts'
import { before, css, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const baseStyle = css(
  s.fixed,
  { right: 0, bottom: 0, left: 0 },
  s.zFooter,
  s.flex,
  s.justifySpaceBetween,
  s.px10,
  { height: 54, lineHeight: 54 },
  s.colorA,
  s.bgcE5,
  { transition: 'transform 150ms ease' },
  modifier('isPaginatoring', { transform: 'translate3d(0, 100%, 0) !important' }),
  select('.isNavbarHidden ~ &', { transform: 'translate3d(0, 100%, 0)' }),
  select('.no-touch .isNavbarHidden ~ &:hover', { transform: 'none' }),
  select('.isAuthenticationView ~ &', s.displayNone),
  select('.isOnboardingView ~ &', s.displayNone),
  media('(max-width: 23.375em)', s.hv40, s.lh40), // 374 and below
  media(s.maxBreak2,
    parent('.isEditorFocused', s.displayNone),
    select('.isProfileMenuActive ~ &', s.displayNone),
  ),
  media(s.minBreak2,
    s.px20,
    select(
      '.no-touch .isNavbarHidden ~ &::before',
      s.absolute,
      { top: -15, right: 0, left: 0, height: 15, content: '""', backgroundColor: 'rgba(0, 0, 0, 0)' },
    ),
  ),
  media(s.minBreak4, s.px40),
)

const linksStyle = css(
  s.relative,
  s.nowrap,
  { flex: 1 },
  { WebkitOverflowScrolling: 'touch', overflowX: 'auto', overflowY: 'hidden' },
)

const toolsStyle = css(
  s.relative,
  s.flex,
  s.justifySpaceBetween,
  s.rightAlign,
  before(
    s.absolute,
    s.zIndex2,
    { top: 0, bottom: 0, left: -20, width: 20, content: '""' },
    { background: 'linear-gradient(to right, rgba(229, 229, 229, 0) 0%, rgba(229, 229, 229, 1) 90%)' },
  ),
  media(s.minBreak4, before(s.displayNone)),
)

type LinkType = {
  label: string,
  to: string,
}

type FooterPropTypes = {
  formActionPath: string,
  formMessage: string,
  formStatus: string,
  isFormDisabled: boolean,
  isGridMode: boolean,
  isLayoutToolHidden: boolean,
  isLoggedIn: boolean,
  isMobile: boolean,
  isPaginatoring: boolean,
  links: Array<LinkType>,
}

type FooterContextTypes = {
  onClickScrollToTop: () => void,
  onClickToggleLayoutMode: () => void,
}

export const Footer = ({
  formActionPath,
  formMessage,
  formStatus,
  isGridMode,
  isLayoutToolHidden,
  isLoggedIn,
  isMobile,
  isFormDisabled,
  isPaginatoring,
  links,
}: FooterPropTypes, {
  onClickScrollToTop,
  onClickToggleLayoutMode,
}: FooterContextTypes) =>
  <footer
    className={classNames(`Footer ${baseStyle}`, { isPaginatoring })}
    role="contentinfo"
  >
    <div className={linksStyle}>
      { links.map(link =>
        <FooterLink
          href={link.to}
          label={link.label}
          key={`FooterLink_${link.label}`}
        />,
      )}
    </div>
    <div className={`FooterTools ${toolsStyle}`}>
      { !isLoggedIn &&
        <FooterForm
          {...{
            formActionPath,
            formMessage,
            formStatus,
            isDisabled: isFormDisabled,
            isMobile,
          }}
        />
      }
      { (isLoggedIn || (!isLoggedIn && !isMobile)) && // TODO: move to FooterContainer
        <FooterTool
          className="TopTool"
          icon={<ChevronIcon />}
          label="Top"
          onClick={onClickScrollToTop}
        />
      }
      {!isLayoutToolHidden && (isLoggedIn || (!isLoggedIn && !isMobile)) &&
        <FooterTool
          className="LayoutTool"
          icon={isGridMode ? <ListIcon /> : <GridIcon />}
          label={isGridMode ? 'List View' : 'Grid View'}
          onClick={onClickToggleLayoutMode}
        />
      }
    </div>
  </footer>

Footer.contextTypes = {
  onClickScrollToTop: PropTypes.func.isRequired,
  onClickToggleLayoutMode: PropTypes.func.isRequired,
}

export default Footer

