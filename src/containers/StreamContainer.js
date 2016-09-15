import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import shallowCompare from 'react-addons-shallow-compare'
import { debounce, get } from 'lodash'
import classNames from 'classnames'
import scrollTop from '../vendor/scrolling'
import { runningFetches } from '../sagas/requester'
import * as ACTION_TYPES from '../constants/action_types'
import { SESSION_KEYS } from '../constants/application_types'
import {
  selectColumnCount,
  selectHistory,
  selectInnerHeight,
  selectInnerWidth,
  selectIsGridMode,
} from '../selectors/gui'
import { selectPathname } from '../selectors/routing'
import { findModel } from '../helpers/json_helper'
import {
  addScrollObject,
  addScrollTarget,
  removeScrollObject,
  removeScrollTarget,
} from '../components/viewport/ScrollComponent'
import { ElloMark } from '../components/svg/ElloIcons'
import { Paginator } from '../components/streams/Paginator'
import { ErrorState4xx } from '../components/errors/Errors'
import { makeSelectStreamProps } from '../selectors/stream'
import Session from '../vendor/session'

export function makeMapStateToProps() {
  const getStreamProps = makeSelectStreamProps()
  const mapStateToProps = (state, props) => {
    const streamProps = getStreamProps(state, props)
    return {
      ...streamProps,
      columnCount: selectColumnCount(state),
      history: selectHistory(state),
      innerHeight: selectInnerHeight(state),
      innerWidth: selectInnerWidth(state),
      json: state.json,
      isGridMode: selectIsGridMode(state),
      omnibar: state.omnibar,
      pathname: selectPathname(state),
      routerState: state.routing.location.state || {},
      stream: state.stream,
    }
  }
  return mapStateToProps
}

class StreamContainer extends Component {

  static propTypes = {
    action: PropTypes.object,
    children: PropTypes.any,
    className: PropTypes.string,
    columnCount: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    ignoresScrollPosition: PropTypes.bool.isRequired,
    initModel: PropTypes.object,
    innerHeight: PropTypes.number,
    innerWidth: PropTypes.number,
    isGridMode: PropTypes.bool,
    isModalComponent: PropTypes.bool,
    json: PropTypes.object.isRequired,
    omnibar: PropTypes.object,
    paginatorText: PropTypes.string,
    pathname: PropTypes.string,
    renderObj: PropTypes.object.isRequired,
    result: PropTypes.object.isRequired,
    resultPath: PropTypes.string,
    routerState: PropTypes.object,
    scrollContainer: PropTypes.object,
    scrollSessionKey: PropTypes.string,
    stream: PropTypes.object.isRequired,
  }

  static defaultProps = {
    paginatorText: 'Loading',
    ignoresScrollPosition: false,
    isModalComponent: false,
  }

  componentWillMount() {
    const { action, dispatch, omnibar, pathname } = this.props
    if (typeof window !== 'undefined' && action) {
      dispatch(action)
    }

    let browserListen
    if (browserHistory) {
      browserListen = browserHistory.listen
    } else {
      browserListen = (listener) => {
        listener({ key: 'testing' })
        return () => null
      }
    }
    const unlisten = browserListen(location => {
      this.state = { action, locationKey: /\/search/.test(pathname) ? '/search' : location.key }
    })
    unlisten()
    this.setScroll = debounce(this.setScroll, 300)
    this.setScrollTarget = debounce(this.setScrollTarget, 300)
    this.shouldScroll = true
    this.wasOmnibarActive = omnibar.isActive
  }

  componentDidMount() {
    const { isModalComponent, routerState, scrollContainer } = this.props
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    if (isModalComponent && scrollContainer) {
      this.scrollObject = { component: this, element: scrollContainer }
      addScrollTarget(this.scrollObject)
    } else if (!isModalComponent) {
      this.scrollObject = this
      addScrollObject(this.scrollObject)
    }

    const shouldScrollToTop = true
    if (routerState.didComeFromSeeMoreCommentsLink) {
      this.saveScroll = false
    } else {
      this.saveScroll = true
    }
    this.attemptToRestoreScroll(shouldScrollToTop)
  }

