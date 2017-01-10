import { channel } from 'redux-saga'
import { selectRefreshToken } from '../../../src/selectors/authentication'
import { loadDiscoverPosts } from '../../../src/actions/discover'
import { clearAuthStore, refreshAuthenticationToken } from '../../../src/actions/authentication'
import {
  handleRequest,
  handleRequestError,
  performRequest,
} from '../../../src/sagas/requester'
import { fetchCredentials, sagaFetch } from '../../../src/sagas/api'

describe('requester saga', function () {
  it('generates requests to the api', function () {
    const myChannel = channel()
    const discoverAction = loadDiscoverPosts('recommended')
    const requester = handleRequest(myChannel)

    expect(requester).to.take(myChannel)
    expect(requester.next(discoverAction)).to.fork(performRequest, discoverAction)

    // It then waits around for another request
    expect(requester).to.take(myChannel)
  })

  describe('#performRequest', function () {
    const pretendAction = {
      type: 'PRETEND_ACTION',
      payload: {
        endpoint: { path: '/api/v2/foo' },
      },
      meta: {},
    }

    const requestAction = {
      ...pretendAction,
      payload: {
        ...pretendAction.payload,
        pathname: '/foo',
      },
      type: 'PRETEND_ACTION_REQUEST',
    }

    const accessToken = 'foo123bar'
    const credentials = {
      token: {
        access_token: accessToken,
      },
    }

    it('works?', function () {
      const requester = performRequest(pretendAction)

      // Fire up saga
      // This step actually yields a call to the pathname selector,
      // but it happens every time.  I don't care to test it.
      requester.next()

      // Pass in some arbitrary pathname,
      // Get back call to fetchCredentials
      expect(requester.next('/foo')).to.call(fetchCredentials)

      // Give back answer to fetchCredentials,
      // expect requester to dispatch the REQUEST action
      expect(requester.next(credentials)).to.put(requestAction)

      // The yield of `put` didn't require any feedback
      // from redux-saga, so we don't give it anything.
      // However, let's do make sure the call to `fetch`
      // is well formed.
      expect(requester).to.call.with
        .fn(sagaFetch)

      const posts = {
        posts: [
          { id: 1, body_field: 'yay' },
          { id: 2, body_field: 'hooray' },
        ],
      }

      const fakeResponse = new Response(
        JSON.stringify(posts),
        {
          status: 200,
          statusText: 'Success!',
          headers: {
            'Content-type': 'application/json',
            'X-TotalCount': 2,
            'X-Total-Pages': 1,
            'X-Total-Pages-Remaining': 0,
          },
        },
      )

      const finalAction = {
        ...pretendAction,
        payload: {
          ...pretendAction.payload,
          serverStatus: 200,
          pathname: '/foo',
          pagination: {
            totalCount: 2,
            totalPages: 1,
            totalPagesRemaining: 0,
          },
          response: {
            posts: [
              { id: 1, bodyField: 'yay' },
              { id: 2, bodyField: 'hooray' },
            ],
          },
        },
        type: 'PRETEND_ACTION_SUCCESS',
      }

      expect(requester.next({ serverResponse: fakeResponse, json: posts }))
        .to.put(finalAction)

      // Check that this is a call.
      // That's good enough for now, since the actual
      // function called is dynamically generated
      // expect(requester).to.call()

      // this forces the requester to call the success
      // action and then continues
      requester.next()

      const returnStep = requester.next()

      expect(returnStep).to.return(true)
    })

    it('handles failures appropriately', function () {
      const requester = performRequest(pretendAction)

      // Fire up saga
      // This step actually yields a call to the pathname selector,
      // but it happens every time.  I don't care to test it.
      requester.next()

      // Pass in some arbitrary pathname,
      // Get back call to fetchCredentials
      expect(requester.next('/foo')).to.call(fetchCredentials)

      // Give back answer to fetchCredentials,
      // expect requester to dispatch the REQUEST action
      expect(requester.next(credentials)).to.put(requestAction)

      // The yield of `put` didn't require any feedback
      // from redux-saga, so we don't give it anything.
      // However, let's do make sure the call to `fetch`
      // is well formed.
      expect(requester).to.call.with
        .fn(sagaFetch)

      const fakeResponse = new Response(
        'Oh-oh',
        {
          status: 401,
          statusText: 'Barf!',
          headers: {
            'Content-type': 'application/json',
          },
        },
      )

      const responseError = new Error('Oh-oh')
      responseError.response = fakeResponse
      expect(requester.throw(responseError))
        .to.fork(handleRequestError, responseError, pretendAction)
      // At this point the requester is done, and the error handler takes over.
      expect(requester).to.return(false)
    })

    describe('#handleRequestError', function () {
      const fakeResponse = new Response(
        'Oh-oh',
        {
          status: 401,
          statusText: 'Barf!',
          headers: {
            'Content-type': 'application/json',
          },
        },
      )

      const responseError = new Error('Oh-oh')
      responseError.response = fakeResponse

      it('clears the auth token and tries to refresh again', function () {
        const refreshTokenHandler = handleRequestError(responseError, pretendAction)
        expect(refreshTokenHandler).to.put(clearAuthStore())
        expect(refreshTokenHandler).to.select(selectRefreshToken)
        expect(refreshTokenHandler.next('footokenfoo')).to.put(refreshAuthenticationToken('footokenfoo'))
      })
    })
  })
})

