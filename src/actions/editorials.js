import React from 'react'
import { LOAD_STREAM } from 'ello-brains/constants/action_types'
import { EDITORIALS, POSTS } from 'ello-brains/constants/mapping_types'
import { editorials as editorialsApi } from '../networking/api'
import { editorials as editorialRenderable, postsAsCuratedEditorial } from '../components/streams/StreamRenderables'
import { ErrorStateEditorial } from '../components/errors/Errors'
import { ZeroStateEditorial } from '../components/zeros/Zeros'

export const loadEditorials = isPreview => (
  {
    type: LOAD_STREAM,
    payload: { endpoint: editorialsApi(isPreview) },
    meta: {
      mappingType: EDITORIALS,
      renderStream: {
        asList: editorialRenderable,
        asGrid: editorialRenderable,
      },
    },
  }
)

export const loadCuratedPosts = ({ endpointPath, resultKey, ...props }) => (
  {
    type: LOAD_STREAM,
    payload: { endpoint: { path: endpointPath } },
    meta: {
      mappingType: POSTS,
      renderProps: { ...props },
      renderStream: {
        asList: postsAsCuratedEditorial,
        asGrid: postsAsCuratedEditorial,
        asZero: <ZeroStateEditorial />,
        asError: <ErrorStateEditorial />,
      },
      resultKey,
    },
  }
)

