import { fullUserAllFragments } from './fragments'

export const userNetworkStreamQuery = `
  ${fullUserAllFragments}
  query($username: String!, $kind: RelationshipKind!, $before: String) {
    userNetworkStream(username: $username, before: $before, kind: $kind) {
      next
      isLastPage
      users { ...fullUser }
    }
  }
`

export default userNetworkStreamQuery
