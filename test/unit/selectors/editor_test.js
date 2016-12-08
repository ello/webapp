import Immutable from 'immutable'
import { selectCompletions } from '../../../src/selectors/editor'

describe('editor selectors', () => {
  context('#selectCompletions', () => {
    it('returns the editor.completions', () => {
      const state = Immutable.fromJS({ editor: { completions: 'editor.completions' } })
      expect(selectCompletions(state)).to.equal('editor.completions')
    })
  })
})

