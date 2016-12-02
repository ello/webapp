// set global ENV for testing since
// webpack doesn't inject it here
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { camelize } from 'humps'

// React helpers
export function getRenderedComponent(component, options = {}, children = null) {
  const shallowRenderer = TestUtils.createRenderer()
  shallowRenderer.render(React.createElement(component, options, children))
  return shallowRenderer.getRenderOutput()
}

export function renderIntoDocument(component, options = {}, children = null) {
  return TestUtils.renderIntoDocument(React.createElement(component, options, children))
}

// object key helpers
function isValidStreamMetaKey(key) {
  const validKeys = [
    'mappingType',
    'renderStream',
    'resultFilter',
    'resultKey',
    'updateKey',
  ]
  return validKeys.indexOf(key) > -1
}

export function hasStreamMetadata(action) {
  return (
    typeof action.meta !== 'undefined' &&
    Object.keys(action.meta).every(isValidStreamMetaKey)
  )
}

function isValidFSAKey(key) {
  const validKeys = [
    'type',
    'payload',
    'error',
    'meta',
  ]
  return validKeys.indexOf(key) > -1
}

// Ensures that the constant (action.type) and actionCreator (fn.name) are
// known or sort of equal in a couple of ways.
export function isFSAName(action, fn) {
  // Top level ActionType
  if (['LOAD_STREAM'].indexOf(action.type) > -1) { return true }
  const names = camelize(action.type.toLowerCase()).split('.')
  const namespace = names[0]
  const type = names.length >= 1 ? names[1] : null
  // GUI.SET_IS_PROFILE_MENU_ACTIVE === setIsProfileMenuActive
  if (type && type === fn.name) { return true }
  // USER.FLAG === flagUser
  return type && camelize([type, namespace].join('_')) === fn.name
}

export function isFSA(action) {
  return (
    typeof action.type !== 'undefined' &&
    Object.keys(action).every(isValidFSAKey)
  )
}

function isValidResultKey(key) {
  const validKeys = [
    'type',
    'ids',
    'pagination',
  ]
  return validKeys.indexOf(key) > -1
}

export function isValidResult(result) {
  return (
    typeof result.get('type') !== 'undefined' &&
    result.keySeq().every(isValidResultKey)
  )
}

