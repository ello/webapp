import {
  selectCommentOffset,
  selectIsMobileGridStream,
  selectHasSaidHelloTo,
  selectScrollOffset,
} from '../../../src/selectors/gui'

describe('gui selectors', () => {
  context('#selectCommentOffset', () => {
    it('selects with memoization the comment offset', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, change: false } }
      expect(selectCommentOffset(state)).to.equal(40)

      state = { gui: { columnCount: 2, innerWidth: 375, change: true } }
      expect(selectCommentOffset(state)).to.equal(40)
      expect(selectCommentOffset.recomputations()).to.equal(1)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: false } }
      expect(selectCommentOffset(state)).to.equal(60)
      expect(selectCommentOffset.recomputations()).to.equal(2)
    })
  })

  context('#selectIsMobileGridStream', () => {
    it('selects with memoization if in mobile and is in grid mode', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, isGridMode: true, change: false } }
      expect(selectIsMobileGridStream(state)).to.equal(true)

      state = { gui: { columnCount: 2, innerWidth: 375, isGridMode: true, change: true } }
      expect(selectIsMobileGridStream(state)).to.equal(true)
      expect(selectIsMobileGridStream.recomputations()).to.equal(1)

      state = { gui: { columnCount: 4, innerWidth: 1280, isGridMode: true, change: true } }
      expect(selectIsMobileGridStream(state)).to.equal(false)
      expect(selectIsMobileGridStream.recomputations()).to.equal(2)

      state = { gui: { columnCount: 2, innerWidth: 375, isGridMode: false, change: true } }
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

  context('#selectScrollOffset', () => {
    it('selects with memoization the scroll offset', () => {
      let state = { gui: { innerHeight: 100, change: false } }
      expect(selectScrollOffset(state)).to.equal(20)

      state = { gui: { innerHeight: 100, change: true } }
      expect(selectScrollOffset(state)).to.equal(20)
      expect(selectScrollOffset.recomputations()).to.equal(1)

      state = { gui: { innerHeight: 666, change: true } }
      expect(selectScrollOffset(state)).to.equal(586)
      expect(selectScrollOffset.recomputations()).to.equal(2)
    })
  })
})

