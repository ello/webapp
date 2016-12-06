import { clearJSON, json, stub } from '../../../support/stubs'
import subject, { jsonReducer } from '../../../../src/reducers/experience_updates/relationships'
import * as ACTION_TYPES from '../../../../src/constants/action_types'
import * as MAPPING_TYPES from '../../../../src/constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../../../../src/constants/relationship_types'

function stubJSONStore() {
  // add some users
  stub('user', { id: '1', username: 'archer', relationshipPriority: RELATIONSHIP_PRIORITY.SELF })
  stub('user', { id: '2', username: 'lana', relationshipPriority: RELATIONSHIP_PRIORITY.FRIEND })
  stub('user', { id: '3', username: 'cyril', relationshipPriority: RELATIONSHIP_PRIORITY.BLOCK })
  stub('user', { id: '4', username: 'pam', relationshipPriority: RELATIONSHIP_PRIORITY.MUTE })
  stub('user', { id: '5', username: 'krieger', relationshipPriority: RELATIONSHIP_PRIORITY.NONE })
  stub('user', { id: '6', username: 'kbg', relationshipPriority: RELATIONSHIP_PRIORITY.INACTIVE })
  stub('user', { id: '7', username: 'dutchess', relationshipPriority: RELATIONSHIP_PRIORITY.NOISE })
  // add some posts
  stub('post', { id: '101', token: 'token1', authorId: '1' })
  stub('post', { id: '102', token: 'token2', authorId: '2' })
  stub('post', { id: '103', token: 'token3', authorId: '3' })
  stub('post', { id: '104', token: 'token4', authorId: '4' })
}

describe('relationships experience update', () => {
  beforeEach(() => {
    stubJSONStore()
  })

  afterEach(() => {
    clearJSON()
  })

  describe('#removeIdFromDeletedArray', () => {
    it('removes the item from the deleted array', () => {
      json.deleted_users = ['1', '8']
      subject.removeIdFromDeletedArray(json, MAPPING_TYPES.USERS, '1')
      expect(json.deleted_users).to.deep.equal(['8'])
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
      subject.relationshipUpdateSuccess(json, action)
      expect(json.users['4'].relationshipPriority).to.equal(RELATIONSHIP_PRIORITY.FRIEND)
      expect(json.users['1'].followingCount).to.equal('4')
    })
  })

  describe('#addItemsForAuthor', () => {
    it('adds back posts for user 3', () => {
      const spy = sinon.stub(subject, 'removeIdFromDeletedArray')
      subject.addItemsForAuthor(json, MAPPING_TYPES.POSTS, '3')
      expect(spy.calledWith(json, MAPPING_TYPES.POSTS, '103')).to.be.true
      spy.restore()
    })
  })

  describe('#removeItemsForAuthor', () => {
    // it('removes posts for user 3', () => {
    //   const spy = sinon.stub(jsonReducer.methods, 'deleteModel')
    //   subject.removeItemsForAuthor(json, MAPPING_TYPES.POSTS, '3')
    //   expect(spy.calledWith(
    //     null,
    //     json,
    //     {
    //       type: '_REQUEST',
    //       payload: {
    //         model: json[MAPPING_TYPES.POSTS]['103'],
    //       },
    //     },
    //     MAPPING_TYPES.POSTS,
    //   )).to.be.true
    //   spy.restore()
    // })
  })

  describe('#blockUser', () => {
    let addItemsSpy
    // let deleteModelSpy
    let removeItemsForAuthorSpy
    let updateUserCountSpy

    beforeEach(() => {
      addItemsSpy = sinon.stub(subject, 'addItemsForAuthor')
      // deleteModelSpy = sinon.stub(jsonReducer.methods, 'deleteModel')
      removeItemsForAuthorSpy = sinon.stub(subject, 'removeItemsForAuthor')
      updateUserCountSpy = sinon.stub(jsonReducer.methods, 'updateUserCount')
    })

    afterEach(() => {
      addItemsSpy.restore()
      // deleteModelSpy.restore()
      removeItemsForAuthorSpy.restore()
      updateUserCountSpy.restore()
    })

    it('calls #jsonReducer.methods.updateUserCount', () => {
      subject.blockUser(json, '1')
      expect(updateUserCountSpy.calledWith(json, '1', 'blockedCount', 1)).to.be.true
    })

    // it('calls #jsonReducer.methods.deleteModel', () => {
    //   subject.blockUser(json, '1')
    //   expect(deleteModelSpy.calledWith(
    //     null,
    //     json,
    //     {
    //       type: '_REQUEST',
    //       payload: {
    //         model: json[MAPPING_TYPES.USERS]['1'],
    //       },
    //     },
    //     MAPPING_TYPES.USERS,
    //   )).to.be.true
    // })

    it('calls #removeItemsForAuthor for posts', () => {
      subject.blockUser(json, '1')
      expect(removeItemsForAuthorSpy.calledWith(json, MAPPING_TYPES.POSTS, '1')).to.be.true
    })

    it('calls #removeItemsForAuthor for comments', () => {
      subject.blockUser(json, '1')
      expect(removeItemsForAuthorSpy.calledWith(json, MAPPING_TYPES.COMMENTS, '1')).to.be.true
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
      subject.unblockUser(json, '1')
      expect(updateUserCountSpy.calledWith(json, '1', 'blockedCount', -1)).to.be.true
    })

    it('calls #removeIdFromDeletedArray', () => {
      subject.unblockUser(json, '1')
      expect(removeIdFromDeletedArraySpy.calledWith(json, MAPPING_TYPES.USERS, '1')).to.be.true
    })

    it('calls #addItemsForAuthor for posts', () => {
      subject.unblockUser(json, '1')
      expect(addItemsForAuthorSpy.calledWith(json, MAPPING_TYPES.POSTS, '1')).to.be.true
    })

    it('calls #addItemsForAuthor for comments', () => {
      subject.unblockUser(json, '1')
      expect(addItemsForAuthorSpy.calledWith(json, MAPPING_TYPES.COMMENTS, '1')).to.be.true
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
      subject.updateRelationship(json, action)
      expect(relationshipUpdateSuccessSpy.called).to.be.true
    })

    context('when the models should get merged to update priority', () => {
      afterEach(() => {
        expect(mergeModelSpy.calledWith(
          json,
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
          subject.updateRelationship(json, action)
          expect(unblockUserSpy.calledWith(json, '3')).to.be.true
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
          subject.updateRelationship(json, action)
          expect(updateUserCountSpy.calledWith(json, '4', 'mutedCount', -1)).to.be.true
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
          subject.updateRelationship(json, action)
          expect(updateUserCountSpy.calledWith(json, '7', 'followersCount', -1)).to.be.true
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
          subject.updateRelationship(json, action)
          expect(updateUserCountSpy.calledWith(json, '6', 'followersCount', 1)).to.be.true
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
          subject.updateRelationship(json, action)
          expect(blockUserSpy.calledWith(json, '3')).to.be.true
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
          subject.updateRelationship(json, action)
          expect(updateUserCountSpy.calledWith(json, '6', 'mutedCount', 1)).to.be.true
        })
      })
    })
  })
})

