import Immutable from 'immutable'
import { stubJSONStore } from '../../support/stubs'
import { shouldContainerUpdate, mapStateToProps } from '../../../src/containers/PostDetailContainer'

describe('PostDetailContainer', () => {
  context('#shouldContainerUpdate', () => {
    const thisProps = {
      author: undefined,
      isLoggedIn: false,
      paramsToken: 'thisParamsToken',
      post: undefined,
      streamError: 'thisStreamError',
      streamType: 'thisStreamType',
      notPicked: 'notPicked',
    }
    const sameProps = { ...thisProps }
    const nextProps = {
      author: 'nextAuthor',
      isLoggedIn: true,
      paramsToken: 'nextParamsToken',
      post: 'nextPost',
      streamError: 'nextStreamError',
      streamType: 'nextStreamType',
      notPicked: 'notPicked',
    }
    const lastProps = {
      author: 'nextAuthor',
      isLoggedIn: true,
      paramsToken: 'nextParamsToken',
      post: 'nextPost',
      streamError: 'nextStreamError',
      streamType: 'nextStreamType',
      notPicked: 'changed',
    }
    const defaultState = Immutable.Map({ isStreamFailing: false })
    const shouldSameUpdate = shouldContainerUpdate(thisProps, sameProps, defaultState, defaultState)
    const shouldNextUpdate = shouldContainerUpdate(thisProps, nextProps, defaultState, defaultState)
    const shouldLastUpdate = shouldContainerUpdate(nextProps, lastProps, defaultState, defaultState)

    it('should not update state since the values are the same', () => {
      expect(shouldSameUpdate).to.be.false
    })

    it('should update state since all value have changed', () => {
      expect(shouldNextUpdate).to.be.true
    })

    it('should not update state since a non-picked value changed', () => {
      expect(shouldLastUpdate).to.be.false
    })

    it('should not update since author and post are undefined', () => {
      expect(shouldContainerUpdate({}, thisProps, defaultState, defaultState)).to.be.false
    })

    it('should update since the stream error type changed', () => {
      expect(shouldContainerUpdate(
        thisProps, { ...nextProps, streamError: 'Error' }, defaultState, defaultState,
      )).to.be.true
    })
  })

  context('#mapStateToProps', () => {
    const json = stubJSONStore()
    const user1 = json.getIn(['users', '1'])
    const post1 = json.getIn(['posts', '1'])
    const state = Immutable.fromJS({
      authentication: { isLoggedIn: true },
      json,
      stream: { error: {}, type: 'streamType' },
    })
    const props = { params: { token: 'token1' } }
    const mapped = mapStateToProps(state, props)

    it('should select the correct post', () => {
      expect(mapped.post).to.equal(post1)
    })

    it('should map the author (user) from the post', () => {
      expect(mapped.author).to.equal(user1)
    })
  })
})

