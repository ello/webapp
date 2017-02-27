// Global types

export type CategoryTabProps = {
  activePattern: RegExp|void,
  label: string,
  source: string,
  to: string,
}

export type Availability = {
  username: boolean,
  email: boolean,
  invitation_code: boolean,
  suggestions: {
    username: Array<string>,
  },
  email: {
    address: string,
    domain: string,
    full: string,
  }
}

