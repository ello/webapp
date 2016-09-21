import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { GUI, LOAD_STREAM_REQUEST, LOAD_STREAM_SUCCESS } from '../../constants/action_types'
import { scrollTo } from '../../vendor/jello'
import { selectActiveNotificationsType } from '../../selectors/gui'
import { selectStreamType } from '../../selectors/stream'
import { toggleNotifications } from '../../actions/gui'
import { loadNotifications } from '../../actions/notifications'
import StreamContainer from '../../containers/StreamContainer'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListButtons } from '../../components/tabs/TabList'
import { Paginator } from '../../components/streams/Paginator'
import Session from '../../vendor/session'

function mapStateToProps(state) {
  const activeTabType = selectActiveNotificationsType(state)
  return {
    activeTabType,
    streamAction: loadNotifications({ category: activeTabType }),
    streamType: selectStreamType(state),
  }
}

class NotificationsContainer extends Component {

  static propTypes = {
    activeTabType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    streamAction: PropTypes.object,
    streamType: PropTypes.string,
  }

  static defaultProps = {
    activeTabType: 'all',
  }

  componentWillMount() {
    this.body = document.body
    this.state = { isReloading: false }
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickDocument)
    document.addEventListener('touchstart', this.onClickDocument)
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

  render() {
    const { activeTabType, streamAction } = this.props
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
                totalPages={0}
                totalPagesRemaining={0}
              /> :
              null
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

