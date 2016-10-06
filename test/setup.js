import 'babel-polyfill'
// import fs from 'fs'
// import path from 'path'
import jsdom from 'jsdom'
import dotenv from 'dotenv'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import chaiImmutable from 'chai-immutable'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiSaga from './support/saga_helpers'

chai.use(chaiHttp)
chai.use(chaiSaga)
chai.use(chaiImmutable)
chai.use(sinonChai)

dotenv.load()
global.ENV = JSON.stringify(require('../env'))

global.chai = chai
global.expect = expect
global.sinon = sinon

// Pending till we can figure out the jsdom issue
// Need to call npm install twice - wtf?
// There's also this issue: https://github.com/airbnb/enzyme/issues/507
if (!true && !global.document) {
  // const html = fs.readFileSync(path.join(__dirname, '../public/template.html'), 'utf-8')
  const html = '<html><body><div id="root"></div></body></html>'
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

