/* eslint-disable max-len,func-names,no-console */
import Helmet from 'react-helmet'
import Retell from 'retell'
import jsdom from 'jsdom'
import path from 'path'
import prerender from '../../src/prerender'
import { canPrerenderRequest } from '../../src/server-iso'
import { currentToken } from '../../oauth'

Retell.fixtures = path.join(__dirname, '../support/fixtures/retell')
Retell.headers = [/^accept/, /^content-type/, /^host/, /^if-/]

describe('isomorphically rendering on the server', () => {
  // Force Helmet not to use the DOM per this issue:
  // https://github.com/nfl/react-helmet/issues/203
  before(() => { Helmet.canUseDOM = false })
  after(() => { Helmet.canUseDOM = true })

  beforeEach(() => {
    global.ENV.API_DOMAIN = 'https://ello.co'
    global.ENV.AUTH_DOMAIN = 'https://ello.co'
    global.ENV.AUTH_CLIENT_ID = 'abc123'
    global.ENV.AUTH_CLIENT_SECRET = 'def456'
  })

  describe('#canPrerenderRequest', () => {
    it('returns false with loggedInPaths', () => {
      ['/following', '/invitations', '/settings', '/notifications'].forEach((url) => {
        expect(canPrerenderRequest({ url, get: () => 'false', cookies: {} })).to.be.false
      })
    })

    it('should return true with loggedOutPaths if not android or skip prerender set', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((url) => {
        expect(canPrerenderRequest({ url, get: () => 'false', cookies: {} })).to.be.true
      })
    })

    it('should return false with loggedOutPaths if skip prerender set', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((url) => {
        expect(canPrerenderRequest({
          url,
          get: () => 'false',
          cookies: { ello_skip_prerender: 'true' },
        })).to.be.false
      })
    })

    it('should return false with loggedOutPaths if it is Ello Android App', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((url) => {
        expect(canPrerenderRequest({
          url,
          get: () => 'Ello Android',
          cookies: {},
        })).to.be.false
      })
    })

    it('should return true with loggedOutPaths if missing user agent', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((url) => {
        expect(canPrerenderRequest({
          url,
          get: () => undefined,
          cookies: {},
        })).to.be.true
      })
    })
  })

  // These tests rely on Retell fixtures to work properly.
  // When adding new cases, you'll need to:
  // - Make sure your .env is set up to hit a live environment
  // - Disable the global.ENV stubs in the beforeEach block at the top of this file
  // - Fire up the test specifying `NODE_RETELL_MODE` in order to save the responses
  //   to support/fixtures/retell, e.g.
  //   `NODE_RETELL_MODE=record NODE_ENV=test node_modules/mocha/bin/mocha \
  //     test/unit/prerender_test.js`
  // - Manually edit the responses to redact any sensitive data such as client_id,
  //   client_secret, and access tokens before committing
  describe('prerendering content', () => {
    it('isomorphically renders the discover page', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/discover',
          url: '/discover',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([
            '184511',
            '184510',
            '184509',
            '184508',
            '184507',
            '184506',
            '184505',
            '184503',
            '184501',
            '184499',
            '184497',
            '184496',
            '184487',
            '184477',
            '184468',
            '184461',
            '184445',
            '184416',
            '184405',
            '184394',
            '184368',
            '184367',
            '184366',
            '184363',
            '184361',
            '184356',
            '184355',
            '184354',
            '184353',
            '184352',
            '184351',
            '184350',
            '184349',
          ])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('featured')
          expect(result.streamId).to.equal(null)
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('isomorphically renders a user detail page', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/666',
          url: '/666',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([
            '184479',
            '184478',
            '184472',
            '184460',
            '184459',
            '184458',
            '184457',
            '184456',
            '184454',
            '184453',
          ])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('user')
          expect(result.streamId).to.equal('9')
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.UserDetail')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('isomorphically renders a post detail', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/666/post/fr3-12pzbt_2zoppss1vuw',
          url: '/666/post/fr3-12pzbt_2zoppss1vuw',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([])
          expect(result.postTokens).to.eql(['fr3-12pzbt_2zoppss1vuw'])
          expect(result.streamKind).to.equal('post')
          expect(result.streamId).to.equal('184478')
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.PostDetail')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('isomorphically renders search', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/search?terms=%23productupdate',
          url: '/search?terms=%23productupdate',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([
            '184461',
            '9955',
            '8089',
            '9271',
            '8141',
            '7679',
            '184105',
            '9919',
            '183971',
            '7903',
            '184192',
            '8107',
            '9411',
            '184363',
            '18024',
            '183827',
            '8005',
            '183967',
            '7841',
            '9228',
            '7799',
            '9944',
            '184227',
            '9070',
            '184312',
          ])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('search')
          expect(result.streamId).to.equal(null)
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.Search')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('isomorphically renders trending', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/discover/trending',
          url: '/discover/trending',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([
            '184395',
            '184396',
            '184397',
            '184398',
            '184399',
            '184400',
            '184401',
            '184402',
            '184403',
            '184404',
            '184405',
            '184406',
            '184407',
            '184408',
            '184409',
            '184410',
            '184411',
            '184414',
            '184415',
            '184416',
            '184417',
            '184418',
            '184419',
            '184420',
            '184421',
          ])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('trending')
          expect(result.streamId).to.equal(null)
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('isomorphically renders recent', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/discover/recent',
          url: '/discover/recent',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([
            '184484',
            '184482',
            '184481',
            '184480',
            '184479',
            '184478',
            '184477',
            '184472',
            '184461',
            '184460',
            '184459',
            '184458',
            '184457',
            '184456',
            '184454',
            '184453',
            '184452',
            '184451',
            '184450',
            '184447',
            '184446',
            '184445',
            '184444',
            '184443',
            '184442',
            '184441',
            '184434',
            '184433',
          ])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('recent')
          expect(result.streamId).to.equal(null)
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('isomorphically renders a category page', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/discover/textile-art',
          url: '/discover/textile-art',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql(['9552'])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('category')
          expect(result.streamId).to.equal('5')
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it("isomorphically renders a user's loves page", (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/666/loves',
          url: '/666/loves',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([
            '184461',
            '184434',
            '184405',
            '184363',
            '184312',
            '184272',
            '183966',
            '184227',
            '184192',
            '184105',
          ])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('love')
          expect(result.streamId).to.equal('9')
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.UserDetail')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('isomorphically renders a editorial page (/)', (done) => {
      currentToken().then((token) => {
        const renderOpts = {
          accessToken: token.token.access_token,
          expiresAt: token.token.expires_at,
          originalUrl: '/',
          url: '/',
          timingHeader: '',
          requestId: '1' }
        prerender(renderOpts).then((result) => {
          expect(result.type).to.equal('render')
          expect(result.postIds).to.eql([
            '95',
            '93',
            '92',
            '85',
            '66',
            '65',
            '64',
            '63',
            '56',
            '61',
            '51',
            '42',
            '48',
          ])
          expect(result.postTokens).to.eql([])
          expect(result.streamKind).to.equal('editorial')
          expect(result.streamId).to.equal(null)
          const document = jsdom.jsdom(result.body)
          expect(document.querySelectorAll('main.Editorial')).to.have.lengthOf(1)
          done()
        }).catch(done)
      })
    }).timeout(15000)

    it('does not isomorphically render when X-Skip-Prerender is true')
  })
})
