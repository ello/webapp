import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import trunc from 'trunc-html'

export const UserDetailHelmet = ({ user }) => {
  const { name, username } = user
  const title = name ? `${name} (@${username}) | Ello` : `@${username} | Ello`
  const image = user.coverImage && user.coverImage.optimized ? user.coverImage.optimized.url : null
  const userBio = user.formattedShortBio
  const msg = name ? `See ${name}'s work on Ello @${username}` : `See @${username}'s work on Ello.`
  const description = userBio ? trunc(userBio, 160).text : msg
  const robots = user.badForSeo ? 'noindex, follow' : 'index, follow'
  return (
    <Helmet
      title={title}
      meta={[
        { name: 'robots', content: robots },
        { name: 'name', itemprop: 'name', content: title },
        { name: 'description', itemprop: 'description', content: description },
        { name: 'image', itemprop: 'image', content: image },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
      ]}
    />
  )
}

UserDetailHelmet.propTypes = {
  user: PropTypes.object,
}

export default UserDetailHelmet

