import {
  selectCommentOffset,
  selectIsMobileGridStream,
  selectHasSaidHelloTo,
} from '../../../src/selectors/gui'

describe('gui selectors', () => {
  context('#selectCommentOffset', () => {
    it('selects with memoization the comment offset', () => {
      let state = { gui: { deviceSize: 'mobile', change: false } }
      expect(selectCommentOffset(state)).to.equal(40)

      state = { gui: { deviceSize: 'mobile', change: true } }
      expect(selectCommentOffset(state)).to.equal(40)
      expect(selectCommentOffset.recomputations()).to.equal(1)

      state = { gui: { deviceSize: 'desktop', change: false } }
      expect(selectCommentOffset(state)).to.equal(60)
      expect(selectCommentOffset.recomputations()).to.equal(2)
    })
  })

  context('#selectIsMobileGridStream', () => {
    it('selects with memoization if in mobile and is in grid mode', () => {
      let state = { gui: { deviceSize: 'mobile', isGridMode: true, change: false } }
      expect(selectIsMobileGridStream(state)).to.equal(true)

      state = { gui: { deviceSize: 'mobile', isGridMode: true, change: true } }
      expect(selectIsMobileGridStream(state)).to.equal(true)
      expect(selectIsMobileGridStream.recomputations()).to.equal(1)

      state = { gui: { deviceSize: 'desktop', isGridMode: true, change: true } }
      expect(selectIsMobileGridStream(state)).to.equal(false)
      expect(selectIsMobileGridStream.recomputations()).to.equal(2)

      state = { gui: { deviceSize: 'mobile', isGridMode: false, change: true } }
      expect(selectIsMobileGridStream(state)).to.equal(false)
      expect(selectIsMobileGridStream.recomputations()).to.equal(3)
    })
  })

  context('#selectHasSaidHelloTo', () => {
    it('selects whether a user has been said hello to', () => {
      const state = { gui: { saidHelloTo: ['archer', 'lana'] } }
      const props = { params: { username: 'archer' } }
      expect(selectHasSaidHelloTo(state, props)).to.be.true
      // TODO: Not sure why but this returns 2?
      // expect(selectHasSaidHelloTo.recomputations()).to.equal(1)
    })
  })
})

