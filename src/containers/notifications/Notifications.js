import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { scrollTo } from '../../lib/jello'
import Session from '../../lib/session'
import { selectPropsPathname } from '../../selectors/routing'
import { selectAnnouncement } from '../../selectors/notifications'
import { selectStreamType } from '../../selectors/stream'
import { trackEvent } from '../../actions/analytics'
import { loadNotifications, markAnnouncementRead } from '../../actions/notifications'
import StreamContainer from '../../containers/StreamContainer'
import { LOAD_STREAM_SUCCESS } from '../../constants/action_types'
import { SESSION_KEYS } from '../../constants/application_types'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListLinks } from '../../components/tabs/TabList'
import { Paginator } from '../../components/streams/Paginator'
import { MainView } from '../../components/views/MainView'
import { AnnouncementNotification } from '../../components/notifications/NotificationRenderables'

function mapStateToProps(state, props) {
  const announcement = selectAnnouncement(state)
  const type = get(props, 'params.type', 'all')
  return {
    announcementBody: announcement.get('body'),
    announcementCTACaption: announcement.get('ctaCaption', 'Learn More'),
    announcementCTAHref: announcement.get('ctaHref'),
    announcementImage: announcement.getIn(['image', 'hdpi', 'url']),
    announcementTitle: announcement.get('header'),
    hasAnnouncementNotification: !!(announcement.size),
    pathname: selectPropsPathname(state, props),
    streamAction: loadNotifications({ category: type }),
    streamType: selectStreamType(state),
    type,
  }
}

class Notifications extends Component {

  static propTypes = {
    announcementBody: PropTypes.string,
    announcementCTAHref: PropTypes.string,
    announcementCTACaption: PropTypes.string,
    announcementImage: PropTypes.string,
    announcementTitle: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    hasAnnouncementNotification: PropTypes.bool.isRequired,
    pathname: PropTypes.string,
    streamAction: PropTypes.object,
    type: PropTypes.string,
  }

  static defaultProps = {
    announcementBody: '',
    announcementCTACaption: null,
    announcementCTAHref: null,
    announcementImage: null,
    announcementTitle: '',
    pathname: null,
    streamAction: null,
    type: 'all',
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadNotifications({ category: routerState.params.type }))

  static childContextTypes = {
    onClickAnnouncementNotification: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickAnnouncementNotification: this.onClickAnnouncementNotification,
    }
  }

  componentWillMount() {
    this.saveCategory()
    this.state = { isReloading: false }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamType === LOAD_STREAM_SUCCESS) {
      this.setState({ isReloading: false })
    }
  }

  componentDidUpdate() {
    this.saveCategory()
  }

  onClickTab = ({ type }) => {
    if (this.state.activeTabType === type) {
      scrollTo(0, 0)
      this.setState({ isReloading: true })
    }
    this.setState({ activeTabType: type })
  }

  onClickAnnouncementNotification = (e) => {
    const { announcementBody, announcementTitle, dispatch } = this.props
    const trackType = (e.target.classList.contains('AnnouncementNotificationCTA')) ? 'clicked' : 'closed'
    const trackAction = trackEvent(`announcement_${trackType}`, { name: announcementTitle || announcementBody })
    if (trackType === 'closed') {
      dispatch(markAnnouncementRead())
    }
    dispatch(trackAction)
  }

  saveCategory() {
    const { type } = this.props
    if (type) {
      Session.setItem(SESSION_KEYS.NOTIFICATIONS_FILTER, type)
    } else {
      Session.removeItem(SESSION_KEYS.NOTIFICATIONS_FILTER)
    }
  }

  render() {
    const {
      announcementBody,
      announcementCTACaption,
      announcementCTAHref,
      announcementImage,
      announcementTitle,
      hasAnnouncementNotification,
      pathname,
      streamAction,
      type,
    } = this.props
    const { isReloading } = this.state
    const tabs = [
      { to: '/notifications', type: 'all', children: 'All' },
      { to: '/notifications/comments', type: 'comments', children: <BubbleIcon /> },
      { to: '/notifications/mentions', type: 'mentions', children: '@' },
      { to: '/notifications/loves', type: 'loves', children: <HeartIcon /> },
      { to: '/notifications/reposts', type: 'reposts', children: <RepostIcon /> },
      { to: '/notifications/relationships', type: 'relationships', children: <RelationshipIcon /> },
    ]
    return (
      <MainView className="Notifications">
        <TabListLinks
          activePath={pathname}
          className="IconTabList NotificationsContainerTabs"
          onTabClick={this.onClickTab}
          tabClasses="IconTab"
          tabs={tabs}
        />
        {
          isReloading ?
            <Paginator
              className="NotificationReload"
              isHidden={false}
            /> :
            null
        }
        { hasAnnouncementNotification &&
          <AnnouncementNotification
            body={announcementBody}
            ctaCaption={announcementCTACaption}
            ctaHref={announcementCTAHref}
            src={announcementImage}
            title={announcementTitle}
          />
        }
        <StreamContainer
          action={streamAction}
          className="isFullWidth"
          key={`notificationView_${type}`}
          scrollSessionKey={`notifications_${type}`}
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(Notifications)

