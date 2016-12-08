import urlRegex from 'url-regex'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { ERROR_MESSAGES as ERROR } from '../../constants/locales/en'

export function isFormValid(states) {
  return states.every(state => state.status === STATUS.SUCCESS)
}


export function containsSpace(value) {
  return (/\s/).test(value)
}

export function containsInvalidUsernameCharacters(value) {
  return (!(/^[a-zA-Z0-9\-_]+$/).test(value))
}

export function isValidURL(value) {
  // this is added since we only validate buy links
  // which would get the protocol prepended if not there
  // same with the external links in a profile
  let newValue = value
  if (newValue.indexOf('http') !== 0) {
    newValue = `http://${newValue}`
  }
  return urlRegex({ exact: true }).test(newValue)
}

// Client-side only validation
export function getUsernameStateFromClient({ currentStatus, value }) {
  if (!value && !value.length && currentStatus !== STATUS.INDETERMINATE) {
    return { status: STATUS.INDETERMINATE, suggestions: null, message: '' }
  } else if (containsSpace(value)) {
    return {
      status: STATUS.FAILURE,
      suggestions: null,
      message: ERROR.USERNAME.SPACES,
    }
  } else if (containsInvalidUsernameCharacters(value)) {
    return {
      status: STATUS.FAILURE,
      suggestions: null,
      message: ERROR.USERNAME.INVALID_CHARACTERS,
    }
  }
  return { status: STATUS.SUCCESS, message: '' }
}

// Validate and normalize the response from the API's validation
export function getUsernameStateFromServer({ availability, currentStatus }) {
  if (!availability && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, suggestions: null, message: ERROR.USERNAME.INVALID }
  }
  const username = availability.get('username')
  const suggestions = availability.get('suggestions')
  if (username) {
    return { status: STATUS.SUCCESS, suggestions: null, message: ERROR.NONE }
  } else if (!username && currentStatus !== STATUS.FAILURE) {
    return {
      status: STATUS.FAILURE,
      suggestions: suggestions.get('username', null),
      message: ERROR.USERNAME.EXISTS,
    }
  }
  return { status: STATUS.INDETERMINATE, suggestions: null, message: '' }
}

export function isValidEmail(value) {
  return value.match(/(.+)@(.+)\.([a-z]{2,})/)
}

// Client-side only validation
export function getEmailStateFromClient({ currentStatus, value }) {
  if (!value && !value.length && currentStatus) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  return (
    isValidEmail(value) ?
      { status: STATUS.SUCCESS, message: ERROR.NONE } :
      { status: STATUS.FAILURE, message: ERROR.EMAIL.INVALID }
  )
}

export const isValidInvitationCode = value => value.match(/^\S+$/)

export function getInvitationCodeStateFromClient({ currentStatus, value }) {
  if (!value && !value.length && currentStatus) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  return (
    isValidInvitationCode(value) ?
      { status: STATUS.SUCCESS, message: ERROR.NONE } :
      { status: STATUS.FAILURE, message: ERROR.INVITATION_CODE.INVALID }
  )
}

export function getInvitationCodeStateFromServer({ availability, currentStatus }) {
  if (!availability && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, message: ERROR.INVITATION_CODE.INVALID }
  }

  const invitationCode = availability.get('invitationCode')
  if (invitationCode) {
    return { status: STATUS.SUCCESS, message: '' }
  } else if (!invitationCode && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, message: ERROR.INVITATION_CODE.INVALID }
  }
  return { status: STATUS.INDETERMINATE, message: '' }
}

// Validate and normalize the response from the API's validation
export function getEmailStateFromServer({ availability, currentStatus }) {
  if (!availability && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, message: ERROR.EMAIL.INVALID }
  }
  const email = availability.get('email')
  const suggestions = availability.get('suggestions')
  const full = suggestions.getIn(['email', 'full'], null)
  const message = full && full.length ? `Did you mean ${full}?` : 'That email is invalid'
  if (email && currentStatus !== STATUS.SUCCESS) {
    return { status: STATUS.SUCCESS, message }
  } else if (!email && currentStatus !== STATUS.FAILURE) {
    return { status: STATUS.FAILURE, message }
  }
  return { status: STATUS.INDETERMINATE, message: '' }
}

export function isValidPassword(value) {
  return (/^.{8,128}$/).test(value)
}

export function getPasswordState({ currentStatus, value }) {
  if (!value && !value.length && currentStatus) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  return (
    isValidPassword(value) ?
      { status: STATUS.SUCCESS, message: '' } :
      { status: STATUS.FAILURE, message: ERROR.PASSWORD.TOO_SHORT }
  )
}

// TODO: This could probably validate each of the individual values
export function getBatchEmailState({ currentStatus, value }) {
  if (!value && !value.length && currentStatus) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  // return if the field only has commas and spaces
  if (value.replace(/(,|\s)/g, '').length === 0) {
    return { status: STATUS.INDETERMINATE, message: '' }
  }
  const emails = value.split(/[,\s]+/)
  return (
    emails.length > 0 ?
      { status: STATUS.SUCCESS, message: '' } :
      { status: STATUS.FAILURE, message: 'appears to be invalid.' }
  )
}

// Email or Username control
export function getUserStateFromClient({ currentStatus, value }) {
  if (!value && !value.length && currentStatus !== STATUS.INDETERMINATE) {
    return { status: STATUS.INDETERMINATE, suggestions: null, message: '' }
  }
  const usernameState = getUsernameStateFromClient({ currentStatus, value })
  const emailState = getEmailStateFromClient({ currentStatus, value })
  return (
    usernameState.status === STATUS.SUCCESS || emailState.status === STATUS.SUCCESS ?
      { status: STATUS.SUCCESS, message: ERROR.NONE } :
      { status: STATUS.FAILURE, message: ERROR.USERNAME_OR_EMAIL.INVALID }
  )
}

