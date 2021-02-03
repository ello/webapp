/* eslint-disable max-len */
import Immutable from 'immutable'
import * as ACTION_TYPES from '../../../src/constants/action_types'
import * as MAPPING_TYPES from '../../../src/constants/mapping_types'
import * as subject from '../../../src/reducers/json'
import { isValidResult } from '../../support/test_helpers'
import { clearJSON, stubJS, stubJSONStore } from '../../support/stubs'

describe('json reducer', () => {
  let state
  beforeEach(() => {
    state = stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#addNewIdsToResult', () => {
    it('returns the original state if no result.morePostIds', () => {
      state = Immutable.fromJS({ yo: 'yo', mama: 'mama' })
      expect(subject.methods.addNewIdsToResult(state)).to.equal(state)
    })

    context('without a resultKey uses path', () => {
      it('concats the existing result ids to the morePostIds and deletes the old morePostIds', () => {
        state = state.set('pages', Immutable.fromJS({ sweetpath: { morePostIds: ['184068', '184067', '184066', '184065'], ids: ['184067', '184066', '184065', '184064'] } }))
        subject.setPath('sweetpath')
        state = subject.methods.addNewIdsToResult(state)
        expect(state.getIn(['pages', 'sweetpath', 'morePostIds'])).to.be.undefined
        expect(state.getIn(['pages', 'sweetpath', 'ids'])).to.deep.equal(Immutable.List(['184068', '184067', '184066', '184065', '184064']))
      })
    })

    context('with a resultKey', () => {
      it('concats the existing result ids to the morePostIds and deletes the old morePostIds', () => {
        state = state.set('pages', Immutable.fromJS({ notifications_all: { morePostIds: ['184068', '184067', '184066', '184065'], ids: ['184067', '184066', '184065', '184064'] } }))
        state = subject.methods.addNewIdsToResult(state, { payload: { resultKey: 'notifications_all' } })
        expect(state.getIn(['pages', 'notifications_all', 'morePostIds'])).to.be.undefined
        expect(state.getIn(['pages', 'notifications_all', 'ids'])).to.deep.equal(Immutable.List(['184068', '184067', '184066', '184065', '184064']))
      })
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
      const result = subject.methods.addModels(state, MAPPING_TYPES.USERS, data)
      expect(result.state.getIn(['users', '5', 'username'])).to.equal('carol')
      expect(result.state.getIn(['users', '6', 'username'])).to.equal('malory')
      expect(result.ids).to.deep.equal(Immutable.List(['5', '6']))
    })

    it('adds a single model object to the state', () => {
      expect(state.getIn(['users', '123'])).to.be.undefined
      const data = {}
      data.users = stubJS('user', { id: '123', username: 'carol' })
      const result = subject.methods.addModels(state, MAPPING_TYPES.USERS, data)
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
      state = subject.methods.parseLinked(linked, state)
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
      expect(result.result).to.deep.equal(Immutable.fromJS({ usernames: ['yo', 'mama'], pagination: '' }))
    })

    it('returns the correct result', () => {
      const response = { users: [{ id: 'yo', username: 'yo' }, { id: 'mama', username: 'mama' }] }
      const action = { meta: {} }
      action.meta.mappingType = MAPPING_TYPES.USERS
      action.payload = { pagination: '' }
      const result = subject.methods.getResult(response, state, action)
      expect(isValidResult(result.result)).to.be.true
      expect(result.result).to.deep.equal(Immutable.fromJS({ ids: ['yo', 'mama'], type: MAPPING_TYPES.USERS, pagination: '' }))
    })
  })

  describe('#getCurrentUser', () => {
    it('should return the current user if one exists')
    it('should return null if no current user exists')
  })

  describe('#findPostFromIdOrToken', () => {
    it('returns the correct post with an id')
    it('returns the correct post with a token')
    it('returns null if no post was found')
  })

  describe('#addParentPostIdToComments', () => {
    it('adds the correct post id to the comments response')
    it('returns null if no post was found')
  })

  describe('#setLayoutMode', () => {
    it('returns the state if no result')
    it('returns the state if mode didn\'t change')
    it('sets the mode if there is a result and it doesn\'t match')
  })

  describe('#pagesKey', () => {
    it('returns the resultKey on the action if one exists')
    it('returns the payload\'s pathname if no resultKey and one exists')
    it('returns the path from a location change if no payload.pathname and no resultKey')
  })

  describe('#updateResult', () => {
    let action
    afterEach(() => {
      subject.methods.getResult.restore()
      action = {}
    })

    context('without an existingResult', () => {
      it('sets the result', () => {
        const result = Immutable.fromJS({
          ids: ['3', '2', '1'],
          pagination: 'sweet',
        })
        action = { meta: { resultKey: 'sweetness' } }
        sinon.stub(subject.methods, 'getResult', () => ({ result, newState: state }))
        expect(state.getIn(['pages', 'sweetness'])).to.be.undefined
        state = subject.methods.updateResult({}, state, action)
        expect(state.getIn(['pages', 'sweetness'])).to.equal(result)
      })
    })

    context('with an existingResult', () => {
      // when a new page loads successfully add more ids to the existing result's next property
      context('and we are infinite scrolling', () => {
        beforeEach(() => {
          state = state.setIn(['pages', 'sweetness'], Immutable.Map())
          action = {
            meta: { resultKey: 'sweetness' },
            type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS,
          }
          sinon.stub(subject.methods, 'getResult', () =>
            ({
              newState: state,
              result: Immutable.fromJS({
                ids: ['6', '5', '3', '8'],
                pagination: 'sweet',
              }),
            }),
          )
        })

        // update the pagination of the existing result for infinite scroll
        // to work with updated pagination properties from new result
        it('sets the pagination to the result', () => {
          expect(state.getIn(['pages', 'sweetness', 'pagination'])).to.be.undefined
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', 'sweetness', 'pagination'])).to.equal('sweet')
        })

        it('updates the result ids and filters out duplicates', () => {
          state = state.setIn(['pages', 'sweetness'], Immutable.fromJS({ ids: ['10', '8'] }))
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', 'sweetness', 'ids'])).to.deep.equal(Immutable.List(['10', '8', '6', '5', '3']))
        })

        // add this result to the next param for subsequent page loads
        it('sets the pagination', () => {
          expect(state.getIn(['pages', 'sweetness'])).to.be.empty
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', 'sweetness', 'pagination'])).to.equal('sweet')
        })
      })

      // we already have the new result ids in our existing result
      context('and we already have the results available', () => {
        it('returns the existing state', () => {
          state = state.setIn(['pages', 'sweetness'], Immutable.fromJS({ ids: ['10', '9', '8', '7', '6'] }))
          sinon.stub(subject.methods, 'getResult', () =>
            ({
              newState: state,
              result: Immutable.fromJS({
                ids: ['10', '9', '8'],
                pagination: 'sweet',
              }),
            }),
          )
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', 'sweetness', 'ids'])).to.deep.equal(Immutable.List(['10', '9', '8', '7', '6']))
        })
      })

      context('overlapping results', () => {
        beforeEach(() => {
          state = state.setIn(['pages', '/sweetness'], Immutable.Map())
          action = {
            payload: { pathname: '/sweetness' },
          }
          sinon.stub(subject.methods, 'getResult', () =>
            ({
              newState: state,
              result: Immutable.fromJS({
                ids: ['10', '9', '8'],
                pagination: 'sweet',
              }),
            }),
          )
          subject.setHasLoadedFirstStream(true)
        })

        // reset the result if the new result doesn't overlap with the existing result
        // this could happen if you had loaded a page and then didn't go back to it until
        // an entire new page of content was created before the last post that was seen
        it('resets the result if no morePostIds and no overlap in data', () => {
          state = state.setIn(['pages', '/sweetness', 'ids'], Immutable.List(['5', '4', '3']))
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', '/sweetness', 'ids'])).to.deep.equal(Immutable.List(['10', '9', '8']))
        })

        it('resets the result morePostIds don\'t overlap in data', () => {
          state = state.setIn(['pages', '/sweetness'], Immutable.fromJS({ ids: ['5', '4', '3'], morePostIds: ['7', '6'] }))
          state = subject.methods.updateResult({}, state, action)
          expect(state.getIn(['pages', '/sweetness', 'ids'])).to.deep.equal(Immutable.List(['10', '9', '8']))
          expect(state.getIn(['pages', '/sweetness', 'morePostIds'])).to.be.undefined
        })

        // update the more posts button data if this is a stream that infinite scrolls
        // and not a nested stream like lovers/reposters or a non infinite scroll like all-categories
        context('and the first stream has loaded', () => {
          // add the result to the more posts of the existing result since they overlap
          // this should only happen if you had the more posts button show up left the page
          // and then came back to it and more results got loaded, so more posts should update
          it('adds the union of ids to the existing morePostIds array', () => {
            state = state.setIn(['pages', '/sweetness'], Immutable.fromJS({ ids: ['5', '4', '3'], morePostIds: ['8', '7', '6'] }))
            state = subject.methods.updateResult({}, state, action)
            expect(state.getIn(['pages', '/sweetness', 'morePostIds'])).to.deep.equal(Immutable.List(['10', '9', '8', '7', '6']))
          })

          // set more posts if there weren't any previously and existing and result don't match
          it('adds morePostIds if the result doesn\'t match and no previous morePostIds', () => {
            state = state.setIn(['pages', '/sweetness'], Immutable.fromJS({ ids: ['8', '7', '6'] }))
            state = subject.methods.updateResult({}, state, action)
            expect(state.getIn(['pages', '/sweetness', 'morePostIds'])).to.deep.equal(Immutable.List(['10', '9', '8']))
          })

          it('does nothing if the results are the same', () => {
            state = state.setIn(['pages', '/sweetness'], Immutable.fromJS({ ids: ['10', '9', '8'] }))
            state = subject.methods.updateResult({}, state, action)
            expect(state.getIn(['pages', '/sweetness', 'ids'])).to.deep.equal(Immutable.List(['10', '9', '8']))
          })

          it('merges the results if action.meta.mergeResults is true', () => {
            action = {
              meta: { mergeResults: true },
              payload: { pathname: '/sweetness' },
            }
            state = state.setIn(['pages', '/sweetness', 'ids'], Immutable.List(['9', '8', '7', '6']))
            state = subject.methods.updateResult({}, state, action)
            expect(state.getIn(['pages', '/sweetness', 'ids'])).to.deep.equal(Immutable.List(['10', '9', '8', '7', '6']))
          })
        })
      })
    })
  })

  describe('#deleteModel', () => {
    it('calls commentMethods.addOrUpdateComment on comment delete success')
    it('calls postMethods.addOrUpdatePost on post delete success')
    it('adds the deleted model\'s id to the correct deleted array')

    it('restores a post on failure', () => {
      const post = state.getIn(['posts', '1'])
      expect(post).not.to.be.undefined
      const action = { payload: { model: post }, type: ACTION_TYPES.POST.DELETE_FAILURE }
      state = subject.methods.deleteModel(state, action, MAPPING_TYPES.POSTS)
      expect(state.getIn(['posts', '1'])).not.to.be.undefined
    })

    it('returns a passed in state if type is not supported', () => {
      const post = state.getIn(['posts', '1'])
      expect(post).not.to.be.undefined
      const action = { type: 'blah' }
      action.payload = { model: post }
      expect(subject.methods.deleteModel(state, action, MAPPING_TYPES.POSTS)).to.deep.equal(state)
    })
  })

  describe('#updateCurrentUser', () => {
    it('updates the current users\' avatar with a tmp version')
    it('updates the current users\' coverImage with a tmp version')
  })

  describe('#updateCurrentUserTmpAsset', () => {
    it('merges the tmp asset onto the current user')
  })

  describe('#updatePostDetail', () => {
    it('calls parseLinked')
    it('calls addModels')
    it('calls mergeModel')
  })

  describe('#json', () => {
    function methodCalledWithActions(methods, method, actions) {
      const spy = sinon.stub(methods, method)
      actions.forEach((action) => {
        subject.json(state, { type: action })
        expect(spy.called).to.be.true
      })
      spy.restore()
    }

    function methodsCalledWithActions(methodsArr, methodArr, actions) {
      const spyArr = []
      methodsArr.forEach((methods, index) => {
        spyArr.push(sinon.stub(methods, methodArr[index]))
      })
      actions.forEach((action) => {
        subject.json(state, { type: action, payload: {}, meta: {} })
        spyArr.forEach((spy) => {
          expect(spy.called).to.be.true
        })
      })
      spyArr.forEach((spy) => {
        spy.restore()
      })
    }

    it('calls #methods.addNewIdsToResult', () => {
      methodCalledWithActions(subject.methods, 'addNewIdsToResult', [
        ACTION_TYPES.ADD_NEW_IDS_TO_RESULT,
      ])
    })

    context('with comment actions', () => {
      it('calls #parseLinked and #addOrUpdateComment', () => {
        methodsCalledWithActions(
          [subject.methods, subject.commentMethods],
          ['parseLinked', 'addOrUpdateComment'],
          [
            ACTION_TYPES.COMMENT.CREATE_FAILURE,
            ACTION_TYPES.COMMENT.CREATE_REQUEST,
            ACTION_TYPES.COMMENT.CREATE_SUCCESS,
            ACTION_TYPES.COMMENT.UPDATE_SUCCESS,
          ],
        )
      })

      it('calls #methods.deleteModel', () => {
        methodCalledWithActions(subject.methods, 'deleteModel', [
          ACTION_TYPES.COMMENT.DELETE_REQUEST,
          ACTION_TYPES.COMMENT.DELETE_SUCCESS,
          ACTION_TYPES.COMMENT.DELETE_FAILURE,
        ])
      })

      it('calls #commentMethods.toggleEditing', () => {
        methodCalledWithActions(subject.commentMethods, 'toggleEditing', [
          ACTION_TYPES.COMMENT.TOGGLE_EDITING,
        ])
      })
    })

    context('with fallthrough actions', () => {
      it('returns state if there is no response')
      context('and it should not update the result', () => {
        it('calls #parseLinked and #addModels')
        // // TODO: need to figure out how to pass an action through the method
        // methodsCalledWithActions(
        //   [subject.methods, subject.methods],
        //   ['parseLinked', 'addModels'],
        //   [
        //     ACTION_TYPES.COMMENT.EDITABLE_SUCCESS,
        //     ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS,
        //     ACTION_TYPES.LOAD_STREAM_SUCCESS,
        //     ACTION_TYPES.POST.EDITABLE_SUCCESS,
        //     ACTION_TYPES.USER.DETAIL_SUCCESS,
        //   ],
        // )
      })

      context('and it should update the result', () => {
        it('calls #parseLinked, #addParentPostIdToComments, and #updateResult')
        // methodsCalledWithActions(
        //   [subject.methods, subject.methods, subject.methods],
        //   ['parseLinked', 'addParentPostIdToComments', 'updateResult'],
        //   [
        //     ACTION_TYPES.COMMENT.EDITABLE_SUCCESS,
        //     ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS,
        //     ACTION_TYPES.LOAD_STREAM_SUCCESS,
        //     ACTION_TYPES.POST.EDITABLE_SUCCESS,
        //     ACTION_TYPES.USER.DETAIL_SUCCESS,
        //   ],
        // )
      })
    })

    context('with post actions', () => {
      it('calls #postMethods.addOrUpdatePost', () => {
        methodsCalledWithActions(
          [subject.methods, subject.postMethods],
          ['parseLinked', 'addOrUpdatePost'],
          [
            ACTION_TYPES.POST.CREATE_FAILURE,
            ACTION_TYPES.POST.CREATE_SUCCESS,
            ACTION_TYPES.POST.UPDATE_SUCCESS,
          ],
        )
      })

      it('calls #methods.updatePostDetail', () => {
        methodCalledWithActions(subject.methods, 'updatePostDetail', [
          ACTION_TYPES.POST.DETAIL_SUCCESS,
        ])
      })

      it('calls #methods.deleteModel', () => {
        methodCalledWithActions(subject.methods, 'deleteModel', [
          ACTION_TYPES.POST.DELETE_FAILURE,
          ACTION_TYPES.POST.DELETE_REQUEST,
          ACTION_TYPES.POST.DELETE_SUCCESS,
        ])
      })

      it('calls #postMethods.updatePostLoves', () => {
        methodCalledWithActions(subject.postMethods, 'updatePostLoves', [
          ACTION_TYPES.POST.LOVE_FAILURE,
          ACTION_TYPES.POST.LOVE_REQUEST,
          ACTION_TYPES.POST.LOVE_SUCCESS,
        ])
      })

      it('calls #postMethods.updatePostWatch', () => {
        methodCalledWithActions(subject.postMethods, 'updatePostWatch', [
          ACTION_TYPES.POST.WATCH_FAILURE,
          ACTION_TYPES.POST.WATCH_REQUEST,
          ACTION_TYPES.POST.WATCH_SUCCESS,
        ])
      })

      it('calls #postMethods.toggleComments', () => {
        methodCalledWithActions(subject.postMethods, 'toggleComments', [
          ACTION_TYPES.POST.TOGGLE_COMMENTS,
        ])
      })

      it('calls #postMethods.toggleEditing', () => {
        methodCalledWithActions(subject.postMethods, 'toggleEditing', [
          ACTION_TYPES.POST.TOGGLE_EDITING,
        ])
      })

      it('calls #postMethods.toggleReposting', () => {
        methodCalledWithActions(subject.postMethods, 'toggleReposting', [
          ACTION_TYPES.POST.TOGGLE_REPOSTING,
        ])
      })
    })

    context('with profile actions', () => {
      it('calls #parseLinked and #updateCurrentUser for load and save actions', () => {
        methodsCalledWithActions(
          [subject.methods, subject.methods],
          ['parseLinked', 'updateCurrentUser'],
          [
            ACTION_TYPES.PROFILE.LOAD_SUCCESS,
            ACTION_TYPES.PROFILE.SAVE_AVATAR_SUCCESS,
            ACTION_TYPES.PROFILE.SAVE_COVER_SUCCESS,
            ACTION_TYPES.PROFILE.SAVE_SUCCESS,
          ],
        )
      })

      it('calls #updateCurrentUserTmpAsset with profile tmp actions', () => {
        methodCalledWithActions(subject.methods, 'updateCurrentUserTmpAsset', [
          ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED,
          ACTION_TYPES.PROFILE.TMP_COVER_CREATED,
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
        ])
      })
    })

    it('rehydrates properly')

    it('handles location change properly')

    it('returns the original state if the type is not LOAD_NEXT_CONTENT_SUCCESS or LOAD_STREAM_SUCCESS', () => {
      const newState = subject.json(state, {})
      expect(newState).to.equal(state)
    })

    it('returns the original state if there is no response', () => {
      const newState = subject.json(state, { payload: {}, type: ACTION_TYPES.LOAD_STREAM_SUCCESS })
      expect(newState).to.equal(state)
    })

    it('modifies the state if the action.type === LOAD_NEXT_CONTENT_SUCCESS', () => {
      const parseLinkedSpy = sinon.stub(subject.methods, 'parseLinked')
      const updateResultSpy = sinon.stub(subject.methods, 'updateResult')
      const newState = subject.json(state, { payload: { response: true }, type: ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS })
      expect(parseLinkedSpy.called).to.be.true
      expect(updateResultSpy.called).to.be.true
      expect(newState).not.to.equal(state)
      subject.methods.parseLinked.restore()
      subject.methods.updateResult.restore()
    })
  })
})
