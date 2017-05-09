/* eslint-disable import/no-mutable-exports */
import Immutable from 'immutable'
import upperFirst from 'lodash/upperFirst'
import * as MAPPING_TYPES from '../../src/constants/mapping_types'

let json = Immutable.Map()

function clearJSON() {
  json = Immutable.Map()
}
const commonProps = {
  id: '1',
  createdAt: new Date(),
  href: 'href',
  links: {},
}

function addToJSON(collection, model) {
  json = json.setIn([`${collection}`, `${model.get('id')}`], model)
}

export function stubAuthenticationStore(isLoggedIn = true) {
  return Immutable.Map({
    accessToken: 'authenticationAccessToken',
    expirationDate: 'authenticationExpirationDate',
    isLoggedIn,
    refreshToken: 'authenticationRefreshToken',
  })
}

export function stubAvatar(url = '') {
  return Immutable.fromJS({
    original: {
      url,
    },
    large: {
      url,
      metadata: null,
    },
    regular: {
      url,
      metadata: null,
    },
    small: {
      url,
      metadata: null,
    },
  })
}

export function stubCoverImage() {
  return Immutable.fromJS({
    original: {
      url: '',
    },
    optimized: {
      url: '',
      metadata: null,
    },
  })
}

function stubAuthPromotion(username = '666') {
  return Immutable.fromJS({
    avatar: { regular: `${username}-avatar.jpg` },
    coverImage: {
      hdpi: { url: `${username}-cover-hdpi.jpg` },
      xhdpi: { url: `${username}-cover-xhdpi.jpg` },
      optimized: { url: `${username}-cover-optimized.jpg` },
    },
    username,
  })
}

export function stubAnnouncementNotification(properties = {}, shouldAdd = true) {
  const defaultProps = {
    body: 'Announcement body',
    ctaCaption: 'Announcement CTA Caption',
    ctaHref: 'https://example.com',
    header: 'Announcement header',
    id: '8',
    image: {
      hdpi: { url: 'announcement-hdpi.jpg' },
      xhdpi: { url: 'announcement-xhdpi.jpg' },
      optimized: { url: 'announcement-optimized.jpg' },
      original: { url: 'announcement-original.jpg' },
    },
  }
  const model = Immutable.fromJS({ ...defaultProps, ...properties })
  if (shouldAdd) { addToJSON(MAPPING_TYPES.ANNOUNCEMENTS, model) }
  return model
}

// TODO: Update these as the API changes...
export function stubEditorial(kind, properties, shouldAdd = true) {
  const linkPost = { href: '/api/v2/posts/1', id: '1', type: 'posts' }
  const defaultProps = () => {
    switch (kind) {
      case 'post_stream': {
        return {
          id: 'editorialExternalId',
          image: null,
          kind: 'post',
          title: 'Editorial Title',
        }
      }
      case 'external': {
        return {
          id: 'editorialExternalId',
          image: null,
          kind: 'post',
          subtitle: 'Editorial Post Subtitle',
          title: 'Editorial Title',
          url: '/external/url',
        }
      }
      case 'post':
      default: {
        return {
          id: 'editorialPostId',
          image: null,
          kind: 'post',
          links: { post: linkPost },
          subtitle: 'Editorial Post Subtitle',
          title: 'Editorial Title',
        }
      }
    }
  }
  const model = Immutable.fromJS({ ...defaultProps(), ...properties })
  if (shouldAdd) { addToJSON(MAPPING_TYPES.EDITORIALS, model) }
  return model
}

function stubUser(properties, shouldAdd = true) {
  const defaultProps = {
    avatar: stubAvatar(),
    backgroundPosition: null,
    badForSeo: false,
    badges: [],
    coverImage: stubCoverImage(),
    experimentalFeatures: false,
    externalLinksList: [
      {
        url: 'http://www.google.com',
        text: 'google.com',
      },
    ],
    followersCount: 0,
    followingCount: 0,
    formattedShortBio: '<p>Formatted Short Bio</p>',
    hasAutoWatchEnabled: true,
    hasCommentingEnabled: true,
    hasLovesEnabled: true,
    hasRepostingEnabled: true,
    hasSharingEnabled: true,
    href: '/href',
    isCollaborateable: false,
    isCommunity: false,
    isHireable: true,
    location: 'Planet Earth, 90210',
    lovesCount: 0,
    metaAttributes: {
      description: 'meta user description',
      image: 'meta-user-image.jpg',
      robots: 'index, follow',
      title: 'meta user title',
    },
    name: 'name',
    postsAdultContent: false,
    postsCount: 0,
    relationshipPriority: null,
    shortBio: '<p>Formatted Short Bio</p>',
    username: 'username',
    viewsAdultContent: true,
  }
  const model = Immutable.fromJS({ ...commonProps, ...defaultProps, ...properties })
  if (shouldAdd) { addToJSON(MAPPING_TYPES.USERS, model) }
  return model
}

