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
    state = { json }
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
      state = { json }
      const props = { user: Immutable.Map({ id: '1' }) }
      expect(selector.selectUserFromPropsUserId(state, props)).to.deep.equal(usr)
      state.change = 1
      expect(selector.selectUserFromPropsUserId(state, props)).to.deep.equal(usr)
      expect(selector.selectUserFromPropsUserId.recomputations()).to.equal(1)
    })
  })

  context('#selectUserFromUsername', () => {
    it('returns the user from json', () => {
      const usr = stub('user', { username: 'mansfield' })
      state = { json }
      const props = { params: { username: 'mansfield' } }
      expect(selector.selectUserFromUsername(state, props)).to.deep.equal(usr)
    })
  })

  context('#selectRelationshipPriority', () => {
    it('returns the user priority from json', () => {
      state = { json: state.json.setIn(['users', '1', 'relationshipPriority'], 'friend') }
      const props = { user: Immutable.Map({ id: '1' }) }
      expect(selector.selectRelationshipPriority(state, props)).to.equal('friend')
    })
  })

  context('#selectTruncatedShortBio', () => {
    it('returns a truncated short bio to 160 characters', () => {
      state = { json: state.json.setIn(['users', '1', 'formattedShortBio'], pad('', 500, '<b>this is some bold text</b>')) }
      const props = { user: Immutable.Map({ id: '1' }) }
      const truncatedShortBio = selector.selectTruncatedShortBio(state, props)
      expect(truncatedShortBio.text.length).to.equal(160)
      expect(truncatedShortBio.html).to.contain('<b>')
    })
  })

  context('#selectUserMetaAttributes', () => {
    it('returns the user meta attributes', () => {
      const usr = stub('user')
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      const attr = Immutable.fromJS({
        description: 'meta user description',
        image: 'meta-user-image.jpg',
        robots: 'index, follow',
        title: 'meta user title',
      })
      state = { json }
      expect(selector.selectUserMetaAttributes(state, props)).to.deep.equal(attr)
    })
  })

  context('#selectUserMetaDescription', () => {
    it('returns the user meta description', () => {
      const usr = stub('user')
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      state = { json }
      expect(selector.selectUserMetaDescription(state, props)).to.equal('meta user description')
    })
  })

  context('#selectUserMetaImage', () => {
    it('returns the user meta description', () => {
      const usr = stub('user')
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      state = { json }
      expect(selector.selectUserMetaImage(state, props)).to.equal('meta-user-image.jpg')
    })
  })

  context('#selectUserMetaRobots', () => {
    it('returns the user meta robot instructions', () => {
      const usr = stub('user', { username: 'archer' })
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      state = { json }
      expect(selector.selectUserMetaRobots(state, props)).to.deep.equal('index, follow')
    })
  })

  context('#selectUserMetaTitle', () => {
    it('returns the user meta title', () => {
      const usr = stub('user', { username: 'pam' })
      const props = { user: Immutable.Map({ id: '1' }), params: { username: usr.get('username') } }
      state = { json }
      expect(selector.selectUserMetaTitle(state, props)).to.equal('meta user title')
    })
  })
})

