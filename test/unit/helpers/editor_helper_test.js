import { fromJS } from 'immutable'
import * as subject from '../../../src/helpers/editor_helper'
import { COMMENT, EDITOR, POST } from '../../../src/constants/action_types'

describe('editor helper', () => {
  let action = null
  let state = null

  describe('@initialState', () => {
    it('should have the correct default properties', () => {
      expect(subject.initialState.get('collection')).to.be.empty
      expect(subject.initialState).to.have.property('hasContent', false)
      expect(subject.initialState).to.have.property('hasMedia', false)
      expect(subject.initialState).to.have.property('hasMention', false)
      expect(subject.initialState).to.have.property('isLoading', false)
      expect(subject.initialState).to.have.property('isPosting', false)
      expect(subject.initialState.get('order')).to.be.empty
      expect(subject.initialState).to.have.property('postBuyLink', null)
      expect(subject.initialState).to.have.property('shouldPersist', false)
      expect(subject.initialState.get('uid')).to.equal(0)
    })
  })

  describe('#getCompletions', () => {
    let completions = null
    afterEach(() => {
      completions = null
    })

    it('sets proper completions for users', () => {
      action = { payload: { response: { autocompleteResults: 'archer' }, type: 'user' } }
      completions = subject.methods.getCompletions(action)
      expect(completions).to.deep.equal({ data: 'archer', type: 'user' })
    })

    it('sets proper completions for emoji', () => {
      action = {
        payload: { response: { emojis: [{ name: 'metal' }] }, type: 'emoji', word: ':met' },
      }
      completions = subject.methods.getCompletions(action)
      expect(completions).to.deep.equal({ data: [{ name: 'metal' }], type: 'emoji' })
    })

    it('sets completions to null without a response', () => {
      action = { payload: { response: null, type: 'user' } }
      completions = subject.methods.getCompletions(action)
      expect(completions).to.be.null
    })
  })

  describe('#rehydrateEditors', () => {
    it('returns persisted editors and not others', () => {
      const persistedEditors = { 0: { collection: {}, shouldPersist: true }, 1: { collection: {} } }
      state = subject.methods.rehydrateEditors(persistedEditors)
      expect(state).to.deep.equal({ 0: {
        collection: {}, isLoading: false, isPosting: false, shouldPersist: true,
      } })
    })

    it('should clear out blobs in image blocks', () => {
      const persistedEditors = {
        0: { collection: { 0: { kind: 'image', blob: 'blah' } }, shouldPersist: true },
        1: { collection: {} },
      }
      expect(persistedEditors[0].collection[0].blob).to.equal('blah')
      state = subject.methods.rehydrateEditors(persistedEditors)
      expect(persistedEditors[0].collection[0].blob).to.be.undefined
    })
  })

  describe('#hasContent', () => {
    let hasContent = false
    afterEach(() => {
      hasContent = false
    })

    it('returns the original state if no firstBlock', () => {
      const newState = fromJS({ collection: {}, order: [] })
      hasContent = subject.methods.hasContent(newState)
      expect(hasContent).to.be.false
    })

    it('sets hasContent to true if order.length > 1', () => {
      const newState = fromJS({ collection: { 1: { something: '' } }, order: [1, 2] })
      hasContent = subject.methods.hasContent(newState)
      expect(hasContent).to.be.true
    })

    it('sets hasContent to true if firstBlock.data.length and not a <br>', () => {
      const newState = fromJS({ collection: { 0: { data: 'krieger' } }, order: [0] })
      hasContent = subject.methods.hasContent(newState)
      expect(hasContent).to.be.true
    })

    it('sets hasContent to false if firstBlock.data is a <br>', () => {
      const newState = fromJS({ collection: { 0: { data: '<br>' } }, order: [0] })
      hasContent = subject.methods.hasContent(newState)
      expect(hasContent).to.be.false
    })
  })

  describe('#hasMedia', () => {
    let hasMedia = false
    afterEach(() => {
      hasMedia = false
    })

    it('sets hasMedia to false if no image/embed kind', () => {
      const newState = fromJS({
        collection: {
          0: {
            data: 'archer Phrasing!?',
            kind: 'text',
          },
        },
        order: [0],
      })
      hasMedia = subject.methods.hasMedia(newState)
      expect(hasMedia).to.be.false
    })

    it('sets hasMedia to true if an image is present', () => {
      const newState = fromJS({
        collection: {
          0: {
            data: 'path/to/image.png',
            kind: 'image',
          },
          1: {
            data: 'Lana!!!',
            kind: 'text',
          },
        },
        order: [0, 1],
      })
      hasMedia = subject.methods.hasMedia(newState)
      expect(hasMedia).to.be.true
    })

    it('sets hasMedia to true if an embed is present', () => {
      const newState = fromJS({
        collection: {
          0: {
            data: 'Stir Friday',
            kind: 'text',
          },
          1: {
            data: 'path/to/embed.png',
            kind: 'embed',
          },
        },
        order: [0, 1],
      })
      hasMedia = subject.methods.hasMedia(newState)
      expect(hasMedia).to.be.true
    })
  })

  describe('#hasMention', () => {
    let hasMention = false
    afterEach(() => {
      hasMention = false
    })

    it('sets hasMention to false if no mention is present', () => {
      const newState = fromJS({
        collection: {
          0: {
            data: 'archer Phrasing!?',
            kind: 'text',
          },
        },
        order: [0],
      })
      hasMention = subject.methods.hasMention(newState)
      expect(hasMention).to.be.false
    })

    it('sets hasMention to true if a mention is present', () => {
      const newState = fromJS({
        collection: {
          0: {
            data: '@archer That\'s how you get ants',
            kind: 'text',
          },
        },
        order: [0],
      })
      hasMention = subject.methods.hasMention(newState)
      expect(hasMention).to.be.true
    })
  })

  describe('#isLoading', () => {
    let isLoading = false
    afterEach(() => {
      isLoading = false
    })

    it('sets isLoading to false if no image is loading', () => {
      const newState = fromJS({
        collection: {
          0: {
            data: '/path/to/avatar/archer.png',
            kind: 'image',
            isLoading: false,
          },
          1: {
            data: '/path/to/avatar/lana.png',
            kind: 'image',
            isLoading: false,
          },
        },
        order: [0, 1],
      })
      isLoading = subject.methods.isLoading(newState)
      expect(isLoading).to.be.false
    })

    it('sets isLoading to true if an image is loading', () => {
      const newState = fromJS({
        collection: {
          0: {
            data: '/path/to/avatar/archer.png',
            kind: 'image',
            isLoading: true,
          },
          1: {
            data: '/path/to/avatar/lana.png',
            kind: 'image',
            isLoading: false,
          },
        },
        order: [0, 1],
      })
      isLoading = subject.methods.isLoading(newState)
      expect(isLoading).to.be.true
    })

    it('sets isLoading to true if the dragBlock image is loading', () => {
      const newState = fromJS({
        dragBlock: { isLoading: true },
        collection: {
          0: {
            data: '/path/to/avatar/archer.png',
            kind: 'image',
            isLoading: true,
          },
          1: {
            data: '/path/to/avatar/lana.png',
            kind: 'image',
            isLoading: false,
          },
        },
        order: [0, 1],
      })
      isLoading = subject.methods.isLoading(newState)
      expect(isLoading).to.be.true
    })
  })

  describe('#add', () => {
    let addEmptySpy = null

    beforeEach(() => {
      addEmptySpy = sinon.spy(subject.methods, 'addEmptyTextBlock')
    })

    afterEach(() => {
      addEmptySpy.restore()
    })

    it('adds the block to the collection', () => {
      state = subject.methods.add({
        block: { kind: 'text' },
        shouldCheckForEmpty: false,
        state: subject.initialState,
      })
      expect(addEmptySpy.called).to.be.false
      expect(state.get('uid')).to.equal(1)
      expect(state.get('order').size).to.equal(1)
      expect(state.getIn(['collection', '0'])).to.have.property('kind', 'text')
      expect(state.getIn(['collection', '0'])).to.have.property('uid', 0)
    })

    it('adds the block to the collection and calls #addEmptyTextBlock', () => {
      state = subject.methods.add({
        block: { kind: 'text' },
        shouldCheckForEmpty: true,
        state: subject.initialState,
      })
      expect(addEmptySpy.called).to.be.true
      expect(state.get('uid')).to.equal(1)
      expect(state.get('order').size).to.equal(1)
      expect(state.getIn(['collection', '0'])).to.have.property('kind', 'text')
      expect(state.getIn(['collection', '0'])).to.have.property('uid', 0)
    })

    it('adds the linkUrl when buy link is present', () => {
      state = subject.methods.add({
        block: { kind: 'text' },
        shouldCheckForEmpty: true,
        state: subject.initialState.set('postBuyLink', 'yeah'),
      })
      expect(state.get('uid')).to.equal(1)
      expect(state.get('order').size).to.equal(1)
      expect(state.getIn(['collection', '0'])).to.have.property('kind', 'text')
      expect(state.getIn(['collection', '0'])).to.have.property('linkUrl', 'yeah')
      expect(state.getIn(['collection', '0'])).to.have.property('uid', 0)
    })
  })

  describe('#addEmptyTextBlock', () => {
    let addSpy = null
    let removeSpy = null

    beforeEach(() => {
      addSpy = sinon.spy(subject.methods, 'add')
      removeSpy = sinon.spy(subject.methods, 'remove')
    })

    afterEach(() => {
      addSpy.restore()
      removeSpy.restore()
    })

    it('removes last empty text block if the second to last was a text block', () => {
      const newState = fromJS({
        collection: {
          0: {
            kind: 'text',
            data: '@archer I swear to god I had something for this',
            uid: 0,
          },
          1: {
            kind: 'text',
            data: '',
            uid: 1,
          },
        },
        order: [0, 1],
        uid: 2,
      })
      state = subject.methods.addEmptyTextBlock(newState)
      expect(addSpy.called).to.be.false
      expect(removeSpy.called).to.be.true
      expect(state.get('order').first()).to.equal(0)
      expect(state.getIn(['collection', '1'])).to.be.undefined
    })

    it('adds an empty text block if order.length is 0', () => {
      state = subject.methods.addEmptyTextBlock(subject.initialState)
      expect(addSpy.called).to.be.true
      expect(removeSpy.called).to.be.false
      expect(state.get('order').first()).to.equal(0)
      expect(state.getIn(['collection', '0'])).to.have.property('data', '')
      expect(state.getIn(['collection', '0'])).to.have.property('kind', 'text')
      expect(state.getIn(['collection', '0'])).to.have.property('uid', 0)
    })

    it('adds an empty text block if the last item is not text', () => {
      const newState = fromJS({
        collection: {
          0: {
            kind: 'text',
            data: '@cheryl You\'re not my supervisor!',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/cheryl.png',
            uid: 1,
          },
        },
        order: [0, 1],
        uid: 2,
      })
      state = subject.methods.addEmptyTextBlock(newState)
      expect(addSpy.called).to.be.true
      expect(removeSpy.called).to.be.false
      expect(state.get('order').size).to.equal(3)
      expect(state.get('order').last()).to.equal(2)
      expect(state.getIn(['collection', '2'])).to.have.property('data', '')
      expect(state.getIn(['collection', '2'])).to.have.property('kind', 'text')
      expect(state.getIn(['collection', '2'])).to.have.property('uid', 2)
      expect(state.get('uid')).to.equal(3)
    })
  })

  describe('#remove', () => {
    let addEmptySpy = null

    beforeEach(() => {
      addEmptySpy = sinon.spy(subject.methods, 'addEmptyTextBlock')
    })

    afterEach(() => {
      addEmptySpy.restore()
    })

    it('removes the block from the collection and calls #addEmptyTextBlock', () => {
      const newState = fromJS({
        collection: {
          0: {
            kind: 'text',
            data: '@archer Can\'t or won\'t?',
            uid: 0,
          },
        },
        order: [0],
        uid: 1,
      })
      state = subject.methods.remove({
        state: newState,
        uid: 0,
      })
      expect(addEmptySpy.called).to.be.true
      const order = state.get('order')
      expect(order.size).to.equal(1)
      expect(order.first()).to.equal(1)
      expect(state.getIn(['collection', '1'])).to.have.property('data', '')
      expect(state.getIn(['collection', '1'])).to.have.property('kind', 'text')
      expect(state.getIn(['collection', '1'])).to.have.property('uid', 1)
    })

    it('removes the block from the collection', () => {
      const newState = fromJS({
        collection: {
          0: {
            kind: 'text',
            data: '@archer The tactical turtleneck! The... tactleneck.',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/archer.png',
            uid: 0,
          },
        },
        order: [0, 1],
        uid: 2,
      })
      state = subject.methods.remove({
        shouldCheckForEmpty: false,
        state: newState,
        uid: 1,
      })
      expect(addEmptySpy.called).to.be.false
      const order = state.get('order')
      expect(order.size).to.equal(1)
      expect(order.first()).to.equal(0)
      expect(state.getIn(['collection', '1'])).to.be.undefined
    })
  })

  describe('#removeEmptyTextBlock', () => {
    it('removes the last text block if it is empty', () => {
      const newState = fromJS({
        collection: {
          0: {
            kind: 'text',
            data: '@archer Someone call Kenny Loggins cause you\'re in the danger zone',
            uid: 0,
          },
          1: {
            kind: 'text',
            data: '',
            uid: 1,
          },
        },
        order: [0, 1],
      })
      state = subject.methods.removeEmptyTextBlock(newState)
      const order = state.get('order')
      expect(order.size).to.equal(1)
      expect(order.first()).to.equal(0)
      expect(state.getIn(['collection', '1'])).to.be.undefined
    })

    it('does not remove the last text block if it is not empty', () => {
      const newState = fromJS({
        collection: {
          0: {
            kind: 'text',
            data: '@archer Are we still doing phrasing?',
            uid: 0,
          },
          1: {
            kind: 'text',
            data: 'not empty',
            uid: 1,
          },
        },
        order: [0, 1],
      })
      state = subject.methods.removeEmptyTextBlock(newState)
      const order = state.get('order')
      expect(order.size).to.equal(2)
      expect(order.last()).to.equal(1)
      expect(state.getIn(['collection', '1'])).not.to.be.undefined
    })
  })

  describe('#updateBlock', () => {
    it('updates the block with the new content', () => {
      const newState = fromJS({
        collection: {
          0: 'Woodhouse!',
        },
      })
      state = subject.methods.updateBlock(newState, { payload: { block: 'Yes sir', uid: 0 } })
      expect(state.getIn(['collection', '0'])).to.equal('Yes sir')
    })
  })

  describe('#reorderBlocks', () => {
    it('moves forward in the array when the delta is 1', () => {
      const newState = fromJS({
        order: [0, 1, 2],
      })
      state = subject.methods.reorderBlocks(newState, { payload: { delta: 1, uid: 0 } })
      expect(state.getIn(['order', 0])).to.equal(1)
      expect(state.getIn(['order', 1])).to.equal(0)
      expect(state.getIn(['order', 2])).to.equal(2)
    })

    it('moves backwards in the array when the delta is -1', () => {
      const newState = fromJS({
        order: [0, 1, 2],
      })
      state = subject.methods.reorderBlocks(newState, { payload: { delta: -1, uid: 2 } })
      expect(state.getIn(['order', 0])).to.equal(0)
      expect(state.getIn(['order', 1])).to.equal(2)
      expect(state.getIn(['order', 2])).to.equal(1)
    })
  })

  describe('#appendText', () => {
    it('appends text to the last text block found', () => {
      const newState = fromJS({
        collection: {
          0: {
            kind: 'text',
            data: '@lana You killed a black astronaut, Cyril!',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/lana.png',
            uid: 1,
          },
        },
        order: [0, 1],
      })
      state = subject.methods.appendText(newState, ' That\'s like killing a unicorn!')
      expect(state.getIn(['collection', '0', 'data'])).to.equal(
        '@lana You killed a black astronaut, Cyril! That\'s like killing a unicorn!'
      )
    })

    it('does not append text if there is no text block', () => {
      const newState = fromJS({
        collection: {
          1: {
            kind: 'image',
            data: '/path/to/avatar/lana.png',
            uid: 1,
          },
        },
        order: [1],
      })
      state = subject.methods.appendText(newState, ' That\'s like killing a unicorn!')
      expect(state.getIn(['collection', '1', 'data'])).to.equal('/path/to/avatar/lana.png')
    })
  })

  describe.only('#appendUsernames', () => {
    it('appends usernames to the last text block found', () => {
      const newState = {
        collection: {
          0: {
            kind: 'text',
            data: '',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/lana.png',
            uid: 1,
          },
        },
        order: [0, 1],
      }
      const usernames = [{ username: 'lana' }, { username: 'cyril' }]
      state = subject.methods.appendUsernames(newState, usernames)
      expect(state.collection[0].data).to.equal(
        '@lana @cyril '
      )
    })

    it('does not append usernames if they are already there', () => {
      const newState = {
        collection: {
          0: {
            kind: 'text',
            data: '@lana @cyril ',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/lana.png',
            uid: 1,
          },
        },
        order: [0, 1],
      }
      const usernames = [{ username: 'lana' }, { username: 'cyril' }]
      state = subject.methods.appendUsernames(newState, usernames)
      expect(state.collection[0].data).to.equal(
        '@lana @cyril '
      )
    })
  })

  // TODO: need to figure out how to test the query lookup in this method
  describe('#replaceText', () => { })

  describe('#updateBuyLink', () => {
    it('updates all blocks with a link_url', () => {
      const newState = {
        collection: {
          0: {
            kind: 'text',
            data: '@lana @cyril ',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/lana.png',
            uid: 1,
          },
          2: {
            kind: 'embed',
            data: '/path/to/embed/krieger.png',
            uid: 2,
          },
        },
        order: [0, 1, 2],
      }
      state = subject.methods.updateBuyLink(newState, { payload: { link: 'word' } })
      expect(state.collection[0].linkUrl).to.equal('word')
      expect(state.collection[1].linkUrl).to.equal('word')
      expect(state.collection[2].linkUrl).to.equal('word')
    })

    it('removes link_url from all blocks with an empty link', () => {
      const newState = {
        collection: {
          0: {
            kind: 'text',
            data: '@lana @cyril ',
            linkUrl: 'yo',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/lana.png',
            linkUrl: 'yo',
            uid: 1,
          },
          2: {
            kind: 'embed',
            data: '/path/to/embed/krieger.png',
            linkUrl: 'yo',
            uid: 2,
          },
        },
        order: [0, 1, 2],
      }
      state = subject.methods.updateBuyLink(newState, { payload: { link: '' } })
      expect(state.collection[0].linkUrl).to.be.undefined
      expect(state.collection[1].linkUrl).to.be.undefined
      expect(state.collection[2].linkUrl).to.be.undefined
    })

    it('removes link_url from all blocks null link', () => {
      const newState = {
        collection: {
          0: {
            kind: 'text',
            data: '@lana @cyril ',
            linkUrl: 'yo',
            uid: 0,
          },
          1: {
            kind: 'image',
            data: '/path/to/avatar/lana.png',
            linkUrl: 'yo',
            uid: 1,
          },
          2: {
            kind: 'embed',
            data: '/path/to/embed/krieger.png',
            linkUrl: 'yo',
            uid: 2,
          },
        },
        order: [0, 1, 2],
      }
      state = subject.methods.updateBuyLink(newState, { payload: { link: null } })
      expect(state.collection[0].linkUrl).to.be.undefined
      expect(state.collection[1].linkUrl).to.be.undefined
      expect(state.collection[2].linkUrl).to.be.undefined
    })
  })

  describe('#getEditorObject', () => {
    let spy = null

    afterEach(() => {
      spy.restore()
    })

    it('calls #add with EDITOR.ADD_BLOCK', () => {
      spy = sinon.stub(subject.methods, 'add')
      action = {
        type: EDITOR.ADD_BLOCK,
        payload: { block: 'yo', shouldCheckForEmpty: false },
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('adds the dragBlock with EDITOR.ADD_DRAG_BLOCK', () => {
      action = {
        type: EDITOR.ADD_DRAG_BLOCK,
        payload: { block: 'yo' },
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(state.dragBlock).to.equal('yo')
    })

    it('calls #addEmptyTextBlock with EDITOR.ADD_EMPTY_TEXT_BLOCK', () => {
      spy = sinon.stub(subject.methods, 'addEmptyTextBlock')
      action = {
        type: EDITOR.ADD_EMPTY_TEXT_BLOCK,
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('calls #appendText with EDITOR.APPEND_TEXT', () => {
      spy = sinon.stub(subject.methods, 'appendText')
      action = {
        type: EDITOR.APPEND_TEXT,
        payload: { text: 'er' },
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('returns the original state with EDITOR.INITIALIZE on a persisted editor', () => {
      const newState = { shouldPersist: true }
      action = { type: EDITOR.INITIALIZE }
      state = subject.methods.getEditorObject(newState, action)
      expect(state).to.equal(newState)
    })

    it('returns the initialState with EDITOR.INITIALIZE on a not persisted editor', () => {
      const newState = { shouldPersist: false }
      action = { type: EDITOR.INITIALIZE }
      state = subject.methods.getEditorObject(newState, action)
      expect(state).to.equal(subject.initialState)
    })

    it('calls #removeEmptyTextBlock and #add with EDITOR.POST_PREVIEW_SUCCESS', () => {
      spy = sinon.stub(subject.methods, 'removeEmptyTextBlock')
      const addSpy = sinon.stub(subject.methods, 'add')
      action = {
        type: EDITOR.POST_PREVIEW_SUCCESS,
        payload: { response: { postPreviews: { body: ['yo'] } } },
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
      expect(addSpy.called).to.be.true
      addSpy.restore()
    })

    it('calls #remove with EDITOR.REMOVE_BLOCK', () => {
      spy = sinon.stub(subject.methods, 'remove')
      action = {
        type: EDITOR.REMOVE_BLOCK,
        payload: { uid: 0 },
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('removes the dragBlock with EDITOR.REMOVE_DRAG_BLOCK', () => {
      const newState = { dragBlock: 'yo' }
      action = {
        type: EDITOR.REMOVE_DRAG_BLOCK,
      }
      state = subject.methods.getEditorObject(newState, action)
      expect(state.dragBlock).to.be.undefined
    })

    it('calls #reorderBlocks with EDITOR.REORDER_BLOCKS', () => {
      spy = sinon.stub(subject.methods, 'reorderBlocks')
      action = {
        type: EDITOR.REORDER_BLOCKS,
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('calls #replaceText with EDITOR.REPLACE_TEXT', () => {
      spy = sinon.stub(subject.methods, 'replaceText')
      action = {
        type: EDITOR.REPLACE_TEXT,
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('sets isPosting to true with create and update actions', () => {
      const actionTypes = [
        COMMENT.CREATE_REQUEST,
        COMMENT.UPDATE_REQUEST,
        POST.CREATE_REQUEST,
        POST.UPDATE_REQUEST,
      ]
      for (const type of actionTypes) {
        const newState = { isPosting: false }
        action = { type }
        state = subject.methods.getEditorObject(newState, action)
        expect(state.isPosting).to.be.true
      }
    })

    it('calls #addEmptyTextBlock with success and reset actions', () => {
      const actionTypes = [
        COMMENT.CREATE_SUCCESS,
        COMMENT.UPDATE_SUCCESS,
        EDITOR.RESET,
        POST.CREATE_SUCCESS,
        POST.UPDATE_SUCCESS,
      ]
      spy = sinon.stub(subject.methods, 'addEmptyTextBlock')
      for (const type of actionTypes) {
        action = { type }
        state = subject.methods.getEditorObject(subject.initialState, action)
        expect(spy.called).to.be.true
      }
      spy.restore()
    })

    it('sets isPosting to false with failure actions', () => {
      const actionTypes = [
        COMMENT.CREATE_FAILURE,
        COMMENT.UPDATE_FAILURE,
        POST.CREATE_FAILURE,
        POST.UPDATE_FAILURE,
      ]
      for (const type of actionTypes) {
        const newState = { isPosting: true }
        action = { type }
        state = subject.methods.getEditorObject(newState, action)
        expect(state.isPosting).to.be.false
      }
    })

    it('calls #appendUsernames with EDITOR.LOAD_REPLY_ALL_SUCCESS', () => {
      spy = sinon.stub(subject.methods, 'appendUsernames')
      action = {
        type: EDITOR.LOAD_REPLY_ALL_SUCCESS,
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('updates the dragBlock if one exists with EDITOR.SAVE_ASSET_SUCCESS', () => {
      const newState = {
        dragBlock: {
          kind: 'image',
          data: { url: 'que' },
          uid: 0,
        },
      }
      action = {
        type: EDITOR.SAVE_ASSET_SUCCESS,
        payload: { response: { url: 'blah' }, uid: 0 },
      }
      state = subject.methods.getEditorObject(newState, action)
      expect(state.dragBlock.data.url).to.equal('blah')
    })

    it('updates the existing image block with EDITOR.SAVE_ASSET_SUCCESS', () => {
      const newState = {
        collection: {
          0: {
            kind: 'image',
            data: { url: 'what' },
            uid: 0,
          },
        },
      }
      action = {
        type: EDITOR.SAVE_ASSET_SUCCESS,
        payload: { response: { url: 'blah' }, uid: 0 },
      }
      state = subject.methods.getEditorObject(newState, action)
      expect(state.collection[0].data.url).to.equal('blah')
    })

    it('updates the drag image block with EDITOR.SAVE_ASSET_SUCCESS', () => {
      const newState = {
        dragBlock: {
          kind: 'image',
          data: { url: 'what' },
          uid: 0,
        },
        collection: {
          1: {
            kind: 'image',
            data: { url: 'que' },
            uid: 1,
          },
        },
      }
      action = {
        type: EDITOR.SAVE_ASSET_SUCCESS,
        payload: { response: { url: 'blah' }, uid: 0 },
      }
      state = subject.methods.getEditorObject(newState, action)
      expect(state.dragBlock.data.url).to.equal('blah')
    })

    it('calls #removeEmptyTextBlock and #add with EDITOR.TMP_IMAGE_CREATED', () => {
      spy = sinon.stub(subject.methods, 'removeEmptyTextBlock')
      const addSpy = sinon.stub(subject.methods, 'add')
      action = {
        type: EDITOR.TMP_IMAGE_CREATED,
        payload: { url: 'yo dawg' },
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
      expect(addSpy.called).to.be.true
    })

    it('calls #updateBuyLink with EDITOR.UPDATE_BUY_LINK', () => {
      spy = sinon.stub(subject.methods, 'updateBuyLink')
      action = {
        type: EDITOR.UPDATE_BUY_LINK,
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })

    it('calls #updateBlock with EDITOR.UPDATE_BLOCK', () => {
      spy = sinon.spy(subject.methods, 'updateBlock')
      action = {
        type: EDITOR.UPDATE_BLOCK,
        payload: {
          block: {},
          uid: 1,
        },
      }
      state = subject.methods.getEditorObject(subject.initialState, action)
      expect(spy.called).to.be.true
    })
  })
})

