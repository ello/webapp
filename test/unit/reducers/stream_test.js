/* eslint-disable max-len */
import { default as reducer } from '../../../src/reducers/stream'

describe('stream.js', () => {
  it('returns the existing state if nothing is passed in', () => {
    const state = reducer()
    expect(state).to.be.empty
  })

  it('returns the previous state if the action type is not LOAD_STREAM', () => {
    let state = reducer(undefined, { type: 'LOAD_STREAM_SUCCESS', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
    expect(state.get('type')).to.equal('LOAD_STREAM_SUCCESS')
    expect(state.get('meta')).to.equal('myMeta')
    expect(state.get('payload')).to.equal('myPayload')
    expect(state.get('error')).to.equal('myError')
    state = reducer(state, { type: 'NOTHING', meta: 'myMeta2', payload: 'myPayload2', error: 'myError2' })
    expect(state.get('type')).to.equal('LOAD_STREAM_SUCCESS')
    expect(state.get('meta')).to.equal('myMeta')
    expect(state.get('payload')).to.equal('myPayload')
    expect(state.get('error')).to.equal('myError')
  })

  it('returns the proper state when the action type is LOAD_STREAM_SUCCESS', () => {
    const state = reducer(undefined, { type: 'LOAD_STREAM_SUCCESS', meta: 'myMeta', payload: 'myPayload', error: 'myError' })
    expect(state.get('type')).to.equal('LOAD_STREAM_SUCCESS')
    expect(state.get('meta')).to.equal('myMeta')
    expect(state.get('payload')).to.equal('myPayload')
    expect(state.get('error')).to.equal('myError')
  })
})

