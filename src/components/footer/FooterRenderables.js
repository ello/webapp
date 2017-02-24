// @flow
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { ChevronIcon, ListIcon, GridIcon } from '../assets/Icons'
import { FooterForm, FooterLink, FooterTool } from '../footer/FooterParts'

type LinkType = {
  label: string,
  to: string,
}

type FooterPropTypes = {
  formActionPath: string,
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
    className={classNames('Footer', { isPaginatoring })}
    role="contentinfo"
  >
    <div className="FooterLinks">
      { links.map(link =>
        <FooterLink
          className="asLabel"
          href={link.to}
          label={link.label}
          key={`FooterLink_${link.label}`}
        />,
      )}
    </div>
    <div className="FooterTools">
      { !isLoggedIn &&
        <FooterForm
          {...{ formActionPath, isDisabled: isFormDisabled, isMobile }}
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

