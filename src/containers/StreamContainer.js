import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import classNames from 'classnames'
import { runningFetches, runningServerFetches } from '../sagas/requester'
import * as ACTION_TYPES from '../constants/action_types'
import { setNotificationScrollY } from '../actions/gui'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectColumnCount,
  selectHasLaunchedSignupModal,
  selectInnerHeight,
  selectInnerWidth,
  selectIsGridMode,
} from '../selectors/gui'
import { selectOmnibar, selectStream } from '../selectors/store'
import { selectStreamFilteredResult, selectStreamResultPath } from '../selectors/stream'
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

const selectActionPath = props =>
  get(props, ['action', 'payload', 'endpoint', 'path'])

function makeMapStateToProps() {
  return (state, props) =>
    ({
      columnCount: selectColumnCount(state),
      hasLaunchedSignupModal: selectHasLaunchedSignupModal(state),
      innerHeight: selectInnerHeight(state),
      innerWidth: selectInnerWidth(state),
      isLoggedIn: selectIsLoggedIn(state),
      isGridMode: selectIsGridMode(state),
      omnibar: selectOmnibar(state),
      result: selectStreamFilteredResult(state, props),
      resultPath: selectStreamResultPath(state, props),
      stream: selectStream(state),
    })
}

class StreamContainer extends Component {

  static propTypes = {
    action: PropTypes.object,
    className: PropTypes.string,
    columnCount: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasLaunchedSignupModal: PropTypes.bool.isRequired,
    hasShowMoreButton: PropTypes.bool,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isModalComponent: PropTypes.bool,
    isPostHeaderHidden: PropTypes.bool,
    omnibar: PropTypes.object.isRequired,
    paginatorCentered: PropTypes.bool,
    paginatorText: PropTypes.string,
    paginatorTo: PropTypes.string,
    result: PropTypes.object.isRequired,
    resultPath: PropTypes.string.isRequired,
    scrollContainer: PropTypes.object,
    shouldInfiniteScroll: PropTypes.bool,
    stream: PropTypes.object.isRequired,
  }

  static defaultProps = {
    action: null,
    className: '',
    hasShowMoreButton: false,
    isModalComponent: false,
    isPostHeaderHidden: false,
    paginatorCentered: false,
    paginatorText: 'Loading',
    paginatorTo: null,
    scrollContainer: null,
    shouldInfiniteScroll: true,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  componentWillMount() {
    const { action, dispatch, omnibar } = this.props
    this.state = { action, renderType: ACTION_TYPES.LOAD_STREAM_REQUEST }
    if (typeof window !== 'undefined' && action) {
      const path = get(action, 'payload.endpoint.path')
      if (!runningServerFetches[path]) {
        dispatch(action)
      } else {
        delete runningServerFetches[path]
        this.state.renderType = ACTION_TYPES.LOAD_STREAM_SUCCESS
      }
    }

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
    if (stream.get('type') === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      this.setState({ hidePaginator: true })
    }
    if (selectActionPath(this.props) === nextProps.stream.getIn(['payload', 'endpoint', 'path'])) {
      this.setState({ renderType: stream.get('type') })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // when hitting the back button the result can update and
    // try to feed wrong results to the actions render method
    // thus causing errors when trying to render wrong results
    if (nextProps.resultPath !== this.props.resultPath) {
      return false
    }
    return !Immutable.is(nextProps.result, this.props.result) ||
      ['columnCount', 'isGridMode', 'isLoggedIn'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['hidePaginator', 'renderType'].some(prop =>
        nextState[prop] !== this.state[prop],
      )
  }

  componentDidUpdate() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    const { omnibar } = this.props
    this.wasOmnibarActive = omnibar.get('isActive')
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
    removeScrollObject(this.scrollObject)
    removeScrollTarget(this.scrollObject)
  }

  onScroll() {
    if (!this.props.shouldInfiniteScroll) { return }
    this.setScroll()
  }

  onScrollTarget() {
    if (!this.props.shouldInfiniteScroll) { return }
    this.setScroll()
  }

  onScrollBottom() {
    const { hasLaunchedSignupModal, isLoggedIn, result, shouldInfiniteScroll } = this.props
    if (!shouldInfiniteScroll || !result.get('ids').size) { return }
    this.onLoadNextPage()
    if (!isLoggedIn && !hasLaunchedSignupModal) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('scroll')
    }
  }

  onScrollBottomTarget() {
    if (!this.props.shouldInfiniteScroll) { return }
    this.onLoadNextPage()
  }

  onLoadNextPage = () => {
    this.loadPage('next')
  }

  setScroll() {
    const path = get(this.state, 'action.payload.endpoint.path')
    if (!path) { return }
    if (/\/notifications/.test(path)) {
      const category = getQueryParamValue('category', path) || 'all'
      const { dispatch, isModalComponent, scrollContainer } = this.props
      if (isModalComponent && scrollContainer) {
        dispatch(setNotificationScrollY(category, scrollContainer.scrollTop))
      }
    }
  }

  loadPage(rel) {
    const { dispatch, result, stream } = this.props
    const { action } = this.state
    if (!action) { return }
    const { meta } = action
    const pagination = result.get('pagination')
    if (!action.payload.endpoint || !pagination.get(rel) ||
        Number(pagination.get('totalPagesRemaining')) === 0 ||
        (stream.get('type') === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS &&
         stream.getIn(['payload', 'serverStatus']) === 204)) { return }
    if (runningFetches[pagination[rel]]) { return }
    this.setState({ hidePaginator: false })
    const infiniteAction = {
      ...action,
      type: ACTION_TYPES.LOAD_NEXT_CONTENT,
      payload: {
        endpoint: { path: pagination.get(rel) },
      },
      meta: {
        mappingType: meta.mappingType,
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
    const { className, columnCount, hasShowMoreButton, isGridMode, isPostHeaderHidden,
      paginatorCentered, paginatorText, paginatorTo, result, stream } = this.props
    const { action, hidePaginator, renderType } = this.state
    if (!action) { return null }
    if (!result.get('ids').size) {
      switch (renderType) {
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
    const pagination = result.get('pagination')
    return (
      <section className={classNames('StreamContainer', className)}>
        {meta.renderStream[renderMethod](result.get('ids'), columnCount, isPostHeaderHidden, meta.renderProps)}
        <Paginator
          hasShowMoreButton={
            hasShowMoreButton || (typeof meta.resultKey !== 'undefined' && typeof meta.updateKey !== 'undefined')
          }
          isCentered={paginatorCentered}
          isHidden={hidePaginator}
          loadNextPage={this.onLoadNextPage}
          messageText={paginatorText}
          to={paginatorTo}
          totalPages={Number(pagination.get('totalPages'))}
          totalPagesRemaining={Number(pagination.get('totalPagesRemaining'))}
        />
      </section>
    )
  }
}

export default connect(makeMapStateToProps)(StreamContainer)

