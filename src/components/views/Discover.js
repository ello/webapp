import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import StreamContainer from '../../containers/StreamContainer'
import { CategoryTabBar } from '../tabs/CategoryTabBar'
import { MainView } from '../views/MainView'

export const Discover = ({
  pageTitle,
  pathname,
  streamAction,
  tabs,
  title,
  }) =>
  <MainView className="Discover">
    <Helmet
      title={title}
      meta={[
        { property: 'og:title', content: title },
        { name: 'name', itemprop: 'name', content: title },
      ]}
    />
    <CategoryTabBar pathname={pathname} tabs={tabs} />
    {pageTitle ? <h1 className="DiscoverPageTitle">{pageTitle}</h1> : null}
    <StreamContainer action={streamAction} />
  </MainView>

Discover.propTypes = {
  pageTitle: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  streamAction: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default Discover

