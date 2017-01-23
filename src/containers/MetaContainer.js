import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Helmet from 'react-helmet'
import { META } from '../constants/locales/en'
import { selectDiscoverMetaData } from '../selectors/categories'
import { selectPagination } from '../selectors/pagination'
import {
  selectPostMetaCanonicalUrl,
  selectPostMetaDescription,
  selectPostMetaImages,
  selectPostMetaRobots,
  selectPostMetaTitle,
  selectPostMetaUrl,
} from '../selectors/post'
import { selectPathname, selectQueryTerms, selectViewNameFromRoute } from '../selectors/routing'
import {
  selectUserMetaDescription,
  selectUserMetaImage,
  selectUserMetaRobots,
  selectUserMetaTitle,
} from '../selectors/user'

const selectMetaPageType = createSelector(
  [selectViewNameFromRoute], viewName =>
    (viewName === 'postDetail' || viewName === 'userDetail' ? `${viewName}Tags` : 'defaultTags'),
)

const selectDefaultMetaRobots = createSelector(
  [selectViewNameFromRoute, selectQueryTerms], (viewName, terms) => {
    if (viewName === 'search' && terms && terms.length) {
      return terms.charAt(0) === '#' ? 'index, follow' : 'noindex, follow'
    }
    return null
  },
)

function mapStateToProps(state, props) {
  const pagination = selectPagination(state, props)
  return {
    defaultMetaRobots: selectDefaultMetaRobots(state, props),
    discoverMetaData: selectDiscoverMetaData(state, props),
    metaPageType: selectMetaPageType(state, props),
    nextPage: pagination ? pagination.get('next') : null,
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
    viewName: selectViewNameFromRoute(state),
  }
}

class MetaContainer extends PureComponent {
  static propTypes = {
    defaultMetaRobots: PropTypes.string,
    discoverMetaData: PropTypes.object.isRequired,
    metaPageType: PropTypes.string.isRequired,
    nextPage: PropTypes.string,
    pathname: PropTypes.string.isRequired,
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
    viewName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    defaultMetaRobots: null,
    nextPage: null,
    postMetaCanonicalUrl: null,
    postMetaDescription: null,
    postMetaImages: null,
    postMetaRobots: null,
    postMetaTitle: null,
    postMetaUrl: null,
    userMetaDescription: null,
    userMetaImage: null,
    userMetaRobots: null,
    userMetaTitle: null,
  }

  getDefaultTags({
    description = META.DESCRIPTION,
    image = META.IMAGE,
    title = META.TITLE,
    robots = null,
  } = {}) {
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
    if (robots) {
      meta.push({ name: 'robots', content: robots })
    }
    const link = [
      nextPage ? { href: `${pathname}?${nextPage.split('?')[1]}`, rel: 'next' } : {},
    ]
    return { title, meta, link }
  }

  getUserDetailTags() {
    const { userMetaDescription, userMetaImage, userMetaRobots, userMetaTitle } = this.props
    const defaultTags = this.getDefaultTags({
      description: userMetaDescription,
      image: userMetaImage,
      title: userMetaTitle,
    })
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
    const {
      defaultMetaRobots,
      discoverMetaData,
      metaPageType,
      pathname,
      postMetaTitle,
      userMetaTitle,
      viewName,
    } = this.props
    if (metaPageType === 'postDetailTags' && postMetaTitle) {
      return this.getPostDetailTags()
    } else if (metaPageType === 'userDetailTags' && userMetaTitle) {
      return this.getUserDetailTags()
    } else if (viewName === 'discover') {
      return this.getDefaultTags({
        description: discoverMetaData.description,
        image: discoverMetaData.image,
        title: discoverMetaData.title,
      })
    } else if (viewName === 'search') {
      return this.getDefaultTags({
        description: META.SEARCH_PAGE_DESCRIPTION,
        image: discoverMetaData.image,
        title: META.SEARCH_TITLE,
        robots: defaultMetaRobots,
      })
    } else if (viewName === 'authentication') {
      switch (pathname) {
        case '/enter':
          return this.getDefaultTags({
            description: META.ENTER_PAGE_DESCRIPTION,
            title: META.ENTER_TITLE,
          })
        case '/forgot-password':
          return this.getDefaultTags({
            description: META.FORGOT_PAGE_DESCRIPTION,
            title: META.FORGOT_TITLE,
          })
        case '/join':
        case '/signup':
          return this.getDefaultTags({
            description: META.SIGNUP_PAGE_DESCRIPTION,
            title: META.SIGNUP_TITLE,
          })
        default:
          return this.getDefaultTags()
      }
    }
    return this.getDefaultTags()
  }

  render() {
    const tags = this.getTags()
    return <Helmet title={tags.title} meta={tags.meta} link={tags.link} />
  }
}

export default connect(mapStateToProps)(MetaContainer)

