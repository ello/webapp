import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { ChevronIcon, ListIcon, GridIcon } from '../assets/Icons'
import { FooterForm, FooterLink, FooterTool } from '../footer/FooterParts'

export const Footer = ({
  formActionPath,
  isGridMode,
  isLayoutToolHidden,
  isLoggedIn,
  isMobile,
  isFormDisabled,
  isPaginatoring,
  links,
}, {
  onClickScrollToTop,
  onClickToggleLayoutMode,
}) =>
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

Footer.propTypes = {
  formActionPath: PropTypes.string.isRequired,
  isFormDisabled: PropTypes.bool.isRequired,
  isGridMode: PropTypes.bool.isRequired,
  isLayoutToolHidden: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isPaginatoring: PropTypes.bool.isRequired,
  links: PropTypes.array.isRequired,
}

Footer.contextTypes = {
  onClickScrollToTop: PropTypes.func.isRequired,
  onClickToggleLayoutMode: PropTypes.func.isRequired,
}

export default Footer

