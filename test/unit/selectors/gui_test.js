import * as selector from '../../../src/selectors/gui'

describe('gui selectors', () => {
  context('#selectDeviceSize', () => {
    it('selects with memoization the device size string', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, change: false } }
      selector.selectDeviceSize.resetRecomputations()
      expect(selector.selectDeviceSize(state)).to.equal('mobile')

      state = { gui: { columnCount: 2, innerWidth: 375, change: true } }
      expect(selector.selectDeviceSize(state)).to.equal('mobile')
      expect(selector.selectDeviceSize.recomputations()).to.equal(1)

      state = { gui: { columnCount: 2, innerWidth: 800, change: false } }
      expect(selector.selectDeviceSize(state)).to.equal('tablet')
      expect(selector.selectDeviceSize.recomputations()).to.equal(2)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: false } }
      expect(selector.selectDeviceSize(state)).to.equal('desktop')
      expect(selector.selectDeviceSize.recomputations()).to.equal(3)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: true } }
      expect(selector.selectDeviceSize(state)).to.equal('desktop')
      expect(selector.selectDeviceSize.recomputations()).to.equal(3)
    })
  })

  context('#selectIsMobile', () => {
    it('selects with memoization if the gui is a mobile device size or not', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, change: false } }
      selector.selectIsMobile.resetRecomputations()
      expect(selector.selectIsMobile(state)).to.equal(true)

      state = { gui: { columnCount: 2, innerWidth: 375, change: true } }
      expect(selector.selectIsMobile(state)).to.equal(true)
      expect(selector.selectIsMobile.recomputations()).to.equal(1)

      state = { gui: { columnCount: 2, innerWidth: 800, change: false } }
      expect(selector.selectIsMobile(state)).to.equal(false)
      expect(selector.selectIsMobile.recomputations()).to.equal(2)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: false } }
      expect(selector.selectIsMobile(state)).to.equal(false)
      expect(selector.selectIsMobile.recomputations()).to.equal(3)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: true } }
      expect(selector.selectIsMobile(state)).to.equal(false)
      expect(selector.selectIsMobile.recomputations()).to.equal(3)
    })
  })

  context('#selectIsMobileGridStream', () => {
    it('selects with memoization if in mobile and is in grid mode', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, isGridMode: true, change: false } }
      expect(selector.selectIsMobileGridStream(state)).to.equal(true)

      state = { gui: { columnCount: 2, innerWidth: 375, isGridMode: true, change: true } }
      expect(selector.selectIsMobileGridStream(state)).to.equal(true)
      expect(selector.selectIsMobileGridStream.recomputations()).to.equal(1)

      state = { gui: { columnCount: 4, innerWidth: 1280, isGridMode: true, change: true } }
      expect(selector.selectIsMobileGridStream(state)).to.equal(false)
      expect(selector.selectIsMobileGridStream.recomputations()).to.equal(2)

      state = { gui: { columnCount: 2, innerWidth: 375, isGridMode: false, change: true } }
      expect(selector.selectIsMobileGridStream(state)).to.equal(false)
      expect(selector.selectIsMobileGridStream.recomputations()).to.equal(3)
    })
  })

  context('#selectPaddingOffset', () => {
    it('selects with memoization the padding offset based on the device size', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, change: false } }
      selector.selectPaddingOffset.resetRecomputations()
      expect(selector.selectPaddingOffset(state)).to.equal(10)

      state = { gui: { columnCount: 2, innerWidth: 375, change: true } }
      expect(selector.selectPaddingOffset(state)).to.equal(10)
      expect(selector.selectPaddingOffset.recomputations()).to.equal(1)

      state = { gui: { columnCount: 2, innerWidth: 800, change: false } }
      expect(selector.selectPaddingOffset(state)).to.equal(20)
      expect(selector.selectPaddingOffset.recomputations()).to.equal(2)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: false } }
      expect(selector.selectPaddingOffset(state)).to.equal(40)
      expect(selector.selectPaddingOffset.recomputations()).to.equal(3)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: true } }
      expect(selector.selectPaddingOffset(state)).to.equal(40)
      expect(selector.selectPaddingOffset.recomputations()).to.equal(3)
    })
  })

  context('#selectCommentOffset', () => {
    it('selects with memoization the comment offset', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, change: false } }
      expect(selector.selectCommentOffset(state)).to.equal(40)

      state = { gui: { columnCount: 2, innerWidth: 375, change: true } }
      expect(selector.selectCommentOffset(state)).to.equal(40)
      expect(selector.selectCommentOffset.recomputations()).to.equal(1)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: false } }
      expect(selector.selectCommentOffset(state)).to.equal(60)
      expect(selector.selectCommentOffset.recomputations()).to.equal(2)
    })
  })

  context('#selectColumnWidth', () => {
    it('selects with memoization the column width', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, change: false } }
      expect(selector.selectColumnWidth(state)).to.equal(173)

      state = { gui: { columnCount: 2, innerWidth: 375, change: true } }
      expect(selector.selectColumnWidth(state)).to.equal(173)
      expect(selector.selectColumnWidth.recomputations()).to.equal(1)

      state = { gui: { columnCount: 3, innerWidth: 800, change: false } }
      expect(selector.selectColumnWidth(state)).to.equal(240)
      expect(selector.selectColumnWidth.recomputations()).to.equal(2)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: false } }
      expect(selector.selectColumnWidth(state)).to.equal(270)
      expect(selector.selectColumnWidth.recomputations()).to.equal(3)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: true } }
      expect(selector.selectColumnWidth(state)).to.equal(270)
      expect(selector.selectColumnWidth.recomputations()).to.equal(3)
    })
  })

  context('#selectContentWidth', () => {
    it('selects with memoization the content width', () => {
      let state = { gui: { columnCount: 2, innerWidth: 375, change: false } }
      expect(selector.selectContentWidth(state)).to.equal(355)

      state = { gui: { columnCount: 2, innerWidth: 375, change: true } }
      expect(selector.selectContentWidth(state)).to.equal(355)
      expect(selector.selectContentWidth.recomputations()).to.equal(1)

      state = { gui: { columnCount: 2, innerWidth: 640, change: false } }
      expect(selector.selectContentWidth(state)).to.equal(600)
      expect(selector.selectContentWidth.recomputations()).to.equal(2)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: false } }
      expect(selector.selectContentWidth(state)).to.equal(1200)
      expect(selector.selectContentWidth.recomputations()).to.equal(3)

      state = { gui: { columnCount: 4, innerWidth: 1280, change: true } }
      expect(selector.selectContentWidth(state)).to.equal(1200)
      expect(selector.selectContentWidth.recomputations()).to.equal(3)
    })
  })

  context('#selectDPI', () => {
    it('selects with memoization the full screen dpi setting as a string', () => {
      let state = { gui: { innerWidth: 375, change: false } }
      selector.selectDPI.resetRecomputations()
      expect(selector.selectDPI(state)).to.equal('hdpi')

      state = { gui: { innerWidth: 375, change: true } }
      expect(selector.selectDPI(state)).to.equal('hdpi')
      expect(selector.selectDPI.recomputations()).to.equal(1)

      state = { gui: { innerWidth: 1280, change: false } }
      expect(selector.selectDPI(state)).to.equal('xhdpi')
      expect(selector.selectDPI.recomputations()).to.equal(2)

      state = { gui: { innerWidth: 2560, change: false } }
      expect(selector.selectDPI(state)).to.equal('optimized')
      expect(selector.selectDPI.recomputations()).to.equal(3)

      state = { gui: { innerWidth: 2560, change: true } }
      expect(selector.selectDPI(state)).to.equal('optimized')
      expect(selector.selectDPI.recomputations()).to.equal(3)
    })
  })

  context('#selectHasSaidHelloTo', () => {
    it('selects whether a user has been said hello to', () => {
      const state = { gui: { saidHelloTo: ['archer', 'lana'] } }
      const props = { params: { username: 'archer' } }
      selector.selectHasSaidHelloTo.resetRecomputations()
      expect(selector.selectHasSaidHelloTo(state, props)).to.be.true
      expect(selector.selectHasSaidHelloTo.recomputations()).to.equal(1)
    })
  })

  context('#selectScrollOffset', () => {
    it('selects with memoization the scroll offset', () => {
      let state = { gui: { innerHeight: 100, change: false } }
      expect(selector.selectScrollOffset(state)).to.equal(20)

      state = { gui: { innerHeight: 100, change: true } }
      expect(selector.selectScrollOffset(state)).to.equal(20)
      expect(selector.selectScrollOffset.recomputations()).to.equal(1)

      state = { gui: { innerHeight: 666, change: true } }
      expect(selector.selectScrollOffset(state)).to.equal(586)
      expect(selector.selectScrollOffset.recomputations()).to.equal(2)
    })
  })

  context('#selectIsLayoutToolHidden', () => {
    it('selects with memoization whether the current route has a promotion', () => {
      let state = { routing: { location: { pathname: '/search', change: false } } }
      expect(selector.selectIsLayoutToolHidden(state)).to.equal(false)

      state = { routing: { location: { pathname: '/search', change: true } } }
      expect(selector.selectIsLayoutToolHidden(state)).to.equal(false)
      expect(selector.selectIsLayoutToolHidden.recomputations()).to.equal(1)

      // User search doesn't show the tools
      state = { routing: { location: { pathname: '/search', change: true } } }
      const props = { location: { pathname: '/search', query: { type: 'users' } } }
      expect(selector.selectIsLayoutToolHidden(state, props)).to.equal(true)
      expect(selector.selectIsLayoutToolHidden.recomputations()).to.equal(2)

      state = { routing: { location: { pathname: '/discover', change: true } } }
      expect(selector.selectIsLayoutToolHidden(state)).to.equal(false)
      expect(selector.selectIsLayoutToolHidden.recomputations()).to.equal(3)

      state = { routing: { location: { pathname: '/discover/stuff', change: true } } }
      expect(selector.selectIsLayoutToolHidden(state)).to.equal(false)

      const hasLayoutTools = [
        '/',
        '/following',
        '/starred',
        '/invitiations',
        '/mk',
        '/mk/loves',
      ]
      hasLayoutTools.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selector.selectIsLayoutToolHidden(state)).to.equal(false, `${route} should have layout tools.`)
      })

      const noLayoutTools = [
        '/settings',
        '/onboarding',
        '/onboarding/settings',
        '/notifications',
        '/mk/post/etlb9br06dh6tleztw4g',
        '/mk/following',
        '/mk/followers',
      ]
      noLayoutTools.forEach((route) => {
        state = { routing: { location: { pathname: route, change: false } } }
        expect(selector.selectIsLayoutToolHidden(state)).to.equal(true, `${route} should not have layout tools.`)
      })
    })
  })
})

