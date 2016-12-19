import Immutable from 'immutable'
import { selectIsModalActive, selectModalKind } from '../../../src/selectors/modal'

describe('modal selectors', () => {
  let modal
  beforeEach(() => {
    modal = Immutable.Map({ isActive: true, kind: 'Modal' })
  })

  afterEach(() => {
    modal = {}
  })

  context('#selectIsModalActive', () => {
    it('returns the modal.isActive', () => {
      const state = { modal }
      expect(selectIsModalActive(state)).to.equal(true)
    })
  })

  context('#selectIsModalActive', () => {
    it('returns the modal.isActive', () => {
      const state = { modal }
      expect(selectModalKind(state)).to.equal('Modal')
    })
  })
})

