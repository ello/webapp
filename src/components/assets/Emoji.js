import React, { PropTypes } from 'react'
import classNames from 'classnames'

const Emoji = (props) => {
  const { alt, className, name = 'ello', size = 20, src, title, width, height } = props
  const tip = name.replace(/_|-/, ' ')
  return (
    <img
      {...props}
      alt={alt || tip}
      className={classNames(className, 'Emoji')}
      src={src || `${ENV.AUTH_DOMAIN}/images/emoji/${name}.png`}
      title={title || tip}
      width={width || size}
      height={height || size}
      size={null}
      name={null}
    />
  )
}

Emoji.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  src: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}
Emoji.defaultProps = {
  alt: null,
  className: null,
  name: null,
  size: null,
  src: null,
  title: null,
  width: null,
  height: null,
}

export default Emoji

