/* eslint-disable no-use-before-define */
import { push } from 'react-router-redux'
import { call, put, select, take } from 'redux-saga/effects'
import { AUTHENTICATION } from 'ello-brains/constants/action_types'
import {
  selectAccessToken,
  selectRefreshToken,
  selectShouldUseAccessToken,
  selectShouldUseRefreshToken,
} from 'ello-brains/selectors/authentication'
import { refreshAuthenticationToken } from '../actions/authentication'

export function getHeaders(accessToken) {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
}

export function getHeadHeader(accessToken, lastCheck) {
  return {
    ...getHeaders(accessToken),
    'If-Modified-Since': lastCheck,
  }
}

export function* fetchCredentials() {
  const accessToken = yield select(selectAccessToken)
  if (yield select(selectShouldUseAccessToken)) {
    return yield {
      token: {
        access_token: accessToken,
      },
    }
  } else if (yield select(selectShouldUseRefreshToken)) {
    const refreshToken = yield select(selectRefreshToken)
    yield put(refreshAuthenticationToken(refreshToken))
    // Wait for the refresh to resolve
    const result = yield take([AUTHENTICATION.REFRESH_SUCCESS, AUTHENTICATION.REFRESH_FAILURE])
    if (result.type === AUTHENTICATION.REFRESH_SUCCESS) {
      // If successful, call fetchCredentials again to setup access_token.
      return yield call(fetchCredentials)
    } else if (result.type === AUTHENTICATION.REFRESH_FAILURE) {
      return yield put(push('/enter'))
    }
  }
  return yield call(getClientCredentials)
}

export function* getClientCredentials() {
  const tokenPath = (typeof window === 'undefined') ?
        `http://localhost:${process.env.PORT || 6660}/api/webapp-token` :
        `${document.location.protocol}//${document.location.host}/api/webapp-token`

  try {
    const response = yield call(fetch, tokenPath, { credentials: 'same-origin' })
    if (response.ok) {
      // Pass response as binding for response.json
      return yield call([response, response.json])
    }
    return response
  } catch (_err) {
    return yield call(fetchCredentials)
  }
}

function checkStatus(response) {
  if (response.ok) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export function extractJSON(response) {
  return response ? response.json() : response
}

export function* sagaFetch(path, options) {
  const response = yield call(fetch, path, options)
  checkStatus(response)

  // allow for the json to be empty for a 202/204
  let json = {}
  if ((response.status === 200 || response.status === 201) &&
      /application\/json/.test(response.headers.get('content-type'))) {
    json = yield call(extractJSON, response)
  }
  return { serverResponse: response, json }
}
