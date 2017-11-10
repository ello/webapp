export const getPosts = () =>
  Array.from(document.querySelectorAll('.Post'))

export const getDistanceFromTop = el => el.offsetTop

export const getPostsDistancesFromTop = () =>
  getPosts().map(getDistanceFromTop).sort((a, b) => a - b)

// Filter any post that is beneath 20% of the top of the screen.
export const below = distance => distance > (window.scrollY + (window.innerHeight * 0.20))

// Filter any post above the top of the screen
export const above = distance => distance < window.scrollY

export function scrollToNextPost() {
  const postsBelow = getPostsDistancesFromTop().filter(below)
  const [nextPost] = postsBelow
  const isPostLargerThanScreen = nextPost > window.scrollY + window.innerHeight
    // Scroll to next post if it's visible...
  if (nextPost && !isPostLargerThanScreen) return window.scrollTo(0, postsBelow.shift())
    // PageDown if it's not.
  return window.scrollTo(0, window.scrollY + window.innerHeight)
}

export function scrollToPreviousPost() {
  const postsAbove = getPostsDistancesFromTop().filter(above)
  const [previousPost] = postsAbove

  if (previousPost) return window.scrollTo(0, postsAbove.pop())
  return window.scrollTo(0, window.scrollY - window.innerHeight)
}
