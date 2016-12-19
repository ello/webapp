import Immutable from 'immutable'
import {
  selectStreamType,
  selectStreamMappingType,
  selectStreamPostIdOrToken,
  // makeSelectStreamProps,
} from '../../../src/selectors/stream'

describe('stream selectors', () => {
  let state
  beforeEach(() => {
    const stream = Immutable.fromJS({
      meta: { mappingType: 'stream.meta.mappingType' },
      payload: { postIdOrToken: 'stream.payload.postIdOrToken' },
      type: 'stream.type',
    })
    state = { stream }
  })

  afterEach(() => {
    state = null
  })

  context('#selectStreamType', () => {
    it('returns the stream.type', () => {
      expect(selectStreamType(state)).to.equal('stream.type')
    })
  })

  context('#selectStreamMappingType', () => {
    it('returns the stream.meta.mappingType', () => {
      expect(selectStreamMappingType(state)).to.equal('stream.meta.mappingType')
    })
  })

  context('#selectStreamPostIdOrToken', () => {
    it('returns the stream.payload.postIdOrToken', () => {
      expect(selectStreamPostIdOrToken(state)).to.equal('stream.payload.postIdOrToken')
    })
  })

  context('#makeSelectStreamProps', () => {
    it('makeSelectStreamProps needs to be tested')
  })
})

