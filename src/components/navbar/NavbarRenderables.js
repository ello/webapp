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

export const NavbarLoggedOut = ({
  categoryTabs,
  hasLoadMoreButton,
  onClickLoadMorePosts,
  onClickNavbarMark,
  pathname,
}, { onClickLogin, onClickSignup }) =>
  <nav className="Navbar" role="navigation" >
    <div className="NavbarMain">
      <NavbarMark onClick={onClickNavbarMark} />
      <NavbarLabel />
      {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
      <div className="NavbarLinks">
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
  <nav className="Navbar" role="navigation" >
    <div className="NavbarMain">
      <NavbarMark onClick={onClickNavbarMark} />
      <NavbarOmniButton
        onClick={onClickOmniButton}
        onDragOver={onDragOverOmniButton}
      />
      {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
      <div className="NavbarLinks">
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

