import EditorialContainer from '../../containers/EditorialContainer'

export const getComponents = (location, cb) => {
  cb(null, EditorialContainer)
}

export default [
  {
    path: '/',
    getComponents,
  },
]

