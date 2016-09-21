import TWEEN from 'tween.js'

let memoizedIsAndroid
let memoizedIsChrome
let memoizedIsElloAndroid
let memoizedIsFirefox
let memoizedIsIE11
let memoizedIsIOS
let memoizedIsSafari

export function isAndroid() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsAndroid !== 'undefined') { return memoizedIsAndroid }
  memoizedIsAndroid = /Android/gi.test(navigator.userAgent)
  return memoizedIsAndroid
}

export function isChrome() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsChrome !== 'undefined') { return memoizedIsChrome }
  memoizedIsChrome = !!window.chrome && !!window.chrome.webstore
  return memoizedIsChrome
}

export function isElloAndroid() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsElloAndroid !== 'undefined') { return memoizedIsElloAndroid }
  memoizedIsElloAndroid = /Ello Android/gi.test(navigator.userAgent)
  return memoizedIsElloAndroid
}

export function isFirefox() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsFirefox !== 'undefined') { return memoizedIsFirefox }
  memoizedIsFirefox = /Firefox/gi.test(navigator.userAgent)
  return memoizedIsFirefox
}

export function isSafari() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsSafari !== 'undefined') { return memoizedIsSafari }
  memoizedIsSafari = /Safari/gi.test(navigator.userAgent) && !isChrome()
  return memoizedIsSafari
}

export function isIOS() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsIOS !== 'undefined') { return memoizedIsIOS }
  memoizedIsIOS = /iPad|iPhone|iPod/gi.test(navigator.userAgent)
  return memoizedIsIOS
}

export function isIE11() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsIE11 !== 'undefined') { return memoizedIsIE11 }
  const docStyle = document.documentElement.style
  memoizedIsIE11 = '-ms-scroll-limit' in docStyle && '-ms-ime-align' in docStyle
  return memoizedIsIE11
}

export function getElloPlatform() {
  return isElloAndroid() ? 'ello-android-app' : 'ello-webapp'
}

// -------------------------------------

export function addFeatureDetection() {
  const cl = document.documentElement.classList
  if (!('ontouchstart' in document.documentElement)) {
    cl.add('no-touch')
  }
  const onTouchStart = () => {
    document.removeEventListener('touchstart', onTouchStart)
    cl.remove('no-touch')
    cl.add('has-touch')
  }
  if (isChrome()) { cl.add('isChrome') }
  if (isSafari()) { cl.add('isSafari') }
  if (isFirefox()) { cl.add('isFirefox') }
  if (isIE11()) { cl.add('isIE11') }
  document.addEventListener('touchstart', onTouchStart)
}

export function hideSoftKeyboard() {
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

export function scrollTo(x, y, options = {}) {
  const el = options.el
  let animate = () => {
    requestAnimationFrame(animate)
    TWEEN.update()
  }
  function updateScroll() {
    if (el) {
      el.scrollLeft = this.x
      el.scrollTop = this.y
    } else {
      window.scrollTo(this.x, this.y)
    }
  }
  new TWEEN.Tween({
    x: el ? el.scrollLeft : window.pageXOffset || document.documentElement.scrollLeft,
    y: el ? el.scrollTop : window.pageYOffset || document.documentElement.scrollTop,
  })
    .easing(options.easing || TWEEN.Easing.Quartic.InOut)
    .to({ x: x || 0, y: y || 0 }, options.duration || 1000)
    .onUpdate(updateScroll)
    .onComplete(() => { animate = () => {} })
    .start()
  requestAnimationFrame(animate)
}

function isElementInViewport(el, topOffset = 0) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= topOffset && rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function scrollToLastTextBlock(editorId, isNavbarHidden) {
  const textBlocks = document.querySelectorAll(`[data-editor-id='${editorId}'] div.text`)
  const lastTextBlock = textBlocks[textBlocks.length - 1]
  if (lastTextBlock && !isElementInViewport(lastTextBlock, isNavbarHidden ? 0 : 80)) {
    const pos = lastTextBlock.getBoundingClientRect()
    if (pos.top > window.innerHeight) {
      scrollTo(0, window.scrollY + ((pos.top - window.innerHeight) + 140))
    } else {
      scrollTo(0, window.scrollY + (pos.top - 100))
    }
  }
}

