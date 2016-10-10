/* eslint-disable max-len */
import { default as reducer } from '../../../src/reducers'

describe('stream.js', () => {
  it('returns the existing state if nothing is passed in', () => {
    const state = reducer()
    expect(state).to.be.empty
  })

  it('returns the previous state if the action type is not LOAD_STREAM', () => {
    let state = reducer({}, { type: 'LOAD_STREAM_SUCCESS', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
    expect(state.type).to.equal('LOAD_STREAM_SUCCESS')
    expect(state.meta).to.equal('myMeta')
    expect(state.payload).to.equal('myPayload')
    expect(state.error).to.equal('myError')
    state = reducer(state, { type: 'NOTHING', meta: 'myMeta2', payload: 'myPayload2', error: 'myError2' })
    expect(state.type).to.equal('LOAD_STREAM_SUCCESS')
    expect(state.meta).to.equal('myMeta')
    expect(state.payload).to.equal('myPayload')
    expect(state.error).to.equal('myError')
  })

  it('returns the proper state when the action type is LOAD_STREAM_SUCCESS', () => {
    const state = reducer({}, { type: 'LOAD_STREAM_SUCCESS', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
    expect(state.type).to.equal('LOAD_STREAM_SUCCESS')
    expect(state.meta).to.equal('myMeta')
    expect(state.payload).to.equal('myPayload')
    expect(state.error).to.equal('myError')
  })
})

