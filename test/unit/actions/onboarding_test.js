import { isFSA } from '../../support/test_helpers'
import * as subject from '../../../src/actions/onboarding'

describe('onboarding.js', () => {
  context('#relationshipBatchSave', () => {
    const action = subject.relationshipBatchSave([10, 666, 23], 'noise')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type')
    // it('has similar action.name and action.type', () => {
    //   expect(isFSAName(action, subject.batchUpdateRelationship)).to.be.true
    // })

    it('has the correct mapping type in the action', () => {
      expect(action.meta.mappingType).to.equal('relationships')
    })

    it('has the correct api endpoint in the action', () => {
      expect(action.payload.endpoint.path).to.contain('/relationships/batches')
    })

    it('has the correct user_ids in the action', () => {
      expect(action.payload.body.user_ids).to.contain(10)
      expect(action.payload.body.user_ids).to.contain(666)
      expect(action.payload.body.user_ids).to.contain(23)
    })

    it('has the correct relationship priority in the action', () => {
      expect(action.payload.body.priority).to.contain('noise')
    })
  })
})

