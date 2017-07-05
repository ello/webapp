import 'babel-polyfill'
import fs from 'fs'
import path from 'path'
import jsdom from 'jsdom'
import dotenv from 'dotenv'
import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {
  setApiDomain,
  setAuthClientId,
  setAuthDomain,
  setErrorRenderables,
  setPromoHost,
  setStreamRenderables,
  setUseLocalEmoji,
  setZeroRenderables,
} from 'ello-brains/networking/api'
import chaiSaga from './support/saga_helpers'
import * as StreamRenderables from '../src/components/streams/StreamRenderables'
import * as ErrorRenderables from '../src/components/errors/Errors'
import * as ZeroRenderables from '../src/components/zeros/Zeros'

chai.use(chaiSaga)
chai.use(chaiImmutable)
chai.use(sinonChai)

dotenv.load()
global.ENV = require('../env')

global.chai = chai
global.expect = expect
global.sinon = sinon

if (!global.document) {
  const html = fs.readFileSync(path.join(__dirname, '../public/template.html'), 'utf-8')
  const exposedProperties = ['document', 'navigator', 'window']

  global.document = jsdom.jsdom(html)
  global.window = document.defaultView
  global.navigator = { userAgent: 'node.js' }
  global.URL = { createObjectURL: input => input }

  const enums = [
    ...Object.keys(document.defaultView),
    ...['Image'],
  ]

  enums.forEach((property) => {
    if (typeof global[property] === 'undefined') {
      exposedProperties.push(property)
      global[property] = document.defaultView[property]
    }
  })
}

// this is a polyfill to get enquire.js to work in a headless
// environment. it is required by react-slick for carousels
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  }
}

// setup brains with env stuff
setApiDomain(ENV.API_DOMAIN)
setAuthClientId(ENV.AUTH_CLIENT_ID)
setAuthDomain(ENV.AUTH_DOMAIN)
setErrorRenderables(ErrorRenderables)
setPromoHost(ENV.PROMO_HOST)
setStreamRenderables(StreamRenderables)
setUseLocalEmoji(ENV.USE_LOCAL_EMOJI)
setZeroRenderables(ZeroRenderables)

