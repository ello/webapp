import {
  selectSubmitURL,
} from '../../../src/selectors/artist_invites'
import { clearJSON, json, stub } from '../../support/stubs'

describe('categories selectors', () => {
  let state
  beforeEach(() => {
    stub('artistInvite', {
      id: '1',
      slug: 'artist-invite',
      title: 'Artist Invite',
    })
    stub('artistInvite', {
      id: '666',
      slug: 'ello-celebrates-diversity',
      title: 'Ello Celebrates Diversity',
    })
    state = { json }
  })

  afterEach(() => {
    clearJSON()
  })

  context('#selectSubmitURL', () => {
    it('usually returns nil', () => {
      const props = { artistInviteId: '1' }
      expect(selectSubmitURL(state, props)).to.equal(null)
    })
    it('returns the correct submitURL', () => {
      const props = { artistInviteId: '666' }
      expect(selectSubmitURL(state, props)).to.equal('https://www.talenthouse.com/i/advertising-inspired-work-for-the-drum')
    })
  })
})
