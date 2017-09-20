import React, { PureComponent } from 'react'
import Slider from 'react-slick'
import { NextPaddle, PrevPaddle } from './CarouselParts'
import PostStreamContainer from '../../containers/PostStreamContainer'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const editorialWrapperStyle = css(
  s.relative,
  s.fullHeight,
  select('& .slick-slider, & .slick-list, & .slick-track', s.fullHeight),
)
const editorialNavStyle = css(
  s.absolute,
  s.zIndex3,
  { top: 0, right: 0 },
  media(s.minBreak2, { top: 5, right: 5 }),
)
const itemBaseStyle = css(
  s.relative,
  s.flex,
  s.flexWrap,
  s.fullWidth,
  s.fullHeight,
  s.px20,
  s.py20,
  s.bgcTransparent,
  media(s.minBreak2, s.px40, s.py40),
)

type SlickCarouselProps = {
  postIds: Array<string>,
  renderProps: any,
}

export class SlickCarousel extends PureComponent {
  props: SlickCarouselProps

  next = () => {
    this.slider.slickNext()
  }

  prev = () => {
    this.slider.slickPrev()
  }

  render() {
    const { postIds, renderProps } = this.props
    return (
      <div className={editorialWrapperStyle}>
        <Slider
          autoplay
          arrows={false}
          infinite
          ref={(comp) => { this.slider = comp; }}
        >
          {postIds.map(id => (
            <div className={itemBaseStyle} key={`curatedEditorial_post_${id}`}>
              <PostStreamContainer
                postId={id}
                {...renderProps}
              />
            </div>
          ))}
        </Slider>
        {postIds.size > 1 &&
          <nav className={editorialNavStyle}>
            <PrevPaddle onClick={this.prev} />
            <NextPaddle onClick={this.next} />
          </nav>
        }
      </div>
    )
  }
}

export default SlickCarousel

