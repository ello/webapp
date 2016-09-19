/* eslint-disable max-len */
export const DISCOVER = {
  BEACON_VERSION: '1',
  BEACON_TEXT: 'Explore creators, curated categories and communities.',
}

export const ERROR_MESSAGES = {
  NONE: '',
  EMAIL: {
    INVALID: 'That email is invalid. Please try again.',
  },
  INVITATION_CODE: {
    INVALID: 'That code is invalid. Please try again.',
  },
  PASSWORD: {
    TOO_SHORT: 'Password must be at least 8 characters.',
  },
  USERNAME: {
    EXISTS: 'Username already exists. Please try a new one. You can change your username at any time',
    INVALID_CHARACTERS: 'Username must only contain letters, numbers, underscores & dashes.',
    INVALID: 'That username is invalid. Please try again.',
    SPACES: 'Username must not contain a space.',
  },
  USERNAME_OR_EMAIL: {
    INVALID: 'That username or email is invalid.',
  },
}

export const FOLLOWING = {
  BEACON_VERSION: '1',
  BEACON_TEXT: 'Follow the creators and communities that inspire you.',
}

export const META = {
  DESCRIPTION: 'Welcome to the Creators Network. Ello is a community to discover, discuss, publish, share and promote the things you are passionate about.',
  IMAGE: '/apple-touch-icon.png',
  TITLE: 'Ello | The Creators Network.',
}

export const PREFERENCES = {
  NSFW_VIEW: {
    term: 'View Adult Content',
    desc: `<a href="${ENV.AUTH_DOMAIN}/wtf/post/rules" target="_blank">What does this mean?</a>`,
  },
  NSFW_POST: {
    term: 'Post Adult Content',
    desc: `<a href="${ENV.AUTH_DOMAIN}/wtf/post/rules" target="_blank">What does this mean?</a>`,
  },
}

export const SETTINGS = {
  NSFW_DISCLAIMER: 'Note: Apple iOS rules block the sharing of NSFW content through iOS apps. Accounts & posts marked NSFW will not appear in search results on the Ello iOS App but will appear when using Ello on the web. If you want your posts to appear on Ello iOS, please set "Post Adult Content" to "No".',
  YOUR_DATA_DESC: 'The only data that Ello stores about you is what you enter on your settings page and what you post. All other usage data that we collect is anonymized, and you can opt out.',
  ACCOUNT_DELETION_DEFINITION: {
    term: 'Delete Account',
    desc: 'By deleting your account you remove your personal information from Ello. Your account cannot be restored.',
  },
}

export const STARRED = {
  BEACON_VERSION: '1',
  BEACON_TEXT: 'Star creators and communities to curate a second stream.',
}

