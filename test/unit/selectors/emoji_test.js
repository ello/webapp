import Immutable from 'immutable'
import { selectEmojis } from '../../../src/selectors/emoji'

describe('emoji selectors', () => {
  context('#selectEmojis', () => {
    it('returns the emoji.emojis', () => {
      const state = { emoji: Immutable.Map({ emojis: 'emoji.emojis' }) }
      expect(selectEmojis(state)).to.equal('emoji.emojis')
    })
  })
})

