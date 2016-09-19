import { stub } from '../../support/stubs'
import * as selector from '../../../src/selectors/user'

describe('post selectors', () => {
  let stateUser
  let propsUser
  beforeEach(() => {
    stateUser = stub('user', { id: 'stateUser' })
    propsUser = stub('user', { id: 'propsUser' })
  })

  afterEach(() => {
    stateUser = {}
    propsUser = {}
  })

  context('#selectPropsUser', () => {
    it('returns the correct props post', () => {
      const state = { json: { users: stateUser } }
      const props = { user: propsUser }
      expect(selector.selectPropsUser(state, props)).to.deep.equal(propsUser)
    })
  })

  context('#selectPropsUserId', () => {
    it('returns the correct props user id', () => {
      const state = { json: { users: stateUser } }
      const props = { user: propsUser }
      expect(selector.selectPropsUserId(state, props)).to.equal('propsUser')
    })
  })

  context('#selectUsers', () => {
    it('returns the correct users from json', () => {
      const state = { json: { users: stateUser } }
      const props = { user: propsUser }
      expect(selector.selectUsers(state, props)).to.deep.equal(stateUser)
    })
  })

  context('#selectUser', () => {
    it('returns the correct user from json with a props', () => {
      const state = { json: { users: { stateUser: { ...stateUser } } } }
      const props = { user: { id: 'stateUser' } }
      expect(selector.selectUser(state, props)).to.deep.equal(stateUser)
    })
  })

  context('#selectUserFromPropsUserId', () => {
    it('returns the user from json', () => {
      const usr = stub('user')
      const state = { json: { users: { 1: { ...usr } } } }
      const props = { user: { id: '1' } }
      expect(selector.selectUserFromPropsUserId(state, props)).to.deep.equal(usr)
      const nextState = { ...state, change: 1 }
      expect(selector.selectUserFromPropsUserId(nextState, props)).to.deep.equal(usr)
      expect(selector.selectUserFromPropsUserId.recomputations()).to.equal(1)
    })
  })

  context('#selectUserFromUsername', () => {
    it('returns the user from json', () => {
      const usr = stub('user', { username: 'mansfield' })
      const state = { json: { users: { 1: { ...usr } } } }
      const props = { params: { username: 'mansfield' } }
      expect(selector.selectUserFromUsername(state, props)).to.deep.equal(usr)
    })
  })

  context('#selectRelationshipPriority', () => {
    it('returns the user priority from json', () => {
      const state = { json: { users: { 1: { ...stateUser, relationshipPriority: 'friend' } } } }
      const props = { user: { id: '1' } }
      expect(selector.selectRelationshipPriority(state, props)).to.equal('friend')
    })
  })

  context('#selectUserMetaDescription', () => {
    it('returns the user meta description', () => {
      const usr = stub('user')
      const bio = usr.formattedShortBio.replace(/[<\/p>]/gi, '')
      let state = { json: { users: { 1: { ...usr } } } }
      const props = { user: { id: '1' }, params: { username: usr.username } }
      expect(selector.selectUserMetaDescription(state, props)).to.deep.equal(bio)
      state = { ...state, change: 1 }
      expect(selector.selectUserMetaDescription(state, props)).to.deep.equal(bio)
      expect(selector.selectUserMetaDescription.recomputations()).to.equal(1)
    })
  })

  context('#selectUserMetaImage', () => {
    it('returns the user meta description', () => {
      const usr = stub('user')
      const img = usr.coverImage.optimized.url
      let state = { json: { users: { 1: { ...usr } } } }
      const props = { user: { id: '1' }, params: { username: usr.username } }
      expect(selector.selectUserMetaImage(state, props)).to.deep.equal(img)
      state = { ...state, change: 1 }
      expect(selector.selectUserMetaImage(state, props)).to.deep.equal(img)
      expect(selector.selectUserMetaImage.recomputations()).to.equal(1)
    })
  })

  context('#selectUserMetaRobots', () => {
    it('returns the user meta robot instructions', () => {
      const usr = stub('user')
      let state = { json: { users: { 1: { ...usr } } } }
      const props = { user: { id: '1' }, params: { username: usr.username } }
      expect(selector.selectUserMetaRobots(state, props)).to.deep.equal('index, follow')
      state = { ...state, change: 1 }
      expect(selector.selectUserMetaRobots(state, props)).to.deep.equal('index, follow')
      expect(selector.selectUserMetaRobots.recomputations()).to.equal(1)

      const newState = { json: { users: { 1: { ...usr, badForSeo: true } } } }
      expect(selector.selectUserMetaRobots(newState, props)).to.deep.equal('noindex, follow')
      expect(selector.selectUserMetaRobots.recomputations()).to.equal(2)
    })
  })

  context('#selectUserMetaTitle', () => {
    it('returns the user meta title', () => {
      const usr = stub('user')
      let state = { json: { users: { 1: { ...usr } } } }
      const props = { user: { id: '1' }, params: { username: usr.username } }
      expect(selector.selectUserMetaTitle(state, props)).to.deep.equal('name (@username) | Ello')
      state = { ...state, change: 1 }
      expect(selector.selectUserMetaTitle(state, props)).to.deep.equal('name (@username) | Ello')
      expect(selector.selectUserMetaTitle.recomputations()).to.equal(1)

      const newState = { json: { users: { 1: { ...usr, name: null } } } }
      expect(selector.selectUserMetaTitle(newState, props)).to.deep.equal('@username | Ello')
      expect(selector.selectUserMetaTitle.recomputations()).to.equal(2)
    })
  })
})

