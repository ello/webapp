/* eslint-disable new-cap */
import Immutable from 'immutable'
import React from 'react'
import { LOCATION_CHANGE } from 'react-router-redux'
import reducer from '../../../src/reducers/modal'
import { ALERT, AUTHENTICATION, MODAL, PROFILE } from '../../../src/constants/action_types'

describe('modal reducer', () => {
  const initialState = reducer(undefined, {})
  const openAlertAction = {
    type: ALERT.OPEN,
    payload: {
      classList: 'AlertClassName',
      component: <p>Component</p>,
      isActive: true,
      kind: 'Alert',
      type: null,
    },
  }

  const closeAlertAction = {
    type: ALERT.CLOSE,
    payload: {
      classList: null,
      component: null,
      isActive: false,
      kind: 'Alert',
      type: null,
    },
  }

  const openModalAction = {
    type: MODAL.OPEN,
    payload: {
      classList: 'ModalClassName',
      component: <p>Component</p>,
      isActive: true,
      kind: 'Modal',
      type: null,
    },
  }

  const closeModalAction = {
    type: MODAL.CLOSE,
    payload: {
      classList: null,
      component: null,
      isActive: false,
      kind: 'Modal',
      type: null,
    },
  }

  context('#initialState', () => {
    it('sets up a default initialState', () => {
      expect(
        reducer(undefined, {}),
      ).to.have.keys(
        'classList',
        'component',
        'isActive',
        'kind',
        'type',
      )
    })
  })

  context('ALERT', () => {
    it('ALERT.OPEN opens the alert', () => {
      const result = reducer(undefined, openAlertAction)
      expect(result).to.deep.equal(Immutable.fromJS(openAlertAction.payload).set('component', openAlertAction.payload.component))
    })

    it('ALERT.CLOSE closes the alert', () => {
      const result = reducer(undefined, closeAlertAction)
      expect(result).to.deep.equal(Immutable.fromJS(closeAlertAction.payload).set('component', closeAlertAction.payload.component))
    })
  })

  context('MODAL', () => {
    it('MODAL.OPEN opens the modal', () => {
      const result = reducer(undefined, openModalAction)
      expect(result).to.deep.equal(Immutable.fromJS(openModalAction.payload).set('component', openModalAction.payload.component))
    })

    it('MODAL.CLOSE closes the modal', () => {
      const result = reducer(undefined, closeModalAction)
      expect(result).to.deep.equal(Immutable.fromJS(closeModalAction.payload).set('component', closeModalAction.payload.component))
    })
  })

  context('AUTHENTICATION', () => {
    it('AUTHENTICATION.LOGOUT_SUCCESS resets the initial state', () => {
      const result = reducer(undefined, openModalAction)
      expect(result).to.deep.equal(Immutable.fromJS(openModalAction.payload).set('component', openModalAction.payload.component))
      const action = { type: AUTHENTICATION.LOGOUT_SUCCESS }
      const nextResult = reducer(result, action)
      expect(nextResult).to.equal(initialState)
    })
  })

  context('PROFILE', () => {
    it('PROFILE.DELETE_SUCCESS resets the initial state', () => {
      const result = reducer(undefined, openModalAction)
      expect(result).to.deep.equal(Immutable.fromJS(openModalAction.payload).set('component', openModalAction.payload.component))
      const action = { type: PROFILE.DELETE_SUCCESS }
      const nextResult = reducer(result, action)
      expect(nextResult).to.equal(initialState)
    })
  })

  context('LOCATION', () => {
    it('LOCATION_CHANGE resets the initial state if the modal is active', () => {
      const result = reducer(undefined, openModalAction)
      expect(result).to.deep.equal(Immutable.fromJS(openModalAction.payload).set('component', openModalAction.payload.component))
      const action = { type: LOCATION_CHANGE, payload: { pathname: '/discover/trending' } }
      const nextResult = reducer(result, action)
      expect(nextResult).to.equal(initialState)
    })

    it('LOCATION_CHANGE does not reset the initial state if the modal is active', () => {
      const result = reducer(undefined, openAlertAction)
      expect(result).to.deep.equal(Immutable.fromJS(openAlertAction.payload).set('component', openAlertAction.payload.component))
      const nextResult = reducer(result, closeAlertAction)
      expect(nextResult).to.deep.equal(Immutable.fromJS(closeAlertAction.payload))
      const action = { type: LOCATION_CHANGE, payload: { pathname: '/discover/trending' } }
      const lastResult = reducer(nextResult, action)
      expect(lastResult).to.deep.equal(nextResult)
      expect(Immutable.is(lastResult, nextResult)).to.be.true
    })
  })
})

