/* eslint-disable max-len */
import Immutable from 'immutable'
import { isValidResult } from '../../support/test_helpers'
import { clearJSON, json, stubJS, stubJSONStore } from '../../support/stubs'
import * as subject from '../../../src/reducers/json'
import * as ACTION_TYPES from '../../../src/constants/action_types'
import * as MAPPING_TYPES from '../../../src/constants/mapping_types'

describe.only('json reducer', () => {
  let state
  beforeEach(() => {
    stubJSONStore()
    state = json
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#addNewIdsToResult', () => {
    it('returns the original state if no result.morePostIds', () => {
      state = Immutable.fromJS({ yo: 'yo', mama: 'mama' })
      json.setIn(['pages', 'sweetpath'], Immutable.Map())
      expect(subject.methods.addNewIdsToResult(state, json)).to.equal(state)
    })

    it('concats the existing result ids to the morePostIds and deletes the old morePostIds', () => {
      state = json.set('pages', Immutable.fromJS({ sweetpath: { morePostIds: ['1', '2', '3'], ids: ['2', '10', '20', '30'] } }))
      subject.setPath('sweetpath')
      state = subject.methods.addNewIdsToResult(state)
      expect(state.getIn(['pages', 'sweetpath', 'morePostIds'])).to.be.undefined
      expect(state.getIn(['pages', 'sweetpath', 'ids'])).to.deep.equal(Immutable.List(['1', '2', '3', '10', '20', '30']))
    })
  })

  describe('#updateUserCount', () => {
    it('should update the count', () => {
      state = subject.methods.updateUserCount(state, '1', 'followersCount', 1)
      expect(state.getIn(['users', '1', 'followersCount'])).to.equal(1)
      state = subject.methods.updateUserCount(state, '1', 'followersCount', 1)
      expect(state.getIn(['users', '1', 'followersCount'])).to.equal(2)
    })
    it('should set the count', () => {
      state = subject.methods.updateUserCount(state, '1', 'undefinedCount', 1)
      expect(state.getIn(['users', '1', 'undefinedCount'])).to.equal(1)
    })
    it('should ignore ∞', () => {
      state = subject.methods.updateUserCount(state, 'inf', 'followersCount', 1)
      expect(state.getIn(['users', 'inf', 'followersCount'])).to.equal('∞')
    })
  })

  describe('#updatePostCount', () => {
    it('should update the count', () => {
      state = subject.methods.updatePostCount(state, '1', 'repostsCount', 1)
      expect(state.getIn(['posts', '1', 'repostsCount'])).to.equal(2)
      state = subject.methods.updatePostCount(state, '1', 'repostsCount', 1)
      expect(state.getIn(['posts', '1', 'repostsCount'])).to.equal(3)
    })
    it('should set the count', () => {
      state = subject.methods.updatePostCount(state, '1', 'undefinedCount', 1)
      expect(state.getIn(['posts', '1', 'undefinedCount'])).to.equal(1)
    })
  })

  describe('#appendPageId', () => {
    it('should add the id to null', () => {
      state = subject.methods.appendPageId(state, '/page', 'users', 'foo')
      expect(state.getIn(['pages', '/page', 'ids']).includes('foo')).to.be.true
    })
    it('should add the type to null', () => {
      state = subject.methods.appendPageId(state, '/page', 'users', 'foo')
      expect(state.getIn(['pages', '/page', 'type'])).to.equal('users')
    })
    it('should add the id to []', () => {
      state = Immutable.fromJS({ pages: { '/page': { ids: [] } } })
      state = subject.methods.appendPageId(state, '/page', 'users', 'foo')
      expect(state.getIn(['pages', '/page', 'ids']).includes('foo')).to.be.true
    })
    it('should add the id to [1,2,3]', () => {
      state = Immutable.fromJS({ pages: { '/page': { ids: [1, 2, 3] } } })
      state = subject.methods.appendPageId(state, '/page', 'users', 'foo')
      expect(state.getIn(['pages', '/page', 'ids']).includes('foo')).to.be.true
      expect(state.getIn(['pages', '/page', 'ids']).includes(1)).to.be.true
      expect(state.getIn(['pages', '/page', 'ids']).includes(2)).to.be.true
      expect(state.getIn(['pages', '/page', 'ids']).includes(3)).to.be.true
      expect(state.getIn(['pages', '/page', 'ids']).includes(4)).to.be.false
    })
  })
  describe('#removePageId', () => {
    it('should do nothing to null', () => {
      expect(subject.methods.removePageId(state, '/page', 'foo')).to.equal(state)
    })
    it('should do nothing to []', () => {
      state = Immutable.fromJS({ pages: { '/page': { ids: [] } } })
      state = subject.methods.removePageId(state, '/page', 'foo')
      expect(state.getIn(['pages', '/page', 'ids'])).to.be.empty
    })
    it('should remove the id from [foo]', () => {
      state = Immutable.fromJS({ pages: { '/page': { ids: [1, 'foo', 2, 3] } } })
      state = subject.methods.removePageId(state, '/page', 'foo')
      expect(state.getIn(['pages', '/page', 'ids']).includes('foo')).to.be.false
      expect(state.getIn(['pages', '/page', 'ids']).includes(1)).to.be.true
      expect(state.getIn(['pages', '/page', 'ids']).includes(2)).to.be.true
      expect(state.getIn(['pages', '/page', 'ids']).includes(3)).to.be.true
      expect(state.getIn(['pages', '/page', 'ids']).includes(4)).to.be.false
    })
  })

  describe('#mergeModel', () => {
    it('does not modify state if there is no id in params', () => {
      state = subject.methods.mergeModel(state, MAPPING_TYPES.USERS, { username: 'new' })
      expect(state.getIn(['users', '1', 'username'])).to.equal('archer')
    })

    it('modifies state if there is an id in params', () => {
      state = subject.methods.mergeModel(state, MAPPING_TYPES.USERS, { id: '1', username: 'new' })
      expect(state.getIn(['users', '1', 'username'])).to.equal('new')
    })
  })

  describe('#addModels', () => {
    it('creates a new type on state if it does not exist', () => {
      expect(state.get('assets')).to.be.undefined
      const result = subject.methods.addModels(state, MAPPING_TYPES.ASSETS, {})
      expect(result.state.get('assets')).not.to.be.null
      expect(result.ids).to.be.empty
    })

    it('should test categories')
    it('should test page promotionals')
    it('should test settings')

    it('adds arrays of models', () => {
      expect(state.getIn(['users', '5'])).to.be.undefined
      expect(state.getIn(['users', '6'])).to.be.undefined
      const data = {}
      data.users = []
      data.users.push(stubJS('user', { id: '5', username: 'carol' }))
      data.users.push(stubJS('user', { id: '6', username: 'malory' }))
      const result = subject.methods.addModels(json, MAPPING_TYPES.USERS, data)
      expect(result.state.getIn(['users', '5', 'username'])).to.equal('carol')
      expect(result.state.getIn(['users', '6', 'username'])).to.equal('malory')
      expect(result.ids).to.deep.equal(Immutable.List(['5', '6']))
    })

    it('adds a single model object to the state', () => {
      expect(state.getIn(['users', '123'])).to.be.undefined
      const data = {}
      data.users = stubJS('user', { id: '123', username: 'carol' })
      const result = subject.methods.addModels(json, MAPPING_TYPES.USERS, data)
      expect(result.state.getIn(['users', '123', 'username'])).to.equal('carol')
      expect(result.ids).to.deep.equal(Immutable.List(['123']))
    })
  })


  describe('#parseLinked', () => {
    it('does nothing if linked is not defined', () => {
      expect(subject.methods.parseLinked(null, state)).to.equal(state)
    })

    it('parses linked node', () => {
      const linked = {}
      linked.assets = [{ id: 'sup' }, { id: 'dawg' }]
      linked.users = [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }]
      expect(state.get('assets')).to.be.undefined
      expect(state.getIn(['users', 'yo'])).to.be.undefined
      expect(state.getIn(['users', 'mama'])).to.be.undefined
      state = subject.methods.parseLinked(linked, json)
      expect(state.getIn(['assets', 'sup'])).not.to.be.null
      expect(state.getIn(['assets', 'dawg'])).not.to.be.null
      expect(state.getIn(['users', 'yo', 'username'])).to.equal('yo')
      expect(state.getIn(['users', 'mama', 'username'])).to.equal('mama')
    })
  })

  describe('#getResult', () => {
    it('returns the filtered result if a #resultFilter is specified', () => {
      const response = { users: [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }] }
      const action = { meta: {} }
      action.meta.mappingType = MAPPING_TYPES.USERS
      action.payload = { pagination: '' }
      action.meta.resultFilter = users =>
        ({ usernames: users.map(user => user.username) })
      const result = subject.methods.getResult(response, state, action)
      expect(result).to.deep.equal(Immutable.fromJS({ usernames: ['yo', 'mama'], pagination: '' }))
    })

    it('returns the correct result', () => {
      const response = { users: [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }] }
      const action = { meta: {} }
      action.meta.mappingType = MAPPING_TYPES.USERS
      action.payload = { pagination: '' }
      const result = subject.methods.getResult(response, state, action)
      expect(isValidResult(result)).to.be.true
      expect(result).to.deep.equal(Immutable.fromJS({ ids: ['yo', 'mama'], type: MAPPING_TYPES.USERS, pagination: '' }))
    })
  })

  describe.only('#updateResult', () => {
    let action
    afterEach(() => {
      subject.methods.getResult.restore()
      action = {}
    })

    context('with an existingResult', () => {
      context('and action.type === LOAD_NEXT_CONTENT_SUCCESS', () => {
        beforeEach(() => {
          state = state.setIn(['pages', 'sweetness'], Immutable.Map())
          action = {
            meta: { resultKey: 'sweetness' },
            type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS,
          }
          sinon.stub(subject.methods, 'getResult', () =>
            Immutable.fromJS({
              ids: ['6', '5', '3'],
              pagination: 'sweet',
            }),
          )
        })

        it('sets the pagination to the result', () => {
          expect(state.getIn(['pages', 'sweetness', 'pagination'])).to.be.undefined
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', 'sweetness', 'pagination'])).to.equal('sweet')
        })

        it('updates the result ids if the existingResult had a next', () => {
          state = state.setIn(['pages', 'sweetness', 'next'], Immutable.fromJS({ ids: ['2', '1'] }))
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', 'sweetness', 'next', 'ids'])).to.deep.equal(Immutable.List(['6', '5', '3', '2', '1']))
        })

        it('sets the result on next', () => {
          expect(state.getIn(['pages', 'sweetness', 'next'])).to.be.undefined
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', 'sweetness', 'next', 'pagination'])).to.equal('sweet')
        })
      })
    })
    // context('action.type === LOAD_NEXT_CONTENT_SUCCESS', () => {
    //   it('sets the next property of result when it does not exist', () => {
    //     json.pages = { sweetness: { pagination: 'cool' } }
    //     const result = { pagination: 'sweet', ids: ['2', '3', '4'] }
    //     sinon.stub(subject.methods, 'getResult', () => result)
    //     const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: {} }
    //     subject.setPath('sweetness')
    //     expect(json.pages.sweetness.next).to.be.undefined
    //     expect(json.pages.sweetness.pagination).to.equal('cool')
    //     subject.methods.updateResult({}, json, action)
    //     expect(json.pages.sweetness.next).to.equal(result)
    //     expect(json.pages.sweetness.pagination).to.equal('sweet')
    //   })

    //   it('updates the next property of result when it exists', () => {
    //     json.pages = { sweetness: { next: { ids: ['1', '2'] }, pagination: 'cool' } }
    //     sinon.stub(subject.methods, 'getResult', () => {
    //       const stuff = { pagination: 'sweet', ids: ['2', '3', '4'] }
    //       return stuff
    //     })
    //     const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: {} }
    //     subject.setPath('sweetness')
    //     expect(json.pages.sweetness.next).to.deep.equal({ ids: ['1', '2'] })
    //     expect(json.pages.sweetness.pagination).to.equal('cool')
    //     subject.methods.updateResult({}, json, action)
    //     expect(json.pages.sweetness.next).to.deep.equal({ ids: ['1', '2', '3', '4'] })
    //     expect(json.pages.sweetness.pagination).to.equal('sweet')
    //   })

    //   it('uses the resultKey to update the storage location within json.pages', () => {
    //     json.pages = { yo: { pagination: 'cool' } }
    //     const result = { pagination: 'sweet', ids: ['2', '3', '4'] }
    //     sinon.stub(subject.methods, 'getResult', () => result)
    //     const action = { type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS, meta: { resultKey: 'yo' } }
    //     subject.setPath('sweetness')
    //     expect(json.pages.yo.next).to.be.undefined
    //     expect(json.pages.yo.pagination).to.equal('cool')
    //     subject.methods.updateResult({}, json, action)
    //     expect(json.pages.yo.next).to.deep.equal({ ids: ['2', '3', '4'], pagination: 'sweet' })
    //     expect(json.pages.yo.pagination).to.equal('sweet')
    //   })
    // })

    // context('action.type === LOAD_STREAM_SUCCESS', () => {
    //   it('sets the result when it does not exist', () => {
    //     const result = Immutable.fromJS({ pagination: 'sweet' })
    //     sinon.stub(subject.methods, 'getResult', () => result)
    //     const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: {} }
    //     action.meta.mappingType = MAPPING_TYPES.USERS
    //     subject.setPath('sweetness')
    //     expect(state.getIn(['pages', 'sweetness'])).to.be.undefined
    //     state = subject.methods.updateResult({}, json, action)
    //     expect(state.getIn(['pages', 'sweetness'])).to.deep.equal(result)
    //   })

    //   context('with an existingResult and existingResult.ids[0] !== result.ids[0]', () => {
    //     it('adds morePostIds if hasLoadedFirstStream && it is not a nested result && the index is greater than 0', () => {
    //       const result = { pagination: 'sweet' }
    //       sinon.stub(subject.methods, 'getResult', () => result)
    //       // json.pages = { sweetness: { ids: ['1', '2'], next: { ids: ['1', '2'] } } }
    //       // const result = { pagination: 'sweet', ids: ['3'] }
    //       // sinon.stub(subject.methods, 'getResult', () => { return result })
    //       // const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: {} }
    //       // subject.setPath('sweetness')
    //       // subject.methods.updateResult({}, json, action)
    //       // expect(json.pages.sweetness).to.deep.equal({ next: { ids: ['1', '2'] }, ...result })
    //     })

    //     it('overrides the existing result if the above condition is not met', () => {
    //       const result = { pagination: 'sweet' }
    //       sinon.stub(subject.methods, 'getResult', () => result)
    //     })
    //   })

    //   it('overlays the result with the existingResult when existingResult and resultKey', () => {
    //     const result = { pagination: 'sweet' }
    //     sinon.stub(subject.methods, 'getResult', () => result)
    //   })

    //   it('resets the result', () => {
    //     const result = { pagination: 'sweet' }
    //     sinon.stub(subject.methods, 'getResult', () => result)
    //   })

    //   it('uses the resultKey to update the storage location within json.pages', () => {
    //     const result = { pagination: 'sweet' }
    //     sinon.stub(subject.methods, 'getResult', () => result)
    //     const action = { type: ACTION_TYPES.LOAD_STREAM_SUCCESS, meta: { resultKey: 'yo' } }
    //     action.meta.mappingType = MAPPING_TYPES.USERS
    //     subject.setPath('sweetness')
    //     expect(json.pages.yo).to.be.undefined
    //     subject.methods.updateResult({}, json, action)
    //     expect(json.pages.yo).to.equal(result)
    //   })
    // })
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
