/* eslint-disable max-len */
import { isValidResult } from '../../support/test_helpers'
import { stub, json, clearJSON } from '../../support/stubs'
import * as subject from '../../../src/reducers/json'
import * as ACTION_TYPES from '../../../src/constants/action_types'
import * as MAPPING_TYPES from '../../../src/constants/mapping_types'

function stubJSONStore() {
  // add some users
  stub('user', { id: '1', username: 'archer' })
  stub('user', { id: '2', username: 'lana' })
  stub('user', { id: '3', username: 'cyril' })
  stub('user', { id: '4', username: 'pam' })
  stub('user', { id: 'inf', followersCount: '∞', username: 'ello' })
  // add some posts
  stub('post', { id: '1', repostsCount: 1, token: 'token1', authorId: '1' })
  stub('post', { id: '2', repostsCount: 1, token: 'token2', authorId: '2' })
  stub('post', { id: '3', repostsCount: 1, token: 'token3', authorId: '3' })
  stub('post', { id: '4', repostsCount: 1, token: 'token4', authorId: '4' })
}

describe('json reducer', () => {
  beforeEach(() => {
    stubJSONStore()
    json.pages = {}
  })

  afterEach(() => {
    clearJSON()
    delete json.pages
  })

  describe('#updateUserCount', () => {
    it('should update the count', () => {
      subject.methods.updateUserCount(json, '1', 'followersCount', 1)
      expect(json.users['1'].followersCount).to.equal(1)
      subject.methods.updateUserCount(json, '1', 'followersCount', 1)
      expect(json.users['1'].followersCount).to.equal(2)
    })
    it('should set the count', () => {
      subject.methods.updateUserCount(json, '1', 'undefinedCount', 1)
      expect(json.users['1'].undefinedCount).to.equal(1)
    })
    it('should ignore ∞', () => {
      subject.methods.updateUserCount(json, 'inf', 'followersCount', 1)
      expect(json.users.inf.followersCount).to.equal('∞')
    })
  })

  describe('#updatePostCount', () => {
    it('should update the count', () => {
      subject.methods.updatePostCount(json, '1', 'repostsCount', 1)
      expect(json.posts['1'].repostsCount).to.equal(2)
      subject.methods.updatePostCount(json, '1', 'repostsCount', 1)
      expect(json.posts['1'].repostsCount).to.equal(3)
    })
    it('should set the count', () => {
      subject.methods.updatePostCount(json, '1', 'undefinedCount', 1)
      expect(json.posts['1'].undefinedCount).to.equal(1)
    })
  })

  describe('#appendPageId', () => {
    it('should add the id to null', () => {
      const store = {}
      subject.methods.appendPageId(store, '/page', 'users', 'foo')
      expect(store.pages['/page'].ids.indexOf('foo')).not.to.equal(-1)
    })
    it('should add the type to null', () => {
      const store = {}
      subject.methods.appendPageId(store, '/page', 'users', 'foo')
      expect(store.pages['/page'].type).to.equal('users')
    })
    it('should add the id to []', () => {
      const store = { pages: { '/page': { ids: [] } } }
      subject.methods.appendPageId(store, '/page', 'users', 'foo')
      expect(store.pages['/page'].ids.indexOf('foo')).not.to.equal(-1)
    })
    it('should add the id to [1,2,3]', () => {
      const store = { pages: { '/page': { ids: [1, 2, 3] } } }
      subject.methods.appendPageId(store, '/page', 'users', 'foo')
      expect(store.pages['/page'].ids.indexOf('foo')).not.to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(1)).not.to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(2)).not.to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(3)).not.to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(4)).to.equal(-1)
    })
  })
  describe('#removePageId', () => {
    it('should do nothing to null', () => {
      const store = {}
      subject.methods.removePageId(store, '/page', 'foo')
      expect(store.pages).to.be.undefined
    })
    it('should do nothing to []', () => {
      const store = { pages: { '/page': { ids: [] } } }
      subject.methods.removePageId(store, '/page', 'foo')
      expect(store.pages['/page'].ids.length).to.equal(0)
    })
    it('should remove the id from [foo]', () => {
      const store = { pages: { '/page': { ids: [1, 'foo', 2, 3] } } }
      subject.methods.removePageId(store, '/page', 'foo')
      expect(store.pages['/page'].ids.indexOf('foo')).to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(1)).not.to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(2)).not.to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(3)).not.to.equal(-1)
      expect(store.pages['/page'].ids.indexOf(4)).to.equal(-1)
    })
  })

  describe('#mergeModel', () => {
    it('does not modify state if there is no id in params', () => {
      subject.methods.mergeModel(json, MAPPING_TYPES.USERS, { username: 'new' })
      expect(json.users['1'].username).to.equal('archer')
    })

    it('modifies state if there is an id in params', () => {
      subject.methods.mergeModel(json, MAPPING_TYPES.USERS, { id: '1', username: 'new' })
      expect(json.users['1'].username).to.equal('new')
    })
  })

  describe('#addModels', () => {
    it('creates a new type on state if it does not exist', () => {
      expect(json.assets).to.be.undefined
      const ids = subject.methods.addModels(json, MAPPING_TYPES.ASSETS, {})
      expect(json.assets).not.to.be.null
      expect(ids).to.be.empty
    })

    it('adds arrays of models', () => {
      expect(json.users['5']).to.be.undefined
      expect(json.users['6']).to.be.undefined
      const data = {}
      data.users = []
      data.users.push(stub('user', { id: '5', username: 'carol' }))
      data.users.push(stub('user', { id: '6', username: 'malory' }))
      const ids = subject.methods.addModels(json, MAPPING_TYPES.USERS, data)
      expect(json.users['5'].username).to.equal('carol')
      expect(json.users['6'].username).to.equal('malory')
      expect(ids).to.deep.equal(['5', '6'])
    })

    it('adds a single model object to the state', () => {
      expect(json.users['123']).to.be.undefined
      const data = {}
      data.users = stub('user', { id: '123', username: 'carol' })
      const ids = subject.methods.addModels(json, MAPPING_TYPES.USERS, data)
      expect(json.users['123'].username).to.equal('carol')
      expect(ids).to.deep.equal(['123'])
    })
  })


  describe('#addNewIdsToResult', () => {
    it('returns the original state if no result.morePostIds', () => {
      const state = { yo: 'yo', mama: 'mama' }
      json.pages = { sweetpath: { } }
      expect(subject.methods.addNewIdsToResult(state, json)).to.equal(state)
    })

    it('concats the existing result ids to the morePostIds and deletes the old morePostIds', () => {
      json.pages = { sweetpath: { morePostIds: ['1', '2', '3'], ids: ['10', '20', '30'] } }
      subject.setPath('sweetpath')
      subject.methods.addNewIdsToResult({}, json)
      expect(json.pages.sweetpath.morePostIds).to.be.undefined
      expect(json.pages.sweetpath.ids).to.deep.equal(['1', '2', '3', '10', '20', '30'])
    })
  })

  describe('#parseLinked', () => {
    it('does nothing if linked is not defined', () => {
      expect(subject.methods.parseLinked()).to.be.undefined
    })

    it('parses linked node', () => {
      const linked = {}
      linked.assets = [{ id: 'sup' }, { id: 'dawg' }]
      linked.users = [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }]
      expect(json.assets).to.be.undefined
      expect(json.users.yo).to.be.undefined
      expect(json.users.mama).to.be.undefined
      subject.methods.parseLinked(linked, json)
      expect(json.assets.sup).not.to.be.null
      expect(json.assets.dawg).not.to.be.null
      expect(json.users.yo.username).to.equal('yo')
      expect(json.users.mama.username).to.equal('mama')
    })
  })

  describe('#getResult', () => {
    it('returns the filtered result if a #resultFilter is specified', () => {
      const response = { users: [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }] }
      const action = { meta: {} }
      action.meta.mappingType = MAPPING_TYPES.USERS
      action.payload = { pagination: '' }
      action.meta.resultFilter = (users) => {
        const stuff = { usernames: users.map(user => user.username) }
        return stuff
      }
      const result = subject.methods.getResult(response, json, action)
      expect(result).to.deep.equal({ usernames: ['yo', 'mama'], pagination: '' })
    })

    it('returns the correct result', () => {
      const response = { users: [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }] }
      const action = { meta: {} }
      action.meta.mappingType = MAPPING_TYPES.USERS
      action.payload = { pagination: '' }
      const result = subject.methods.getResult(response, json, action)
      expect(isValidResult(result)).to.be.true
      expect(result).to.deep.equal({ ids: ['yo', 'mama'], type: MAPPING_TYPES.USERS, pagination: '' })
    })
  })

  describe('#updateResult', () => {
    afterEach(() => {
      subject.methods.getResult.restore()
    })

    context('action.type === LOAD_STREAM_SUCCESS', () => {
      it('sets the result when it does not exist', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => result)
        const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: {} }
        action.meta.mappingType = MAPPING_TYPES.USERS
        subject.setPath('sweetness')
        expect(json.pages.sweetness).to.be.undefined
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness).to.equal(result)
      })

      context('with an existingResult and existingResult.ids[0] !== result.ids[0]', () => {
        it('adds morePostIds if hasLoadedFirstStream && it is not a nested result && the index is greater than 0', () => {
          const result = { pagination: 'sweet' }
          sinon.stub(subject.methods, 'getResult', () => result)
          // json.pages = { sweetness: { ids: ['1', '2'], next: { ids: ['1', '2'] } } }
          // const result = { pagination: 'sweet', ids: ['3'] }
          // sinon.stub(subject.methods, 'getResult', () => { return result })
          // const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: {} }
          // subject.setPath('sweetness')
          // subject.methods.updateResult({}, json, action)
          // expect(json.pages.sweetness).to.deep.equal({ next: { ids: ['1', '2'] }, ...result })
        })

        it('overrides the existing result if the above condition is not met', () => {
          const result = { pagination: 'sweet' }
          sinon.stub(subject.methods, 'getResult', () => result)
        })
      })

      it('overlays the result with the existingResult when existingResult and resultKey', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => result)
      })

      it('resets the result', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => result)
      })

      it('uses the resultKey to update the storage location within json.pages', () => {
        const result = { pagination: 'sweet' }
        sinon.stub(subject.methods, 'getResult', () => result)
        const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { resultKey: 'yo' } }
        action.meta.mappingType = MAPPING_TYPES.USERS
        subject.setPath('sweetness')
        expect(json.pages.yo).to.be.undefined
        subject.methods.updateResult({}, json, action)
        expect(json.pages.yo).to.equal(result)
      })
    })

    context('action.type === LOAD_NEXT_CONTENT_SUCCESS', () => {
      it('sets the next property of result when it does not exist', () => {
        json.pages = { sweetness: { pagination: 'cool' } }
        const result = { pagination: 'sweet', ids: ['2', '3', '4'] }
        sinon.stub(subject.methods, 'getResult', () => result)
        const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: {} }
        subject.setPath('sweetness')
        expect(json.pages.sweetness.next).to.be.undefined
        expect(json.pages.sweetness.pagination).to.equal('cool')
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness.next).to.equal(result)
        expect(json.pages.sweetness.pagination).to.equal('sweet')
      })

      it('updates the next property of result when it exists', () => {
        json.pages = { sweetness: { next: { ids: ['1', '2'] }, pagination: 'cool' } }
        sinon.stub(subject.methods, 'getResult', () => {
          const stuff = { pagination: 'sweet', ids: ['2', '3', '4'] }
          return stuff
        })
        const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: {} }
        subject.setPath('sweetness')
        expect(json.pages.sweetness.next).to.deep.equal({ ids: ['1', '2'] })
        expect(json.pages.sweetness.pagination).to.equal('cool')
        subject.methods.updateResult({}, json, action)
        expect(json.pages.sweetness.next).to.deep.equal({ ids: ['1', '2', '3', '4'] })
        expect(json.pages.sweetness.pagination).to.equal('sweet')
      })

      it('uses the resultKey to update the storage location within json.pages', () => {
        json.pages = { yo: { pagination: 'cool' } }
        const result = { pagination: 'sweet', ids: ['2', '3', '4'] }
        sinon.stub(subject.methods, 'getResult', () => result)
        const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: { resultKey: 'yo' } }
        subject.setPath('sweetness')
        expect(json.pages.yo.next).to.be.undefined
        expect(json.pages.yo.pagination).to.equal('cool')
        subject.methods.updateResult({}, json, action)
        expect(json.pages.yo.next).to.deep.equal({ ids: ['2', '3', '4'], pagination: 'sweet' })
        expect(json.pages.yo.pagination).to.equal('sweet')
      })
    })
  })

  describe('#deleteModel', () => {
    it('restores a post on failure', () => {
      const post = json.posts['1']
      expect(post).not.to.be.undefined
      const action = { type: ACTION_TYPES.POST.DELETE_FAILURE }
      action.payload = { model: post }
      subject.methods.deleteModel({ state: 'yo' }, json, action, MAPPING_TYPES.POSTS)
      expect(json.posts['1']).not.to.be.undefined
    })

    it('returns a passed in state if type is not supported', () => {
      const post = json.posts['1']
      expect(post).not.to.be.undefined
      const action = { type: 'blah' }
      action.payload = { model: post }
      expect(subject.methods.deleteModel({ state: 'yo' }, json, action, MAPPING_TYPES.POSTS)).to.deep.equal({ state: 'yo' })
    })
  })

  describe('#json', () => {
    function methodCalledWithActions(methods, method, actions) {
      const spy = sinon.stub(methods, method)
      actions.forEach((action) => {
        subject.json(json, { type: action })
        expect(spy.called).to.be.true
      })
      spy.restore()
    }

    it('calls #methods.addNewIdsToResult', () => {
      methodCalledWithActions(subject.methods, 'addNewIdsToResult', [
        ACTION_TYPES.ADD_NEW_IDS_TO_RESULT,
      ])
    })

    context('with comment actions', () => {
      it('calls #methods.deleteModel', () => {
        methodCalledWithActions(subject.methods, 'deleteModel', [
          ACTION_TYPES.COMMENT.DELETE_REQUEST,
          ACTION_TYPES.COMMENT.DELETE_SUCCESS,
          ACTION_TYPES.COMMENT.DELETE_FAILURE,
        ])
      })
    })

    context('with post actions', () => {
      it('calls #postMethods.addOrUpdatePost', () => {
        console.log('POST METHODS', subject)
        methodCalledWithActions(subject.postMethods, 'addOrUpdatePost', [
          ACTION_TYPES.POST.CREATE_FAILURE,
          ACTION_TYPES.POST.CREATE_SUCCESS,
          ACTION_TYPES.POST.UPDATE_SUCCESS,
        ])
      })

      it('calls #methods.deleteModel', () => {
        methodCalledWithActions(subject.methods, 'deleteModel', [
          ACTION_TYPES.POST.DELETE_REQUEST,
          ACTION_TYPES.POST.DELETE_SUCCESS,
          ACTION_TYPES.POST.DELETE_FAILURE,
        ])
      })

      it('calls #postMethods.updatePostLoves', () => {
        methodCalledWithActions(subject.postMethods, 'updatePostLoves', [
          ACTION_TYPES.POST.LOVE_SUCCESS,
          ACTION_TYPES.POST.LOVE_FAILURE,
        ])
      })
    })

    context('with relationship actions', () => {
      it('calls #relationshipMethods.batchUpdateRelationship', () => {
        methodCalledWithActions(subject.relationshipMethods, 'batchUpdateRelationship', [
          ACTION_TYPES.RELATIONSHIPS.BATCH_UPDATE_INTERNAL,
        ])
      })

      it('calls #relationshipMethods.updateRelationship', () => {
        methodCalledWithActions(subject.relationshipMethods, 'updateRelationship', [
          ACTION_TYPES.RELATIONSHIPS.UPDATE_INTERNAL,
          ACTION_TYPES.RELATIONSHIPS.UPDATE_REQUEST,
          ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS,
          ACTION_TYPES.RELATIONSHIPS.UPDATE_FAILURE,
        ])
      })
    })

    it('returns the original state if the type is not LOAD_NEXT_CONTENT_SUCCESS or LOAD_STREAM_SUCCESS', () => {
      const newState = subject.json(json, {})
      expect(newState).to.equal(json)
    })

    it('returns the original state if there is no response', () => {
      const newState = subject.json(json, { payload: {}, type: ACTION_TYPES.LOAD_STREAM_SUCCESS })
      expect(newState).to.equal(json)
    })

    it('modifies the state if the action.type === LOAD_NEXT_CONTENT_SUCCESS', () => {
      const parseLinkedSpy = sinon.stub(subject.methods, 'parseLinked')
      const updateResultSpy = sinon.stub(subject.methods, 'updateResult')
      const newState = subject.json(json, { payload: { response: true }, type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS })
      expect(parseLinkedSpy.called).to.be.true
      expect(updateResultSpy.called).to.be.true
      expect(newState).not.to.equal(json)
      subject.methods.parseLinked.restore()
      subject.methods.updateResult.restore()
    })
  })
})
