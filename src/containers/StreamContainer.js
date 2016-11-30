import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import classNames from 'classnames'
import Session from '../lib/session'
import { runningFetches } from '../sagas/requester'
import * as ACTION_TYPES from '../constants/action_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectColumnCount,
  selectHasLaunchedSignupModal,
  selectInnerHeight,
  selectInnerWidth,
  selectIsGridMode,
} from '../selectors/gui'
import { makeSelectStreamProps } from '../selectors/stream'
import { findModel } from '../helpers/json_helper'
import { getQueryParamValue } from '../helpers/uri_helper'
import {
  addScrollObject,
  addScrollTarget,
  removeScrollObject,
  removeScrollTarget,
} from '../components/viewport/ScrollComponent'
import { ElloMark } from '../components/assets/Icons'
import { Paginator } from '../components/streams/Paginator'
import { ErrorState4xx } from '../components/errors/Errors'
import { reloadPlayers } from '../components/editor/EmbedBlock'

export function makeMapStateToProps() {
  const getStreamProps = makeSelectStreamProps()
  const mapStateToProps = (state, props) => {
    const streamProps = getStreamProps(state, props)
    return {
      ...streamProps,
      columnCount: selectColumnCount(state),
      hasLaunchedSignupModal: selectHasLaunchedSignupModal(state),
      innerHeight: selectInnerHeight(state),
      innerWidth: selectInnerWidth(state),
      isLoggedIn: selectIsLoggedIn(state),
      json: state.get('json'),
      isGridMode: selectIsGridMode(state),
      omnibar: state.get('omnibar'),
      routerState: state.getIn(['routing', 'location', 'state'], {}),
      stream: state.get('stream'),
    }
  }
  return mapStateToProps
}

class StreamContainer extends Component {

  static propTypes = {
    action: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    columnCount: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    hasLaunchedSignupModal: PropTypes.bool,
    initModel: PropTypes.object,
    isGridMode: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isModalComponent: PropTypes.bool,
    isPostHeaderHidden: PropTypes.bool,
    json: PropTypes.object.isRequired,
    omnibar: PropTypes.object,
    paginatorText: PropTypes.string,
    renderObj: PropTypes.object.isRequired,
    result: PropTypes.object.isRequired,
    resultPath: PropTypes.string,
    scrollContainer: PropTypes.object,
    stream: PropTypes.object.isRequired,
  }

  static defaultProps = {
    paginatorText: 'Loading',
    isModalComponent: false,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  componentWillMount() {
    const { action, dispatch, omnibar } = this.props
    if (typeof window !== 'undefined' && action) {
      dispatch(action)
    }

    this.state = { action }
    this.wasOmnibarActive = omnibar.isActive
    this.setScroll = debounce(this.setScroll, 333)
  }

  componentDidMount() {
    reloadPlayers()
    const { isModalComponent, scrollContainer } = this.props
    if (isModalComponent && scrollContainer) {
      this.scrollObject = { component: this, element: scrollContainer }
      addScrollTarget(this.scrollObject)
    } else if (!isModalComponent) {
      this.scrollObject = this
      addScrollObject(this.scrollObject)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { scrollContainer, stream } = nextProps
    const { isModalComponent } = this.props
    const { action } = this.state
    if (isModalComponent && !this.props.scrollContainer && scrollContainer) {
      this.scrollObject = { component: this, element: scrollContainer }
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
    const { omnibar } = this.props
    this.wasOmnibarActive = omnibar.isActive
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
    removeScrollObject(this.scrollObject)
    removeScrollTarget(this.scrollObject)
  }

  onScroll() {
    this.setScroll()
  }

  onScrollTarget() {
    this.setScroll()
  }

  onScrollBottom() {
    const path = get(this.state, 'action.payload.endpoint.path')
    if (path && !/lovers|reposters/.test(path)) {
      this.onLoadNextPage()
      const { hasLaunchedSignupModal, isLoggedIn } = this.props
      if (!isLoggedIn && !hasLaunchedSignupModal) {
        const { onClickOpenRegistrationRequestDialog } = this.context
        onClickOpenRegistrationRequestDialog('scroll')
      }
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
    const path = get(this.state, 'action.payload.endpoint.path')
    if (!path) { return }
    if (/\/notifications/.test(path)) {
      const category = getQueryParamValue('category', path) || 'all'
      const { isModalComponent, scrollContainer } = this.props
      if (isModalComponent && scrollContainer) {
        Session.setItem(`/notifications/${category}/scrollY`, scrollContainer.scrollTop)
      } else {
        Session.setItem(`/notifications/${category}/scrollY`, window.scrollY)
      }
    }
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
          <ElloMark className="isSpinner" />
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
    const { className, columnCount, initModel, isGridMode, isPostHeaderHidden, json,
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
        {meta.renderStream[renderMethod](renderObj, columnCount, isPostHeaderHidden)}
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

