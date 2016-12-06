import Immutable from 'immutable'
import pad from 'lodash/pad'
import { clearJSON, json, stub } from '../../support/stubs'
import * as selector from '../../../src/selectors/user'

describe('user selectors', () => {
  let stateUser
  let propsUser
  let state
  beforeEach(() => {
    stateUser = stub('user', { id: 'stateUser' })
    propsUser = stub('user', { id: 'propsUser' })
    state = Immutable.fromJS({ json })
  })

  afterEach(() => {
    stateUser = {}
    propsUser = {}
    clearJSON()
  })

  context('#selectPropsUser', () => {
    it('returns the correct props post', () => {
      const props = { user: propsUser }
      expect(selector.selectPropsUser(state, props)).to.deep.equal(propsUser)
    })
  })

  context('#selectPropsUserId', () => {
    it('returns the correct props user id', () => {
      const props = { user: propsUser }
      expect(selector.selectPropsUserId(state, props)).to.equal('propsUser')
    })
  })

  context('#selectUser', () => {
    it('returns the correct user from json with a props', () => {
      const props = { user: Immutable.Map({ id: 'stateUser' }) }
      expect(selector.selectUser(state, props)).to.deep.equal(stateUser)
    })
  })

  context('#selectUserFromPropsUserId', () => {
    it('returns the user from json', () => {
      const usr = stub('user')
      state = Immutable.fromJS({ json })
      const props = { user: Immutable.Map({ id: '1' }) }
      expect(selector.selectUserFromPropsUserId(state, props)).to.deep.equal(usr)
      state = state.set('change', 1)
      expect(selector.selectUserFromPropsUserId(state, props)).to.deep.equal(usr)
      expect(selector.selectUserFromPropsUserId.recomputations()).to.equal(1)
    })
  })

  context('#selectUserFromUsername', () => {
    it('returns the user from json', () => {
      const usr = stub('user', { username: 'mansfield' })
      state = Immutable.fromJS({ json })
      const props = { params: { username: 'mansfield' } }
      expect(selector.selectUserFromUsername(state, props)).to.deep.equal(usr)
    })
  })

  context('#selectRelationshipPriority', () => {
    it('returns the user priority from json', () => {
      state = state.setIn(['json', 'users', '1', 'relationshipPriority'], 'friend')
      const props = { user: Immutable.Map({ id: '1' }) }
      expect(selector.selectRelationshipPriority(state, props)).to.equal('friend')
    })
  })

  context('#selectTruncatedShortBio', () => {
    it('returns a truncated short bio to 160 characters', () => {
      state = state.setIn(['json', 'users', '1', 'formattedShortBio'], pad('', 500, '<b>this is some bold text</b>'))
      const props = { user: Immutable.Map({ id: '1' }) }
      const truncatedShortBio = selector.selectTruncatedShortBio(state, props)
      expect(truncatedShortBio.text.length).to.equal(160)
      expect(truncatedShortBio.html).to.contain('<b>')
    })
  })

  context('#selectUserMetaDescription', () => {
    it('returns the user meta description', () => {
      const usr = stub('user')
      const bio = usr.get('formattedShortBio').replace(/[</p>]/gi, '')
      state = Immutable.fromJS({ json })
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      expect(selector.selectUserMetaDescription(state, props)).to.deep.equal(bio)
      state = state.set('change', 1)
      expect(selector.selectUserMetaDescription(state, props)).to.deep.equal(bio)
      expect(selector.selectUserMetaDescription.recomputations()).to.equal(1)
    })
  })

  context('#selectUserMetaImage', () => {
    it('returns the user meta description', () => {
      const usr = stub('user')
      const img = usr.getIn(['coverImage', 'optimized', 'url'])
      state = Immutable.fromJS({ json })
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      expect(selector.selectUserMetaImage(state, props)).to.deep.equal(img)
      state = state.set('change', 1)
      expect(selector.selectUserMetaImage(state, props)).to.deep.equal(img)
      expect(selector.selectUserMetaImage.recomputations()).to.equal(1)
    })
  })

  context('#selectUserMetaRobots', () => {
    it('returns the user meta robot instructions', () => {
      const usr = stub('user', { username: 'archer' })
      state = Immutable.fromJS({ json })
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      expect(selector.selectUserMetaRobots(state, props)).to.deep.equal('index, follow')
      state = state.set('change', 1)
      expect(selector.selectUserMetaRobots(state, props)).to.deep.equal('index, follow')
      expect(selector.selectUserMetaRobots.recomputations()).to.equal(1)

      state = state.setIn(['json', 'users', '1', 'badForSeo'], true)
      expect(selector.selectUserMetaRobots(state, props)).to.deep.equal('noindex, follow')
      expect(selector.selectUserMetaRobots.recomputations()).to.equal(2)
    })
  })

  context('#selectUserMetaTitle', () => {
    it('returns the user meta title', () => {
      const usr = stub('user', { username: 'pam' })
      state = Immutable.fromJS({ json })
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      expect(selector.selectUserMetaTitle(state, props)).to.deep.equal('name (@pam) | Ello')
      state = state.set('change', 1)
      expect(selector.selectUserMetaTitle(state, props)).to.deep.equal('name (@pam) | Ello')
      expect(selector.selectUserMetaTitle.recomputations()).to.equal(1)

      state = state.setIn(['json', 'users', '1', 'name'], null)
      expect(selector.selectUserMetaTitle(state, props)).to.deep.equal('@pam | Ello')
      expect(selector.selectUserMetaTitle.recomputations()).to.equal(2)
    })
  })
})

