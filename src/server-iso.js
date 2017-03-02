/* eslint-disable max-len, no-console */
import 'babel-polyfill'
import 'isomorphic-fetch'
import values from 'lodash/values'
import Honeybadger from 'honeybadger'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import librato from 'librato-node'
import path from 'path'
import fs from 'fs'
import semaphore from 'semaphore'
import cp from 'child_process'
import memjs from 'memjs'
import crypto from 'crypto'
import { updateStrings as updateTimeAgoStrings } from './lib/time_ago_in_words'
import { addOauthRoute, currentToken } from '../oauth'

function handleZlibError(error) {
  if (error.code === 'Z_BUF_ERROR') {
    console.error('ZlibError', error)
  } else {
    console.log(error.stack)
    throw error
  }
}
process.on('uncaughtException', handleZlibError)

// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })
global.ENV = require('../env')

updateTimeAgoStrings({ about: '' })

const app = express()
const preRenderTimeout = (parseInt(process.env.PRERENDER_TIMEOUT, 10) || 15) * 1000
const memcacheDefaultTTL = (parseInt(process.env.MEMCACHE_DEFAULT_TTL, 10) || 300)
const renderSemaphore = semaphore(parseInt(process.env.MAX_SIMULTANEOUS_RENDERS, 10) || 5)
const memcacheClient = memjs.Client.create(null, { expires: memcacheDefaultTTL })

// Honeybadger "before everything" middleware
app.use(Honeybadger.requestHandler);

// Log requests with Morgan
app.use(morgan('combined'))

// Parse cookies (for determining to pre-render or not)
app.use(cookieParser())

// Send stats to Librato
librato.configure({ email: process.env.LIBRATO_EMAIL, token: process.env.LIBRATO_TOKEN })
librato.start()
app.use(librato.middleware())

librato.on('error', (err) => {
  console.log('ELLO LIBRATO ERROR', err)
})

// Use Helmet to lock things down
app.use(helmet())

const indexStr = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8')

// Wire up OAuth route
addOauthRoute(app)

// Assets
app.use(express.static('public', { maxAge: '1y', index: false }))
app.use('/static', express.static('public/static', { maxAge: '1y' }))

function saveResponseToCache(cacheKey, body) {
  memcacheClient.set(cacheKey, body, (err) => {
    if (err) {
      console.log('Memcache error', err)
    } else {
      console.log(`- Saved ${cacheKey} to memcache`)
    }
  })
}

function renderFromServer(req, res, cacheKey) {
  currentToken().then((token) => {
    console.log(`- Attempting render, ${renderSemaphore.current} current semaphore locks`)
    let child = null
    const renderTimeout = setTimeout(() => {
      console.log('- Render timed out; killing child process and returning boilerplate.')
      librato.increment('webapp-server-render-timeout')
      if (child) {
        child.kill('SIGKILL')
      }
      res.send(indexStr)
    }, preRenderTimeout)

    // start waiting for a render semaphore
    librato.timing('render:wait', (waitDone) => {
      renderSemaphore.take(() => {
        waitDone()
        child = cp.fork('./dist/server-render-entrypoint')
        // Don't let processes run away on us
        // Handle the return on renders
        child.once('message', (msg) => {
          const { type, location, body } = msg
          switch (type) {
            case 'redirect':
              console.log(`-- Redirecting to ${location}`)
              librato.increment('webapp-server-render-redirect')
              res.redirect(location)
              break
            case 'render':
              console.log('-- Rendering ISO response')
              librato.increment('webapp-server-render-success')
              res.send(body)
              saveResponseToCache(cacheKey, body)
              break
            case 'error':
              console.log('-- Rendering error response')
              librato.increment('webapp-server-render-error')
              res.status(500).end()
              break
            case '404':
              console.log('-- Rendering 404 response')
              librato.increment('webapp-server-render-404')
              res.status(404).end()
              break
            default:
              // No-op
          }
          clearTimeout(renderTimeout)
        })
        // Clean up any lingering renderer processes at shutdown
        const exitHandler = () => {
          console.log(`- Killing child render process ${child.pid}`)
          child.kill('SIGKILL')
        }
        process.on('exit', exitHandler);

        // Handle assorted child process errors
        child.once('exit', (code, signal) => {
          clearTimeout(renderTimeout)
          process.removeListener('exit', exitHandler);
          renderSemaphore.leave()
          // Abnormal exit, may be in a dirty state
          if (code !== 0) {
            console.log(`- Render process exited with ${code} due to ${signal}`)
            res.status(500).end()
          }
        })
        // Kick off the render
        child.send({ access_token: token.token.access_token, originalUrl: req.originalUrl, url: req.url })
      })
    })
  })
}

const noPreRenderPaths = {
  following: /^\/following/,
  forgotPassword: /^\/forgot-password/,
  enter: /^\/enter/,
  invitations: /^\/invitations/,
  join: /^\/join/,
  settings: /^\/settings/,
  signup: /^\/signup/,
  starred: /^\/starred/,
  notifications: /^\/notifications/,
}

export function canPrerenderRequest(req) {
  // Don't pre-render if user is (assumed to be) logged in
  if (req.cookies.ello_skip_prerender === 'true') {
    return false
  }
  // Don't pre-render for ello android app
  if ((req.get('user-agent') || '').includes('Ello Android')) {
    return false
  }
  return values(noPreRenderPaths).every(regex =>
    !req.url.match(regex),
  )
}

function cacheKeyForRequest(req, salt = '') {
  return crypto.createHash('sha256').update(salt + req.url).digest('hex')
}

app.use((req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.setHeader('Expires', new Date(Date.now() + (1000 * memcacheDefaultTTL)).toUTCString());
  if (canPrerenderRequest(req)) {
    const cacheKey = cacheKeyForRequest(req)
    console.log('Serving pre-rendered markup for path', req.url, cacheKey)
    memcacheClient.get(cacheKey, (err, value) => {
      if (value) {
        console.log('Cache hit!', req.url)
        res.send(value.toString())
      } else {
        renderFromServer(req, res, cacheKey)
      }
    })
  } else {
    console.log('Serving static markup for path', req.url)
    res.send(indexStr)
  }
})

// Honeybadger "after everything" middleware
app.use(Honeybadger.errorHandler);

export default app

