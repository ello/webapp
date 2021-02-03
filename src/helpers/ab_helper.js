export function getABState() {
  try {
    const abState = JSON.parse(localStorage.getItem('abState')) || {}
    return abState
  } catch (error) {
    return {}
  }
}

// adding default export to please ESLint
export default getABState;
