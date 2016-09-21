import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { scrollTo } from '../../vendor/jello'
import { selectPropsPathname } from '../../selectors/routing'
import { selectStreamType } from '../../selectors/stream'
import { loadNotifications } from '../../actions/notifications'
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
import Session from '../../../src/vendor/session'
import { MainView } from '../../components/views/MainView'

class Notifications extends Component {

  static propTypes = {
    category: PropTypes.string,
    pathname: PropTypes.string,
    streamAction: PropTypes.object,
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadNotifications(routerState.params))

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

  saveCategory() {
    const { category } = this.props
    if (category) {
      Session.setItem(SESSION_KEYS.NOTIFICATIONS_FILTER, category)
    } else {
      Session.removeItem(SESSION_KEYS.NOTIFICATIONS_FILTER)
    }
  }

  render() {
    const { category, pathname, streamAction } = this.props
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
              totalPages={0}
              totalPagesRemaining={0}
            /> :
            null
        }
        <StreamContainer
          action={streamAction}
          className="isFullWidth"
          key={`notificationView_${category}`}
          scrollSessionKey={`notifications_${category}`}
        />
      </MainView>
    )
  }
}

function mapStateToProps(state, props) {
  const category = _.get(props, 'params.category', 'all')
  return {
    category,
    pathname: selectPropsPathname(state, props),
    streamAction: loadNotifications({ category }),
    streamType: selectStreamType(state),
  }
}

export default connect(mapStateToProps)(Notifications)