  componentWillReceiveProps(nextProps) {
    const { stream } = nextProps
    const { action } = this.state
    if (this.props.isModalComponent && !this.props.scrollContainer && nextProps.scrollContainer) {
      this.scrollObject = { component: this, element: nextProps.scrollContainer }
      addScrollTarget(this.scrollObject)
    }
    if (!action) { return }
    if (stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      this.setState({ hidePaginator: true })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { stream } = nextProps
    const { action } = nextState
    const updateKey = get(action, 'meta.updateKey')
    const streamPath = get(stream, 'payload.endpoint.path', '')
    // this prevents nested stream components from clobbering parents
    if (updateKey && !streamPath.match(updateKey)) {
      return false
      // when hitting the back button the result can update and
      // try to feed wrong results to the actions render method
      // thus causing errors when trying to render wrong results
    } else if (nextProps.resultPath !== this.props.resultPath) {
      return false
    } else if (nextProps.isGridMode !== this.props.isGridMode) {
      return true
    } else if (this.props.columnCount !== nextProps.columnCount && nextProps.isGridMode) {
      return true
      // allow page loads to fall through and also allow stream
      // load requests to fall through to show the loader
      // on an initial page load when endpoints don't match
    } else if (!/LOAD_NEXT_CONTENT|POST\.|COMMENT\./.test(stream.type) &&
              stream.type !== ACTION_TYPES.LOAD_STREAM_REQUEST &&
              streamPath !== get(action, 'payload.endpoint.path')) {
      return false
    }
    return shallowCompare(this, nextProps, nextState)
  }


  componentDidUpdate() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }

