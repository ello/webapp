import 'babel-polyfill'
import 'isomorphic-fetch'
import fs from 'fs'
import path from 'path'
import jsdom from 'jsdom'
import dotenv from 'dotenv'
import chai, { expect } from 'chai'
import chaiImmutable from 'chai-immutable'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiSaga from './support/saga_helpers'

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

