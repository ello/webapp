import { isFSA, isFSAName } from '../../support/test_helpers'
import * as subject from '../../../src/actions/gui'

describe('gui actions', () => {
  context('#setActiveUserFollowingType', () => {
    const action = subject.setActiveUserFollowingType('noise')

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setActiveUserFollowingType)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('tab')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.tab).to.equal('noise')
    })
  })

  context('#setIsNavbarHidden', () => {
    const action = subject.setIsNavbarHidden({ isHidden: false })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setIsNavbarHidden)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys(
        'isNavbarHidden',
      )
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isNavbarHidden).to.be.false
    })
  })

  context('#setIsProfileMenuActive', () => {
    const action = subject.setIsProfileMenuActive({ isActive: true })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setIsProfileMenuActive)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('isProfileMenuActive')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isProfileMenuActive).to.be.true
    })
  })

  context('#setLastDiscoverBeaconVersion', () => {
    const action = subject.setLastDiscoverBeaconVersion({ version: '666' })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setLastDiscoverBeaconVersion)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('version')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.version).to.equal('666')
    })
  })

  context('#setLastFollowingBeaconVersion', () => {
    const action = subject.setLastFollowingBeaconVersion({ version: '667' })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setLastFollowingBeaconVersion)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('version')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.version).to.equal('667')
    })
  })

  context('#setLastStarredBeaconVersion', () => {
    const action = subject.setLastStarredBeaconVersion({ version: '668' })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setLastStarredBeaconVersion)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('version')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.version).to.equal('668')
    })
  })

  context('#setViewportSizeAttributes', () => {
    const action = subject.setViewportSizeAttributes({
      columnCount: 4,
      innerHeight: 768,
      innerWidth: 1360,
    })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.setViewportSizeAttributes)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys(
        'columnCount',
        'innerHeight',
        'innerWidth',
      )
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.columnCount).to.equal(4)
      expect(action.payload.innerHeight).to.equal(768)
      expect(action.payload.innerWidth).to.equal(1360)
    })
  })

  context('#toggleNotifications', () => {
    const action = subject.toggleNotifications({ isActive: true })

    it('is an FSA compliant action', () => {
      expect(isFSA(action)).to.be.true
    })

    it('has similar action.name and action.type', () => {
      expect(isFSAName(action, subject.toggleNotifications)).to.be.true
    })

    it('has a payload with the correct keys', () => {
      expect(action.payload).to.have.keys('isNotificationsActive')
    })

    it('sets the appropriate payload', () => {
      expect(action.payload.isNotificationsActive).to.be.true
    })
  })
})

