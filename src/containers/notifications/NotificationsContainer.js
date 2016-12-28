/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GUI, LOAD_STREAM_REQUEST, LOAD_STREAM_SUCCESS } from '../../constants/action_types'
import { scrollTo } from '../../lib/jello'
import Session from '../../lib/session'
import { selectActiveNotificationsType } from '../../selectors/gui'
import { selectAnnouncement } from '../../selectors/notifications'
import { selectStreamType } from '../../selectors/stream'
import { trackEvent } from '../../actions/analytics'
import { toggleNotifications } from '../../actions/gui'
import { loadNotifications, markAnnouncementRead } from '../../actions/notifications'
import StreamContainer from '../../containers/StreamContainer'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListButtons } from '../../components/tabs/TabList'
import { Paginator } from '../../components/streams/Paginator'
import { AnnouncementNotification } from '../../components/notifications/NotificationRenderables'

function mapStateToProps(state) {
  const activeTabType = selectActiveNotificationsType(state)
  const announcement = selectAnnouncement(state)
  return {
    activeTabType,
    // TODO: Update this in Immutable
    announcementId: announcement && announcement.id,
    announcementBody: announcement && announcement.body,
    announcementCTACaption: announcement && (announcement.ctaCaption || 'Learn More'),
    announcementCTAHref: announcement && announcement.ctaHref,
    announcementImage: announcement && announcement.image.hdpi.url,
    announcementTitle: announcement && announcement.header,
    hasAnnouncementNotification: !!(announcement),
    streamAction: loadNotifications({ category: activeTabType }),
    streamType: selectStreamType(state),
  }
}

class NotificationsContainer extends Component {

  static propTypes = {
    activeTabType: PropTypes.string.isRequired,
    announcementId: PropTypes.string,
    announcementBody: PropTypes.string,
    announcementCTAHref: PropTypes.string,
    announcementCTACaption: PropTypes.string,
    announcementImage: PropTypes.string,
    announcementTitle: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    hasAnnouncementNotification: PropTypes.bool,
    streamAction: PropTypes.object,
    streamType: PropTypes.string,
  }

  static defaultProps = {
    activeTabType: 'all',
    announcementId: '',
    announcementBody: '',
    announcementCTAHref: null,
    announcementImage: null,
    announcementTitle: '',
  }

  static childContextTypes = {
    onClickAnnouncementNotification: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickAnnouncementNotification: this.onClickAnnouncementNotification,
    }
  }

  componentWillMount() {
    this.body = document.body
    this.state = { isReloading: false }
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickDocument)
    document.addEventListener('touchstart', this.onClickDocument)
    if (this.props.hasAnnouncementNotification) {
      const { announcementBody, announcementTitle, announcementId, dispatch } = this.props
      const trackTitle = announcementTitle || announcementBody
      const trackProps = { name: trackTitle, announcement: announcementId }
      dispatch(trackEvent('announcement_viewed', trackProps))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamType === LOAD_STREAM_SUCCESS) {
      this.setState({ isReloading: false })
    }
  }

  componentDidUpdate(prevProps) {
    const { activeTabType, streamType } = this.props
    if (this.scrollContainer && prevProps.activeTabType === activeTabType &&
        (streamType === LOAD_STREAM_SUCCESS || streamType === LOAD_STREAM_REQUEST)) {
      const scrollY = Session.getItem(`/notifications/${activeTabType || 'all'}/scrollY`)
      if (scrollY) {
        this.scrollContainer.scrollTop = scrollY
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickDocument)
    document.removeEventListener('touchstart', this.onClickDocument)
  }

  onMouseOver = () => {
    this.body.classList.add('isNotificationsScrolling')
  }

  onMouseOut = () => {
    this.body.classList.remove('isNotificationsScrolling')
  }

  onClickTab = ({ type }) => {
    const { activeTabType, dispatch } = this.props
    if (activeTabType === type) {
      scrollTo(0, 0, { el: this.scrollContainer })
      this.setState({ isReloading: true })
    } else {
      dispatch({
        type: GUI.NOTIFICATIONS_TAB,
        payload: { activeTabType: type },
      })
    }
    this.setState({ activeTabType: type })
  }

  onClickSelf = (e) => {
    if (!e.metaKey && !e.which === 2) {
      e.preventDefault()
    }
    this.ignoreNext = true
    setTimeout(() => { this.ignoreNext = false }, 1)
  }

  onClickDocument = (e) => {
    if (this.ignoreNext) {
      return
    }
    const classList = e.target.classList
    if (classList.contains('TabButton') ||
        classList.contains('RelationshipButton') ||
        classList.contains('StarshipButton')
       ) { return }
    const { dispatch } = this.props
    dispatch(toggleNotifications({ isActive: false }))
  }

  onClickAnnouncementNotification = (e) => {
    const { announcementBody, announcementTitle, announcementId, dispatch } = this.props
    const el = e.target.tagName === 'IMG' ? e.target.parentNode : e.target
    const trackType = el.classList.contains('js-ANCTA') ? 'clicked' : 'closed'
    const trackTitle = announcementTitle || announcementBody
    const trackProps = { name: trackTitle, announcement: announcementId }
    const trackAction = trackEvent(`announcement_${trackType}`, trackProps)
    if (trackType === 'closed') {
      dispatch(markAnnouncementRead())
    }
    dispatch(trackAction)
  }

  render() {
    const {
      activeTabType,
      announcementBody,
      announcementCTACaption,
      announcementCTAHref,
      announcementImage,
      announcementTitle,
      hasAnnouncementNotification,
      streamAction,
    } = this.props
    const { isReloading } = this.state
    const tabs = [
      { type: 'all', children: 'All' },
      { type: 'comments', children: <BubbleIcon /> },
      { type: 'mentions', children: '@' },
      { type: 'loves', children: <HeartIcon /> },
      { type: 'reposts', children: <RepostIcon /> },
      { type: 'relationships', children: <RelationshipIcon /> },
    ]
    return (
      <div
        className="NotificationsContainer"
        onClick={this.onClickSelf}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        <TabListButtons
          activeType={activeTabType}
          className="IconTabList NotificationsContainerTabs"
          onTabClick={this.onClickTab}
          tabClasses="IconTab"
          tabs={tabs}
        />
        <div
          className="Scrollable"
          ref={(comp) => { this.scrollContainer = comp }}
        >
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
            isModalComponent
            key={`notificationView_${activeTabType}_${isReloading}`}
            scrollContainer={this.scrollContainer}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(NotificationsContainer)

