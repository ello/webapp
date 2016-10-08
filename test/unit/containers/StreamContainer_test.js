import { stub } from '../../support/stubs'
import {
  makeMapStateToProps,
} from '../../../src/containers/StreamContainer'
import * as MAPPING_TYPES from '../../../src/constants/mapping_types'
import { setLocation } from '../../../src/reducers/gui'

let props
let state
const mapStateToProps = makeMapStateToProps()

function createPropsForStream(ownProps = {}) {
  const defaultProps = {
    action: {},
    currentUser: stub('user', { id: 'currentUser' }),
    dispatch: () => { /**/ },
    json: {
      pages: {
        what: { ids: [], pagination: {}, type: 'what' },
      },
    },
    isGridMode: true,
    renderObj: { data: [], nestedData: [] },
    result: {
      type: 'posts',
      ids: [],
    },
    stream: { error: false },
  }
  return { ...defaultProps, ...ownProps }
}

function createStateForStream(ownState = {}) {
  const defaultProps = {
    json: {
      pages: {
        '/discover': {
          ids: ['1', '2', '3'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        },
        '/following': {
          ids: ['11', '12', '13'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        },
        '/notifications': {
          ids: ['21', '22', '23'],
          pagination: {},
          type: MAPPING_TYPES.NOTIFICATIONS,
        },
        '/resultKey': {
          ids: ['31', '32', '33'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        },
      },
    },
    gui: {
      isGridMode: false,
      modes: [
        { label: 'discover', mode: 'list', regex: /\/discover|\/explore/ },
        { label: 'following', mode: 'grid', regex: /\/following/ },
      ],
    },
    profile: stub('user', { id: 'currentUser' }),
    routing: {
      location: {
        pathname: 'something',
      },
    },
    stream: { error: false },
  }
  return { ...defaultProps, ...ownState }
}

describe('StreamContainer', () => {
  afterEach(() => {
    props = null
    state = null
  })

  describe('#mapStateToProps', () => {
    context('json', () => {
      it('sets json', () => {
        state = createStateForStream()
        props = createPropsForStream()
        expect(mapStateToProps(state, props).json.pages['/following']).to.deep.equal({
          ids: ['11', '12', '13'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        })
      })
    })

    // TODO: This should be moved off to the reducer/gui spec
    context('mode', () => {
      it('sets mode', () => {
        state = createStateForStream({ routing: { location: { pathname: '/discover' } } })
        props = createPropsForStream()
        setLocation({ pathname: '/discover' })
        expect(mapStateToProps(state, props).isGridMode).to.equal(false)
      })
    })

    context('renderObj', () => {
      // need to test
    })

    context('result', () => {
      it('finds a result with a resultKey', () => {
        state = createStateForStream()
        props = createPropsForStream({ action: { meta: { resultKey: '/resultKey' } } })
        expect(mapStateToProps(state, props).result).to.deep.equal({
          ids: ['31', '32', '33'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        })
      })

      it('finds a result from the pathname', () => {
        state = createStateForStream({ routing: { location: { pathname: '/discover' } } })
        props = createPropsForStream()
        expect(mapStateToProps(state, props).result).to.deep.equal({
          ids: ['1', '2', '3'],
          pagination: {},
          type: MAPPING_TYPES.POSTS,
        })
      })

      it('returns a default result if no data is present', () => {
        state = createStateForStream()
        props = createPropsForStream()
        const defaultResult = {
          ids: [], pagination: { totalPages: 0, totalPagesRemaining: 0 },
        }
        expect(mapStateToProps(state, props).result).to.deep.equal(defaultResult)
      })
    })

    context('stream', () => {
      it('sets stream', () => {
        state = createStateForStream()
        props = createPropsForStream()
        expect(mapStateToProps(state, props).stream).to.deep.equal({
          error: false,
        })
      })
    })
  })
})

