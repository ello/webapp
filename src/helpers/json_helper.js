import Immutable from 'immutable'

// TODO: test these as they are data related
export function findBy(params, collection, json) {
  // console.log('findBy', params, collection, json)
  const models = json.get(collection)
  if (!models) { return Immutable.Map() }
  return models.find(model =>
    Object.keys(params).every(key => model.get(key) === params[key]),
  )
}

export function findModel(json, initModel) {
  if (!initModel || !initModel.findObj || !initModel.collection) {
    return Immutable.Map()
  }
  return findBy(initModel.findObj, initModel.collection, json)
}

export function getLinkObject(model, identifier, json) {
  const link = model.getIn(['links', identifier])
  if (!link) { return Immutable.Map() }
  const key = link.get('id', link)
  const mappingType = link.get('type', identifier)
  const deletedCollection = json[`deleted_${mappingType}`]
  if (!deletedCollection || deletedCollection.indexOf(key) === -1) {
    return json.getIn([mappingType, key])
  }
  return Immutable.Map()
}

export function getLinkArray(model, identifier, json) {
  const link = model.getIn(['links', identifier])
  if (!link) { return Immutable.List() }
  const keys = link.get('ids', link)
  const mappingType = link.get('type', identifier)
  const collection = json.get(mappingType)
  const deletedCollection = json.get(`deleted_${mappingType}`)
  if (keys.length && collection) {
    // filter they keys so that models that don't exist
    // aren't added to the link object mainly used for
    // when a model gets deleted ie: post or comment
    const filteredKeys = keys.filter(key =>
      collection.get(key) && (!deletedCollection || deletedCollection.includes(key)),
    )
    return filteredKeys.map(key => collection.get(key))
  }
  return Immutable.List()
}