export function stubEmbedRegion(properties) {
  const defaultProps = {
    kind: 'embed',
    data: {
      id: 'service-url/embed-service-id',
      service: 'service',
      thumbnailLargeUrl: 'image-large-url',
      thumbnailSmallUrl: 'image-small-url',
      url: 'service/service-url/embed-service-id',
    },
  }
  return Immutable.fromJS({ ...defaultProps, ...properties })
}

export function stubImageRegion(properties) {
  const defaultProps = {
    kind: 'image',
    data: {
      alt: 'image-alt',
      url: 'image-url',
    },
  }
  return Immutable.fromJS({ ...defaultProps, ...properties })
}

function stubTextRegion(properties) {
  const defaultProps = {
    kind: 'text',
    data: '<p>Text Region</p>',
  }
  return Immutable.fromJS({ ...defaultProps, ...properties })
}

function stubPost(properties, shouldAdd = true) {
  const defaultProps = {
    authorId: 'authorId',
    body: [],
    commentsCount: 0,
    content: [stubTextRegion()],
    contentWarning: null,
    isAdultContent: false,
    loved: false,
    lovesCount: 0,
    metaAttributes: {
      canonicalUrl: null,
      description: 'meta post description',
      images: ['meta-post-image-0.jpg', 'meta-post-image-1.jpg'],
      embeds: ['meta-post-embed-0.mp4', 'meta-post-embed-1.mp4'],
      robots: 'index, follow',
      title: 'meta post title',
      url: 'https://ello.co/author/post/meta-url',
    },
    repostCount: 0,
    reposted: false,
    summary: [stubTextRegion()],
    token: 'token',
    viewsCount: 0,
  }
  const model = Immutable.fromJS({ ...commonProps, ...defaultProps, ...properties })
  if (shouldAdd) { addToJSON(MAPPING_TYPES.POSTS, model) }
  return model
}

function stubComment(properties, shouldAdd = true) {
  const defaultProps = {
    authorId: 'authorId',
    body: [],
    content: [stubTextRegion()],
    postId: '1',
    summary: [stubTextRegion()],
  }
  const model = Immutable.fromJS({ ...commonProps, ...defaultProps, ...properties })
  if (shouldAdd) { addToJSON(MAPPING_TYPES.COMMENTS, model) }
  return model
}

export function stubBadges() {
  const badges = [
    {
      image: { width: 48, height: 48, url: '/assets/badges/featured.png' },
      learnMoreCaption: 'Learn More',
      learnMoreHref: 'https://ello.co/wtf/help/featured-users/',
      name: 'Featured',
      slug: 'featured',
    },
    {
      image: { width: 48, height: 48, url: '/assets/badges/community.png' },
      learnMoreCaption: 'Learn More',
      learnMoreHref: 'https://ello.co/wtf/resources/community-directory/',
      name: 'Community Profile',
      slug: 'community',
    },
    {
      image: { width: 48, height: 48, url: '/assets/badges/experimental.png' },
      learnMoreCaption: 'Learn More',
      learnMoreHref: 'https://ello.co/wtf/help/featured-users/',
      name: 'Experimental Group',
      slug: 'experimental',
    },
    {
      image: { width: 48, height: 48, url: '/assets/badges/staff.png' },
      learnMoreCaption: 'Meet the Staff',
      learnMoreHref: 'https://ello.co/wtf/about/the-people-of-ello/',
      name: 'Ello Staff Member',
      slug: 'staff',
    },
    {
      image: { width: 48, height: 48, url: '/assets/badges/spam.png' },
      learnMoreCaption: null,
      learnMoreHref: null,
      name: 'Spam',
      slug: 'spam',
    },
    {
      image: { width: 48, height: 48, url: '/assets/badges/nsfw.png' },
      learnMoreCaption: null,
      learnMoreHref: null,
      name: 'NSFW',
      slug: 'nsfw',
    },
  ]
  json = json.set(MAPPING_TYPES.BADGES, Immutable.fromJS(badges))
  return json.get(MAPPING_TYPES.BADGES)
}

