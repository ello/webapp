import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isElloAndroid } from '../../lib/jello'
import {
  BoltIcon,
  CircleIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  SparklesIcon,
} from '../assets/Icons'
import {
  NavbarLabel,
  NavbarLayoutTool,
  NavbarLink,
  NavbarMark,
  NavbarMorePostsButton,
  NavbarOmniButton,
  NavbarProfile,
} from './NavbarParts'
import { CategoryTabBar } from '../tabs/CategoryTabBar'
import NotificationsContainer from '../../containers/NotificationsContainer'
import { css, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const navbarStyle = css(
  s.fixed,
  { top: 0, right: 0, left: 0 },
  s.zNavbar,
  s.p10,
  s.bgcWhite,
  { transition: 'transform 150ms ease, height 150ms ease, background-color 0s' },
  parent('.isLoggedIn', { height: 85 }),
  parent('.isLoggedOut', { height: 50 }),
  select('.isOnboardingView ~ &', s.displayNone),
  select('.isNavbarHidden ~ &',
    s.bgcTransparent,
    {
      transitionDelay: '0s, 0s, 150ms',
      transform: 'translate3d(0, -100%, 0)',
    },
  ),
  media(s.minBreak2,
    s.p20,
    parent('.isLoggedIn', { height: 80 }),
    parent('.isLoggedOut', { height: 80 }),
    select('.no-touch .isNavbarHidden ~ &:hover', s.bgcWhite, s.transformNone, { transitionDelay: '0s' }),
    select('.no-touch .isNavbarHidden ~ .Discover + &:hover', { transitionDelay: '1.5s' }),
    select('.no-touch .isNavbarHidden ~ &::after',
      s.absolute,
      { right: 0, bottom: -15, left: 0, height: 15 },
      { content: '""', backgroundColor: 'rgba(0, 0, 0, 0)' },
    ),
  ),
  media(s.minBreak4, s.px40),
)

const mainStyle = css(
  { transition: 'opacity 0s' },
  parent('.isNavbarHidden ~ .Navbar', s.opacity0, { transitionDelay: '150ms' }),
  media(s.minBreak2,
    parent('.no-touch .isNavbarHidden ~ .Navbar:hover', s.opacity1, { transitionDelay: '0s' }),
    parent('.no-touch .isNavbarHidden ~ .Discover + .Navbar:hover', { transitionDelay: '1.5s' }),
  ),
)

const linksStyle = css(
  s.absolute,
  { top: 7 },
  s.nowrap,
  parent('.isLoggedIn', { left: 10 }),
  parent('.isLoggedOut', { right: 10 }),
  media(s.minBreak2,
    parent('.isLoggedIn', { top: '50%', right: 80, left: 'auto', marginTop: -20 }),
    parent('.isLoggedOut', { top: '50%', right: 20, marginTop: -20 }),
  ),
  media(s.minBreak4,
    parent('.isLoggedIn', { right: 100 }),
    parent('.isLoggedOut', { right: 40 }),
  ),
)

export const NavbarLoggedOut = ({
  categoryTabs,
  hasLoadMoreButton,
  onClickLoadMorePosts,
  onClickNavbarMark,
  pathname,
}, { onClickLogin, onClickSignup }) =>
  <nav className={`Navbar ${navbarStyle}`} role="navigation" >
    <div className={`NavbarMain ${mainStyle}`}>
      <NavbarMark onClick={onClickNavbarMark} />
      <NavbarLabel />
      {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
      <div className={`NavbarLinks ${linksStyle}`}>
        <NavbarLink
          className="LabelOnly"
          icon={<SparklesIcon />}
          label="Discover"
          pathname={pathname}
          to="/discover"
        />
        <NavbarLink
          className="IconOnly"
          icon={<SearchIcon />}
          label="Search"
          pathname={pathname}
          to="/search"
        />
        <NavbarLink
          className="LabelOnly"
          label="Log in"
          onClick={onClickLogin}
          pathname={pathname}
          to="/enter"
        />
        <NavbarLink
          className="LabelOnly isSignUp"
          label="Sign up"
          onClick={onClickSignup}
          pathname={pathname}
          to="/join"
        />
      </div>
    </div>
    {categoryTabs ? <CategoryTabBar pathname={pathname} tabs={categoryTabs} /> : null}
  </nav>

NavbarLoggedOut.propTypes = {
  categoryTabs: PropTypes.array,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  onClickLoadMorePosts: PropTypes.func.isRequired,
  onClickNavbarMark: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
}
NavbarLoggedOut.defaultProps = {
  categoryTabs: null,
}
NavbarLoggedOut.contextTypes = {
  onClickLogin: PropTypes.func.isRequired,
  onClickSignup: PropTypes.func.isRequired,
}

export const NavbarLoggedIn = ({
  avatar,
  categoryTabs,
  deviceSize,
  hasLoadMoreButton,
  isGridMode,
  isLayoutToolHidden,
  isNotificationsActive,
  isNotificationsUnread,
  isProfileMenuActive,
  notificationCategory,
  onClickAvatar,
  onClickLoadMorePosts,
  onClickNavbarMark,
  onClickNotification,
  onClickOmniButton,
  onClickToggleLayoutMode,
  onDragLeaveStreamLink,
  onDragOverOmniButton,
  onDragOverStreamLink,
  onDropStreamLink,
  onLogOut,
  pathname,
  username,
}) =>
  <nav className={`Navbar ${navbarStyle}`} role="navigation" >
    <div className={`NavbarMain ${mainStyle}`}>
      <NavbarMark onClick={onClickNavbarMark} />
      <NavbarOmniButton
        onClick={onClickOmniButton}
        onDragOver={onDragOverOmniButton}
      />
      {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
      <div className={`NavbarLinks ${linksStyle}`}>
        { deviceSize === 'mobile' &&
          <NavbarLink
            className="LabelOnly"
            label="Editorial"
            pathname={pathname}
            to="/"
          />
        }
        <NavbarLink
          className="LabelOnly"
          icon={<SparklesIcon />}
          label="Discover"
          pathname={pathname}
          to="/discover"
        />
        <NavbarLink
          className="LabelOnly"
          icon={<CircleIcon />}
          label="Following"
          onDragLeave={onDragLeaveStreamLink}
          onDragOver={onDragOverStreamLink}
          onDrop={onDropStreamLink}
          pathname={pathname}
          to="/following"
        />
        <NavbarLink
          className={classNames('IconOnly', { isNotificationsUnread })}
          icon={<BoltIcon />}
          label="Notifications"
          onClick={isElloAndroid() || deviceSize === 'mobile' ? null : onClickNotification}
          pathname={pathname}
          to={`/notifications${notificationCategory}`}
        />
        <NavbarLink
          className="IconOnly"
          icon={<SearchIcon />}
          label="Search"
          pathname={pathname}
          to="/search"
        />
      </div>
      <NavbarProfile
        avatar={avatar}
        isProfileMenuActive={isProfileMenuActive}
        onClickAvatar={onClickAvatar}
        onLogOut={onLogOut}
        username={username}
      />
      {deviceSize === 'mobile' && !isLayoutToolHidden ?
        <NavbarLayoutTool
          icon={isGridMode ? <ListIcon /> : <GridIcon />}
          onClick={onClickToggleLayoutMode}
        /> : null
      }
      {deviceSize !== 'mobile' && isNotificationsActive ?
        <NotificationsContainer isModal /> : null
      }
    </div>
    {categoryTabs ? <CategoryTabBar pathname={pathname} tabs={categoryTabs} /> : null}
  </nav>

NavbarLoggedIn.propTypes = {
  avatar: PropTypes.object,
  categoryTabs: PropTypes.array,
  deviceSize: PropTypes.string.isRequired,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  isGridMode: PropTypes.bool,
  isLayoutToolHidden: PropTypes.bool.isRequired,
  isNotificationsActive: PropTypes.bool.isRequired,
  isNotificationsUnread: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
  notificationCategory: PropTypes.string.isRequired,
  onClickAvatar: PropTypes.func.isRequired,
  onClickLoadMorePosts: PropTypes.func.isRequired,
  onClickNavbarMark: PropTypes.func.isRequired,
  onClickNotification: PropTypes.func.isRequired,
  onClickOmniButton: PropTypes.func.isRequired,
  onClickToggleLayoutMode: PropTypes.func.isRequired,
  onDragLeaveStreamLink: PropTypes.func.isRequired,
  onDragOverOmniButton: PropTypes.func.isRequired,
  onDragOverStreamLink: PropTypes.func.isRequired,
  onDropStreamLink: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  username: PropTypes.string,
}
NavbarLoggedIn.defaultProps = {
  avatar: null,
  categoryTabs: null,
  isGridMode: false,
  username: null,
}