    const { action } = this.state
    const { innerHeight, stream, omnibar } = this.props
    const canScroll = document.body.scrollHeight > innerHeight
    const shouldScroll = this.shouldScroll && (canScroll ||
      (stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS &&
       action && action.payload &&
       stream.payload.endpoint.path === action.payload.endpoint.path))
    if (shouldScroll) {
      if (this.attemptToRestoreScroll()) {
        this.shouldScroll = false
      }
    }
    this.wasOmnibarActive = omnibar.isActive
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
    removeScrollObject(this.scrollObject)
    removeScrollTarget(this.scrollObject)
    this.saveScroll = false
  }

  onScroll() {
    this.setScroll()
  }

  onScrollTarget() {
    this.setScrollTarget()
  }

  onScrollBottom() {
    const path = get(this.state, 'action.payload.endpoint.path')
    if (path && !/lovers|reposters/.test(path)) {
      this.onLoadNextPage()
    }
  }

  onScrollBottomTarget() {
    this.onLoadNextPage()
  }

  onLoadNextPage = () => {
    this.loadPage('next')
  }

  setAction(action) {
    this.setState({ action })
    this.props.dispatch(action)
  }

  setScroll() {
    if (!this.saveScroll) { return }
    const { dispatch } = this.props
    const scrollTopValue = scrollTop(window)

    dispatch({
      type: ACTION_TYPES.GUI.SET_SCROLL,
      payload: {
        key: this.state.locationKey,
        scrollTop: scrollTopValue,
      },
    })
  }

  setScrollTarget() {
    if (!this.saveScroll) { return }
    const { scrollContainer, scrollSessionKey } = this.props
    let scrollTopValue
    if (scrollContainer) {
      scrollTopValue = scrollTop(scrollContainer)
    }
    if (scrollSessionKey) {
      const sessionStorageKey = SESSION_KEYS.scrollLocationKey(scrollSessionKey)
      Session.setItem(sessionStorageKey, scrollTopValue)
    }
  }

  attemptToRestoreScroll(fromMount = false) {
    const { innerHeight, history, routerState, scrollContainer, isModalComponent } = this.props
    let scrollTopValue = null
    if (!routerState.didComeFromSeeMoreCommentsLink && !this.props.ignoresScrollPosition) {
      if (fromMount && !isModalComponent) {
        window.scrollTo(0, 0)
        return false
      }

      this.saveScroll = true

      let sessionScrollLocation = null
      if (this.props.scrollSessionKey) {
        const sessionStorageKey = SESSION_KEYS.scrollLocationKey(this.props.scrollSessionKey)
        sessionScrollLocation = parseInt(Session.getItem(sessionStorageKey), 10)
      }

      if (sessionScrollLocation !== null) {
        scrollTopValue = sessionScrollLocation
      } else if (history[this.state.locationKey]) {
        const historyObj = history[this.state.locationKey]
        scrollTopValue = historyObj.scrollTop
      }
    } else if (routerState.didComeFromSeeMoreCommentsLink) {
      this.saveScroll = true
      scrollTopValue = document.body.scrollHeight - innerHeight
    }

    if (scrollTopValue) {
      requestAnimationFrame(() => {
        if (!this.saveScroll) {
          return
        }

        if (isModalComponent) {
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollTopValue
          }
        } else if (typeof window !== 'undefined') {
          window.scrollTo(0, scrollTopValue)
        }
      })
      return true
    }
    return false
  }

  loadPage(rel) {
    const { dispatch, result, stream } = this.props
    const { action } = this.state
    if (!action) { return }
    const { meta } = action
    const { pagination } = result
    if (!action.payload.endpoint || !pagination[rel] ||
        parseInt(pagination.totalPagesRemaining, 10) === 0 || !action ||
        (stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS &&
         get(stream, 'payload.serverStatus', 0) === 204)) { return }
    if (runningFetches[pagination[rel]]) { return }
    this.setState({ hidePaginator: false })
    const infiniteAction = {
      ...action,
      type: ACTION_TYPES.LOAD_NEXT_CONTENT,
      payload: {
        endpoint: { path: pagination[rel] },
      },
      meta: {
        mappingType: action.payload.endpoint.pagingPath || meta.mappingType,
        resultFilter: meta.resultFilter,
        resultKey: meta.resultKey,
      },
    }
    // this is used for updating the postId on a comment
    // so that the post exsists in the store after load
    if (action.payload.postIdOrToken) {
      infiniteAction.payload.postIdOrToken = action.payload.postIdOrToken
    }
    dispatch(infiniteAction)
  }

  renderError() {
    const { action } = this.props
    const { meta } = action
    return (
      <section className="StreamContainer isError">
        {meta && meta.renderStream && meta.renderStream.asError ?
          meta.renderStream.asError :
          <ErrorState4xx />
        }
      </section>
    )
  }

  renderLoading() {
    const { className } = this.props
    return (
      <section className={classNames('StreamContainer isBusy', className)} >
        <div className="StreamBusyIndicator">
          <ElloMark />
        </div>
      </section>
    )
  }

  renderZeroState() {
    const { action } = this.props
    if (!action) { return null }
    const { meta } = action
    return (
      <section className="StreamContainer">
        {meta && meta.renderStream && meta.renderStream.asZero ?
          meta.renderStream.asZero :
          null
        }
      </section>
    )
  }

  render() {
    const { className, columnCount, initModel, isGridMode, json,
      paginatorText, renderObj, result, stream } = this.props
    const { action, hidePaginator } = this.state
    if (!action) { return null }
    const model = findModel(json, initModel)
    if (model) {
      renderObj.data.push(model)
    } else if (!renderObj.data.length) {
      switch (stream.type) {
        case ACTION_TYPES.LOAD_STREAM_SUCCESS:
          return this.renderZeroState()
        case ACTION_TYPES.LOAD_STREAM_REQUEST:
          return this.renderLoading()
        case ACTION_TYPES.LOAD_STREAM_FAILURE:
          if (stream.error) {
            return this.renderError()
          }
          return null
        default:
          return null
      }
    }
    const { meta } = action
    const renderMethod = isGridMode ? 'asGrid' : 'asList'
    const pagination = result.pagination
    return (
      <section className={classNames('StreamContainer', className)}>
        {meta.renderStream[renderMethod](renderObj, columnCount)}
        {this.props.children}
        <Paginator
          hasShowMoreButton={
            typeof meta.resultKey !== 'undefined' && typeof meta.updateKey !== 'undefined'
          }
          isHidden={hidePaginator}
          loadNextPage={this.onLoadNextPage}
          messageText={paginatorText}
          totalPages={parseInt(pagination.totalPages, 10)}
          totalPagesRemaining={parseInt(pagination.totalPagesRemaining, 10)}
        />
      </section>
    )
  }
}

export default connect(makeMapStateToProps)(StreamContainer)

