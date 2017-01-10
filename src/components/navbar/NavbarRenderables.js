import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { isElloAndroid } from '../../lib/jello'
import {
  NavbarLabel,
  NavbarLayoutTool,
  NavbarLink,
  NavbarMark,
  NavbarMorePostsButton,
  NavbarOmniButton,
  NavbarProfile,
} from './NavbarParts'
import {
  BoltIcon,
  CircleIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
} from './NavbarIcons'
import { CategoryTabBar } from '../tabs/CategoryTabBar'
// yuck..
import NotificationsContainer from '../../containers/notifications/NotificationsContainer'

export const NavbarLoggedOut = ({
  categoryTabs,
  homeStream,
  hasLoadMoreButton,
  isLoggedIn,
  onClickLoadMorePosts,
  onClickNavbarMark,
  pathname,
}) =>
  <nav className="Navbar" role="navigation" >
    <div className="NavbarMain">
      <NavbarMark
        homeStream={homeStream}
        isLoggedIn={isLoggedIn}
        onClick={onClickNavbarMark}
      />
      <NavbarLabel />
      {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
      <div className="NavbarLinks">
        <NavbarLink
          className="LabelOnly"
          icon={<SparklesIcon />}
          label="Discover"
          pathname={pathname}
          to="/"
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
          pathname={pathname}
          to="/enter"
        />
        <NavbarLink
          className="LabelOnly isSignUp"
          label="Sign up"
          pathname={pathname}
          to="/join"
        />
      </div>
    </div>
    {categoryTabs ? <CategoryTabBar pathname={pathname} tabs={categoryTabs} /> : null}
  </nav>

NavbarLoggedOut.propTypes = {
  categoryTabs: PropTypes.array,
  homeStream: PropTypes.string.isRequired,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClickLoadMorePosts: PropTypes.func.isRequired,
  onClickNavbarMark: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
}
NavbarLoggedOut.defaultProps = {
  categoryTabs: null,
}

export const NavbarLoggedIn = ({
  avatar,
  categoryTabs,
  homeStream,
  deviceSize,
  hasLoadMoreButton,
  isGridMode,
  isLayoutToolHidden,
  isLoggedIn,
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
      <NavbarMark
        homeStream={homeStream}
        isLoggedIn={isLoggedIn}
        onClick={onClickNavbarMark}
      />
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
          className=""
          icon={<StarIcon />}
          label="Starred"
          onDragLeave={onDragLeaveStreamLink}
          onDragOver={onDragOverStreamLink}
          onDrop={onDropStreamLink}
          pathname={pathname}
          to="/starred"
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
        <NotificationsContainer /> : null
      }
    </div>
    {categoryTabs ? <CategoryTabBar pathname={pathname} tabs={categoryTabs} /> : null}
  </nav>

NavbarLoggedIn.propTypes = {
  avatar: PropTypes.object,
  categoryTabs: PropTypes.array,
  homeStream: PropTypes.string.isRequired,
  deviceSize: PropTypes.string.isRequired,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  isGridMode: PropTypes.bool,
  isLayoutToolHidden: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
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