export function stubCategories(properties) {
  const categories = [
    { level: 'meta', slug: 'featured', order: 0 },
    { level: 'meta', slug: 'trending', order: 1 },
    { level: 'meta', slug: 'recent', order: 1 },
    { level: 'primary', slug: 'metal', order: 0, allowInOnboarding: true },
    { level: 'primary', slug: 'art', order: 1, allowInOnboarding: true },
    { level: 'secondary', slug: 'collage', order: 0 },
    { level: 'secondary', slug: 'interviews', order: 1 },
    { level: 'tertiary', slug: 'music', order: 0 },
    { level: 'tertiary', slug: 'development', order: 1 },
  ]
  categories.forEach((category, index) => {
    const defaultProps = {
      id: index + 1,
      links: { recent: { related: `/categories/${category.name}/posts/recent` } },
      name: upperFirst(category.slug),
      slug: category.slug,
      tileImage: {
        large: { url: `/tile_image/${index + 1}/large.png`, metadata: 'meta large' },
        optimized: { url: `/tile_image/${index + 1}/optimized.png`, metadata: 'meta optimized' },
        regular: { url: `/tile_image/${index + 1}/regular.png`, metadata: 'meta regular' },
        small: { url: `/tile_image/${index + 1}/small.png`, metadata: 'meta small' },
      },
    }
    const model = Immutable.fromJS({ ...category, ...defaultProps, ...properties })
    addToJSON('categories', model)
  })
  return json.get('categories')
}

export function stubInvitation(properties, isAccepted = true, shouldAdd = true) {
  const defaultProps = {
    acceptedAt: null,
    code: 'invitationCode',
    createdAt: 'invitationCreatedAt',
    email: 'email@example.com',
    id: '1',
  }

  const acceptedProps = {
    acceptedAt: 'invitationAcceptedAt',
    links: {
      acceptedBy: {
        href: '/api/v2/users/100',
        id: '100',
        type: 'users',
      },
    },
  }
  const props = isAccepted ? { ...defaultProps, ...acceptedProps } : defaultProps
  const model = Immutable.fromJS({ ...props, ...properties })
  if (shouldAdd) { addToJSON(MAPPING_TYPES.INVITATIONS, model) }
  return model
}

function stubPage(path, properties = {}) {
  const page = Immutable.fromJS({
    ids: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    next: {
      ids: [],
      pagination: { next: '/next/next', totalCount: 1, totalPages: 3, totalPagesRemaining: 2 },
      type: 'posts',
    },
    pagination: { next: '/next', totalCount: 1, totalPages: 3, totalPagesRemaining: 2 },
    type: 'posts',
    ...properties,
  })
  json = json.setIn(['pages', path], page)
  return page
}

export function stub(model, properties) {
  switch (model.toLowerCase()) {
    case 'comment':
      return stubComment(properties)
    case 'post':
      return stubPost(properties)
    case 'user':
      return stubUser(properties)
    default:
      return null
  }
}

export function stubJS(model, properties) {
  switch (model.toLowerCase()) {
    case 'comment':
      return stubComment(properties, false).toJS()
    case 'post':
      return stubPost(properties, false).toJS()
    case 'user':
      return stubUser(properties, false).toJS()
    default:
      return null
  }
}

export function stubJSONStore() {
  // add some users
  stub('user', { id: '1', username: 'archer' })
  stub('user', { id: '2', username: 'lana' })
  stub('user', { id: '3', username: 'cyril' })
  stub('user', { id: '4', username: 'pam' })
  stub('user', { id: 'inf', followersCount: '∞', username: 'ello' })
  // add some posts
  stub('post', { id: '1', repostsCount: 1, token: 'token1', authorId: '1' })
  stub('post', { id: '2', repostsCount: 1, token: 'token2', authorId: '2' })
  stub('post', { id: '3', repostsCount: 1, token: 'token3', authorId: '3' })
  stub('post', { id: '4', repostsCount: 1, token: 'token4', authorId: '4' })
  // TODO: Stub out some real pages with more accurate results
  stubPage('/discover')
  stubPage('/following')
  stubPage('/search/posts')
  stubPage('/search/users')
  stubPage('/mk')
  stubPage('all-categories', {
    next: undefined,
    pagination: { totalCount: null, totalPages: null, totalPagesRemaining: null },
    type: 'categories',
  })
  stubCategories()
  return json
}

export { clearJSON, json, stubPost, stubAuthPromotion, stubTextRegion, stubUser }

