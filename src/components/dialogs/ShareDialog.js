/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react'
import {
  FacebookIcon,
  GooglePlusIcon,
  LinkedInIcon,
  MailIcon,
  PinterestIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
} from '../assets/Icons'

const SHARE_TYPES = {
  EMAIL: 'email',
  FACEBOOK: 'facebook',
  GOOGLE_PLUS: 'google+',
  LINKEDIN: 'linkedin',
  PINTEREST: 'pinterest',
  REDDIT: 'reddit',
  TUMBLR: 'tumblr',
  TWITTER: 'twitter',
}

const SHARE_DIMENSIONS = {}
SHARE_DIMENSIONS[SHARE_TYPES.FACEBOOK] = { width: 480, height: 210 }
SHARE_DIMENSIONS[SHARE_TYPES.GOOGLE_PLUS] = { width: 500, height: 385 }
SHARE_DIMENSIONS[SHARE_TYPES.LINKEDIN] = { width: 550, height: 460 }
SHARE_DIMENSIONS[SHARE_TYPES.PINTEREST] = { width: 750, height: 320 }
SHARE_DIMENSIONS[SHARE_TYPES.REDDIT] = { width: 540, height: 420 }
SHARE_DIMENSIONS[SHARE_TYPES.TUMBLR] = { width: 450, height: 430 }
SHARE_DIMENSIONS[SHARE_TYPES.TWITTER] = { width: 520, height: 250 }

function onClickReadOnlyInput(e) {
  e.target.select()
}

class ShareDialog extends Component {

  static propTypes = {
    author: PropTypes.object,
    post: PropTypes.object,
    username: PropTypes.string,
    trackEvent: PropTypes.func,
  }

  componentWillMount() {
    const { username } = this.props
    return username ? this.getMountShareUser() : this.getMountSharePost()
  }

  onClickOpenShareWindow = (e) => {
    const type = e.target.dataset.type
    const url = this.getUrl(type)
    const { trackEvent, username } = this.props
    if (url.indexOf('mailto') === 0) {
      document.location.href = url
    } else {
      const width = SHARE_DIMENSIONS[type].width || 700
      const height = SHARE_DIMENSIONS[type].height || 450
      window.open(url, 'sharewindow', `width=${width}, height=${height}, left=${(window.innerWidth / 2) - (width / 2)}, top=${(window.innerHeight / 2) - (height / 2)}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`)
    }
    if (trackEvent) {
      const eventType = username ? `share-user-to-${type}-profile` : `share-to-${type}`
      trackEvent(eventType)
    }
  }

  getMountSharePost() {
    const { author, post } = this.props
    this.shareLink = `${window.location.protocol}//${window.location.host}/${author.get('username')}/post/${post.get('token')}`
    let summary = 'Check out this post on Ello'
    // email string, since we can fit more text content
    const emailSubject = `${summary}, via @${author.get('username')}`
    // grab out the image and summary from the post
    this.image = null
    post.get('summary').forEach((region) => {
      if (/text/.test(region.get('kind'))) {
        const div = document.createElement('div')
        div.innerHTML = region.get('data')
        summary = div.textContent
      } else if (!this.image && /image/.test(region.get('kind'))) {
        this.image = region.getIn(['data', 'url'])
        if (this.image.indexOf('//') === 0) {
          this.image = `http:${this.image}`
        }
      }
    })
    // truncate the tweet summary to be <= 140
    let tweetSummary = summary
    if (tweetSummary.length + this.shareLink.length > 139) {
      tweetSummary = tweetSummary.substr(0, 139 - this.shareLink.length)
      const summaryArr = tweetSummary.split(' ')
      summaryArr.pop()
      tweetSummary = summaryArr.join(' ')
    }
    // create "safe" versions of what we need to use
    this.shareLinkSafe = window.encodeURIComponent(this.shareLink)
    this.summarySafe = window.encodeURIComponent(summary)
    this.tweetSummarySafe = window.encodeURIComponent(tweetSummary)
    this.emailSubjectSafe = window.encodeURIComponent(emailSubject)
    this.emailBodySafe = `${this.summarySafe}%0D%0A%0D%0A${this.shareLinkSafe}`
  }

  getMountShareUser() {
    const { username } = this.props
    const summary = `Check out @${username} on Ello`
    this.shareLink = `${window.location.protocol}//${window.location.host}/${username}`
    this.shareLinkSafe = window.encodeURIComponent(this.shareLink)
    this.summarySafe = window.encodeURIComponent(summary)
    this.tweetSummarySafe = this.summarySafe
    this.emailSubjectSafe = this.summarySafe
    this.emailBodySafe = `${this.summarySafe}%0D%0A%0D%0A${this.shareLinkSafe}`
  }

  getUrl(type) {
    switch (type) {
      case SHARE_TYPES.FACEBOOK:
        return `https://www.facebook.com/sharer/sharer.php?u=${this.shareLinkSafe}`
      case SHARE_TYPES.GOOGLE_PLUS:
        return `https://plus.google.com/share?url=${this.shareLinkSafe}`
      case SHARE_TYPES.LINKEDIN:
        return `http://www.linkedin.com/shareArticle?mini=true&url=${this.shareLinkSafe}&title=${this.summarySafe}`
      case SHARE_TYPES.PINTEREST:
        return `http://pinterest.com/pin/create/button/?url=${this.shareLinkSafe}&description=${this.summarySafe}&media=${this.image}`
      case SHARE_TYPES.REDDIT:
        return `http://reddit.com/submit?url=${this.shareLinkSafe}&title=${this.summarySafe}`
      case SHARE_TYPES.TUMBLR:
        return `http://www.tumblr.com/share/link?url=${this.shareLinkSafe}&name=${this.summarySafe}`
      case SHARE_TYPES.TWITTER:
        return `https://twitter.com/intent/tweet?url=${this.shareLinkSafe}&text=${this.tweetSummarySafe}`
      case SHARE_TYPES.EMAIL:
      default:
        return `mailto:?subject=${this.emailSubjectSafe}&body=${this.emailBodySafe}`
    }
  }

  render() {
    return (
      <div className="Dialog ShareDialog">
        <input
          className="ShareControl"
          type="url"
          readOnly
          onClick={onClickReadOnlyInput}
          value={this.shareLink}
        />
        <div className="ShareLinks">
          <button className="ShareLink" data-type={SHARE_TYPES.EMAIL} onClick={this.onClickOpenShareWindow}><MailIcon /></button>
          <button className="ShareLink" data-type={SHARE_TYPES.FACEBOOK} onClick={this.onClickOpenShareWindow}><FacebookIcon /></button>
          <button className="ShareLink" data-type={SHARE_TYPES.TWITTER} onClick={this.onClickOpenShareWindow}><TwitterIcon /></button>
          <button className="ShareLink" data-type={SHARE_TYPES.PINTEREST} onClick={this.onClickOpenShareWindow}><PinterestIcon /></button>
          <button className="ShareLink" data-type={SHARE_TYPES.GOOGLE_PLUS} onClick={this.onClickOpenShareWindow}><GooglePlusIcon /></button>
          <button className="ShareLink" data-type={SHARE_TYPES.TUMBLR} onClick={this.onClickOpenShareWindow}><TumblrIcon /></button>
          <button className="ShareLink" data-type={SHARE_TYPES.REDDIT} onClick={this.onClickOpenShareWindow}><RedditIcon /></button>
          <button className="ShareLink" data-type={SHARE_TYPES.LINKEDIN} onClick={this.onClickOpenShareWindow}><LinkedInIcon /></button>
        </div>
      </div>
    )
  }
}

export default ShareDialog

