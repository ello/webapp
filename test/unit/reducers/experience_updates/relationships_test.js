import Immutable from 'immutable'
import { clearJSON, json, stub, stubJSONStore } from '../../../support/stubs'
import subject, { jsonReducer } from '../../../../src/reducers/experience_updates/relationships'
import * as ACTION_TYPES from '../../../../src/constants/action_types'
import * as MAPPING_TYPES from '../../../../src/constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../../../../src/constants/relationship_types'

describe('relationships experience update', () => {
  let state
  beforeEach(() => {
    state = stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#removeIdFromDeletedArray', () => {
    it('removes the item from the deleted array', () => {
      state = state.set('deleted_users', Immutable.List(['1', '8']))
      state = subject.removeIdFromDeletedArray(state, MAPPING_TYPES.USERS, '1')
      expect(state.get('deleted_users')).to.deep.equal(Immutable.List(['8']))
    })
  })

  describe('#relationshipUpdateSuccess', () => {
    it('updates the owner and subject users', () => {
      const action = {
        payload: {
          response: {
            owner: { id: '4', relationshipPriority: RELATIONSHIP_PRIORITY.FRIEND },
            subject: { id: '1', followingCount: '4' },
          },
        },
      }
      state = subject.relationshipUpdateSuccess(json, action)
      expect(state.getIn(['users', '4', 'relationshipPriority'])).to.equal(RELATIONSHIP_PRIORITY.FRIEND)
      expect(state.getIn(['users', '1', 'followingCount'])).to.equal('4')
    })
  })

  describe('#addItemsForAuthor', () => {
    it('adds back posts for user 3', () => {
      const spy = sinon.stub(subject, 'removeIdFromDeletedArray')
      subject.addItemsForAuthor(state, MAPPING_TYPES.POSTS, '3')
      expect(spy.calledWith(state, MAPPING_TYPES.POSTS, '3')).to.be.true
      spy.restore()
    })
  })

  describe('#removeItemsForAuthor', () => {
    it('removes posts for user 3', () => {
      const spy = sinon.stub(jsonReducer.methods, 'deleteModel')
      subject.removeItemsForAuthor(state, MAPPING_TYPES.POSTS, '3')
      expect(spy.calledWith(
        state,
        {
          type: '_REQUEST',
          payload: {
            model: state.getIn([MAPPING_TYPES.POSTS, '3']),
          },
        },
        MAPPING_TYPES.POSTS,
      )).to.be.true
      spy.restore()
    })
  })

  describe('#blockUser', () => {
    it('calls #jsonReducer.methods.updateUserCount/deleteModel and #methods.removeItemsForAuthor', () => {
      const addItemsSpy = sinon.spy(subject, 'addItemsForAuthor')
      // for some reason spying on deleteModel causes the json.deleteModel
      // tests to fail. seems like the restore is not working properly
      // const deleteModelSpy = sinon.spy(jsonReducer.methods, 'deleteModel')
      const removeItemsForAuthorSpy = sinon.spy(subject, 'removeItemsForAuthor')
      const updateUserCountSpy = sinon.spy(jsonReducer.methods, 'updateUserCount')

      state = subject.blockUser(state, '1')
      expect(updateUserCountSpy.calledWith(sinon.match.any, '1', 'blockedCount', 1)).to.be.true
      // expect(deleteModelSpy.calledWith(
      //   sinon.match.any,
      //   {
      //     type: '_REQUEST',
      //     payload: {
      //       model: state.getIn([MAPPING_TYPES.USERS, '1']),
      //     },
      //   },
      //   MAPPING_TYPES.USERS,
      // )).to.be.true
      expect(removeItemsForAuthorSpy.calledWith(sinon.match.any, MAPPING_TYPES.POSTS, '1')).to.be.true
      expect(removeItemsForAuthorSpy.calledWith(sinon.match.any, MAPPING_TYPES.COMMENTS, '1')).to.be.true

      addItemsSpy.restore()
      // deleteModelSpy.restore()
      removeItemsForAuthorSpy.restore()
      updateUserCountSpy.restore()
    })
  })

  describe('#unblockUser', () => {
    let updateUserCountSpy
    let removeIdFromDeletedArraySpy
    let addItemsForAuthorSpy

    beforeEach(() => {
      updateUserCountSpy = sinon.stub(jsonReducer.methods, 'updateUserCount')
      removeIdFromDeletedArraySpy = sinon.stub(subject, 'removeIdFromDeletedArray')
      addItemsForAuthorSpy = sinon.stub(subject, 'addItemsForAuthor')
    })

    afterEach(() => {
      updateUserCountSpy.restore()
      removeIdFromDeletedArraySpy.restore()
      addItemsForAuthorSpy.restore()
    })

    it('calls #jsonReducer.methods.updateUserCount', () => {
      subject.unblockUser(state, '1')
      expect(updateUserCountSpy.calledWith(sinon.match.any, '1', 'blockedCount', -1)).to.be.true
    })

    it('calls #removeIdFromDeletedArray', () => {
      subject.unblockUser(state, '1')
      expect(removeIdFromDeletedArraySpy.calledWith(sinon.match.any, MAPPING_TYPES.USERS, '1')).to.be.true
    })

    it('calls #addItemsForAuthor for posts', () => {
      subject.unblockUser(state, '1')
      expect(addItemsForAuthorSpy.calledWith(sinon.match.any, MAPPING_TYPES.POSTS, '1')).to.be.true
    })

    it('calls #addItemsForAuthor for comments', () => {
      subject.unblockUser(state, '1')
      expect(addItemsForAuthorSpy.calledWith(sinon.match.any, MAPPING_TYPES.COMMENTS, '1')).to.be.true
    })
  })

  describe('#updateRelationship', () => {
    let action
    let blockUserSpy
    let mergeModelSpy
    let relationshipUpdateSuccessSpy
    let unblockUserSpy
    let updateUserCountSpy

    beforeEach(() => {
      blockUserSpy = sinon.stub(subject, 'blockUser')
      mergeModelSpy = sinon.stub(jsonReducer.methods, 'mergeModel')
      relationshipUpdateSuccessSpy = sinon.stub(subject, 'relationshipUpdateSuccess')
      unblockUserSpy = sinon.stub(subject, 'unblockUser')
      updateUserCountSpy = sinon.stub(jsonReducer.methods, 'updateUserCount')
    })

    afterEach(() => {
      blockUserSpy.restore()
      mergeModelSpy.restore()
      relationshipUpdateSuccessSpy.restore()
      unblockUserSpy.restore()
      updateUserCountSpy.restore()
    })

    it('calls #relationshipUpdateSuccess when the action === UPDATE_SUCCESS', () => {
      action = {
        type: ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS,
      }
      subject.updateRelationship(state, action)
      expect(relationshipUpdateSuccessSpy.called).to.be.true
    })

    context('when the models should get merged to update priority', () => {
      beforeEach(() => {
        stub('user', { id: '1', username: 'archer', relationshipPriority: RELATIONSHIP_PRIORITY.SELF })
        stub('user', { id: '2', username: 'lana', relationshipPriority: RELATIONSHIP_PRIORITY.FRIEND })
        stub('user', { id: '3', username: 'cyril', relationshipPriority: RELATIONSHIP_PRIORITY.BLOCK })
        stub('user', { id: '4', username: 'pam', relationshipPriority: RELATIONSHIP_PRIORITY.MUTE })
        stub('user', { id: '5', username: 'krieger', relationshipPriority: RELATIONSHIP_PRIORITY.NONE })
        stub('user', { id: '6', username: 'kbg', relationshipPriority: RELATIONSHIP_PRIORITY.INACTIVE })
        stub('user', { id: '7', username: 'dutchess', relationshipPriority: RELATIONSHIP_PRIORITY.NOISE })
        state = json
      })

      afterEach(() => {
        expect(mergeModelSpy.calledWith(
          sinon.match.any,
          MAPPING_TYPES.USERS,
          {
            id: action.payload.userId,
            relationshipPriority: action.payload.priority,
          },
        )).to.be.true
      })

      context('prevPriority === BLOCK', () => {
        it('calls #unblockUser', () => {
          action = {
            payload: {
              priority: RELATIONSHIP_PRIORITY.INACTIVE,
              userId: '3',
            },
          }
          subject.updateRelationship(state, action)
          expect(unblockUserSpy.calledWith(sinon.match.any, '3')).to.be.true
        })
      })

      context('prevPriority === MUTE', () => {
        it('calls #jsonReducer.methods.updateUserCount', () => {
          action = {
            payload: {
              priority: RELATIONSHIP_PRIORITY.INACTIVE,
              userId: '4',
            },
          }
          subject.updateRelationship(state, action)
          expect(updateUserCountSpy.calledWith(sinon.match.any, '4', 'mutedCount', -1)).to.be.true
        })
      })

      context('prevPriority === (FRIEND || NOISE)', () => {
        it('calls #jsonReducer.methods.updateUserCount if priority !== (FRIEND && NOISE)', () => {
          action = {
            payload: {
              priority: RELATIONSHIP_PRIORITY.INACTIVE,
              userId: '7',
            },
          }
          subject.updateRelationship(state, action)
          expect(updateUserCountSpy.calledWith(sinon.match.any, '7', 'followersCount', -1)).to.be.true
        })
      })

      context('priority === (FRIEND || NOISE)', () => {
        it('calls #jsonReducer.methods.updateUserCount if priority !== (FRIEND && NOISE)', () => {
          action = {
            payload: {
              priority: RELATIONSHIP_PRIORITY.FRIEND,
              userId: '6',
            },
          }
          subject.updateRelationship(state, action)
          expect(updateUserCountSpy.calledWith(sinon.match.any, '6', 'followersCount', 1)).to.be.true
        })
      })

      context('priority === BLOCK', () => {
        it('calls #jsonReducer.methods.updateUserCount', () => {
          action = {
            payload: {
              priority: RELATIONSHIP_PRIORITY.BLOCK,
              userId: '3',
            },
          }
          subject.updateRelationship(state, action)
          expect(blockUserSpy.calledWith(sinon.match.any, '3')).to.be.true
        })
      })

      context('priority === MUTE', () => {
        it('calls #jsonReducer.methods.updateUserCount', () => {
          action = {
            payload: {
              priority: RELATIONSHIP_PRIORITY.MUTE,
              userId: '6',
            },
          }
          subject.updateRelationship(state, action)
          expect(updateUserCountSpy.calledWith(sinon.match.any, '6', 'mutedCount', 1)).to.be.true
        })
      })
    })
  })

  describe('#batchUpdateRelationship', () => {
    it('should be tested')
  })
})

