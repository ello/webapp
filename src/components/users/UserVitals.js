import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export class UserNames extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
  }

  render() {
    const { user } = this.props
    const userPath = `/${user.username}`
    return (
      <div className="UserNames">
        <h2 className="UserUsername">
          <Link to={ userPath } >@{user.username}</Link>
        </h2>
        <h3 className="UserName">{user.name}</h3>
      </div>
    )
  }
}

export class UserStats extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
  }

  render() {
    const { user } = this.props
    const userPath = `/${user.username}`
    return (
      <div className="UserStats">
        <dl>
          <Link className="UserStatsLink" activeClassName="active" to={userPath}>
            <dt>{user.postsCount}</dt>
            <dd>Posts</dd>
          </Link>
        </dl>
        <dl>
          <span className="UserStatsLink asDisabled" activeClassName="active" to={`${userPath}/following`}>
            <dt>{user.followingCount}</dt>
            <dd>Following</dd>
          </span>
        </dl>
        <dl>
          <span className="UserStatsLink asDisabled" activeClassName="active" to={`${userPath}/followers`}>
            <dt>{user.followersCount}</dt>
            <dd>Followers</dd>
          </span>
        </dl>
        <dl>
          <span className="UserStatsLink asDisabled" activeClassName="active" to={`${userPath}/loves`}>
            <dt>{user.lovesCount}</dt>
            <dd>Loves</dd>
          </span>
        </dl>
      </div>
    )
  }
}

export class UserInfo extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
  }

  render() {
    const { user } = this.props
    let externalLinks = []

    if (user.externalLinksList) {
      externalLinks = user.externalLinksList.map((link, i) => {
        return (
          <a href={link.url} target="_blank" key={i} >{link.text}</a>
        )
      })
    }
    return (
      <div className="UserInfo">
        <div className="UserShortBio" dangerouslySetInnerHTML={{ __html: user.formattedShortBio }} />
        <p className="UserExternalLinks">
          {externalLinks}
        </p>
      </div>
    )
  }
}

