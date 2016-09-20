import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Helmet from 'react-helmet'
import { META } from '../constants/locales/en'
import { selectPathname, selectViewNameFromRoute } from '../selectors/routing'
import { selectPagination } from '../selectors/pagination'
import {
  selectPostMetaCanonicalUrl,
  selectPostMetaDescription,
  selectPostMetaImages,
  selectPostMetaRobots,
  selectPostMetaTitle,
  selectPostMetaUrl,
} from '../selectors/post'
import {
  selectUserMetaDescription,
  selectUserMetaImage,
  selectUserMetaRobots,
  selectUserMetaTitle,
} from '../selectors/user'

const selectMetaPageType = createSelector(
  [selectViewNameFromRoute], viewName =>
    (viewName === 'postDetail' || viewName === 'userDetail' ? `${viewName}Tags` : 'defaultTags')
)

function mapStateToProps(state, props) {
  const pagination = selectPagination(state, props)
  return {
    metaPageType: selectMetaPageType(state, props),
    nextPage: pagination ? pagination.next : null,
    pathname: selectPathname(state),
    postMetaCanonicalUrl: selectPostMetaCanonicalUrl(state, props),
    postMetaDescription: selectPostMetaDescription(state, props),
    postMetaImages: selectPostMetaImages(state, props),
    postMetaRobots: selectPostMetaRobots(state, props),
    postMetaTitle: selectPostMetaTitle(state, props),
    postMetaUrl: selectPostMetaUrl(state, props),
    userMetaDescription: selectUserMetaDescription(state, props),
    userMetaImage: selectUserMetaImage(state, props),
    userMetaRobots: selectUserMetaRobots(state, props),
    userMetaTitle: selectUserMetaTitle(state, props),
  }
}

class MetaContainer extends Component {
  static propTypes = {
    metaPageType: PropTypes.string,
    nextPage: PropTypes.string,
    pathname: PropTypes.string,
    postMetaCanonicalUrl: PropTypes.string,
    postMetaDescription: PropTypes.string,
    postMetaImages: PropTypes.object,
    postMetaRobots: PropTypes.string,
    postMetaTitle: PropTypes.string,
    postMetaUrl: PropTypes.string,
    userMetaDescription: PropTypes.string,
    userMetaImage: PropTypes.string,
    userMetaRobots: PropTypes.string,
    userMetaTitle: PropTypes.string,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  getDefaultTags(title = META.TITLE, image = META.IMAGE, description = META.DESCRIPTION) {
    const { nextPage, pathname } = this.props
    const url = `${ENV.AUTH_DOMAIN}${pathname}`
    const meta = [
      { name: 'apple-itunes-app', content: 'app-id=953614327', 'app-argument': pathname },
      { name: 'name', itemprop: 'name', content: title },
      { name: 'url', itemprop: 'url', content: url },
      { name: 'description', itemprop: 'description', content: description },
      { name: 'image', itemprop: 'image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]
    const link = [
      nextPage ? { href: `${pathname}?${nextPage.split('?')[1]}`, rel: 'next' } : {},
    ]
    return { title, meta, link }
  }

  getUserDetailTags() {
    const { userMetaDescription, userMetaImage, userMetaRobots, userMetaTitle } = this.props
    const defaultTags = this.getDefaultTags(userMetaTitle, userMetaImage, userMetaDescription)
    const meta = [
      ...defaultTags.meta,
      { name: 'robots', content: userMetaRobots },
    ]
    const link = defaultTags.link
    return { title: userMetaTitle, meta, link }
  }

  getPostDetailTags() {
    const { pathname, postMetaCanonicalUrl, postMetaUrl } = this.props
    const { postMetaTitle, postMetaDescription, postMetaImages, postMetaRobots } = this.props
    const title = postMetaTitle
    const description = postMetaDescription
    const url = postMetaUrl
    const hasImages = postMetaImages.schemaImages && postMetaImages.schemaImages.length
    const twitterCard = hasImages ? 'summary_large_image' : 'summary'
    const meta = [
      { name: 'apple-itunes-app', content: 'app-id=953614327', 'app-argument': pathname },
      { name: 'name', itemprop: 'name', content: title },
      { name: 'url', itemprop: 'url', content: url },
      { name: 'description', itemprop: 'description', content: description },
      ...postMetaImages.schemaImages,
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      ...postMetaImages.openGraphImages,
      { name: 'twitter:card', content: twitterCard },
      { name: 'robots', content: postMetaRobots },
    ]
    const link = postMetaCanonicalUrl ? [{ href: postMetaCanonicalUrl, rel: 'canonical' }] : []
    return { title: postMetaTitle, meta, link }
  }

  getTags() {
    const { metaPageType, postMetaTitle, userMetaTitle } = this.props
    if (metaPageType === 'postDetailTags' && postMetaTitle) {
      return this.getPostDetailTags()
    } else if (metaPageType === 'userDetailTags' && userMetaTitle) {
      return this.getUserDetailTags()
    }
    return this.getDefaultTags()
  }

  render() {
    const tags = this.getTags()
    return <Helmet title={tags.title} meta={tags.meta} link={tags.link} />
  }
}

export default connect(mapStateToProps)(MetaContainer)

