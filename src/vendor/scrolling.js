/* eslint-disable no-param-reassign */

export default function scrollTop(_node) {
  const node = _node || window
  if (node && typeof node.scrollTop !== 'undefined') {
    return node.scrollTop
  }

  if ({}.hasOwnProperty.call(window, 'scrollY')) {
    return window.scrollY
  }
  const offset = document.documentElement ?
    document.documentElement.scrollTop :
    0
  return document.body.scrollTop + offset
}

function scrollToFn(top) {
  return () => {
    window.scrollTo(0, top)
  }
}

export function scrollToTop(pos = 0) {
  let top = scrollTop()
  let up = 10
  let timeout = 10
  const max = 1000

  if (top > pos) {
    while (top > pos) {
      timeout += 10
      up = up * 1.1 < max ? up * 1.1 : max
      top -= up
      setTimeout(scrollToFn(top), timeout)
    }
  } else {
    while (top < pos) {
      timeout += 10
      up = up * 1.1 < max ? up * 1.1 : max
      top += up
      setTimeout(scrollToFn(top), timeout)
    }
  }
}

function scrollElToFn(el, top) {
  return () => {
    el.scrollTop = top
  }
}

export function scrollElToTop(el) {
  let top = scrollTop(el)
  let up = 10
  let timeout = 10
  const max = 1000

  while (top > 0) {
    timeout += 10
    up = up * 1.1 < max ? up * 1.1 : max
    top -= up
    setTimeout(scrollElToFn(el, top), timeout)
  }
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
      scrollToTop(window.scrollY + ((pos.top - window.innerHeight) + 140))
    } else {
      scrollToTop(window.scrollY + (pos.top - 100))
    }
  }
}

