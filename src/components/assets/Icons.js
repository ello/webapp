/* eslint-disable max-len */
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { SVGBox, SVGIcon } from '../svg/SVGComponents'

// -------------------------------------
// Shapes for building icons

const FillShapeForty = ({ className = 'svg-fill' }) =>
  <path className={className} d="M0 0h40v40h-40z" />

FillShapeForty.propTypes = {
  className: PropTypes.string,
}
FillShapeForty.defaultProps = {
  className: null,
}

const FillShapeSixty = ({ className = 'svg-fill' }) =>
  <path className={className} d="M0 0h60v60h-60z" />

FillShapeSixty.propTypes = {
  className: PropTypes.string,
}
FillShapeSixty.defaultProps = {
  className: null,
}

const SmileShapeForty = () =>
  <path className="SmileShape" d="M20.5 32c-5.5 0-10.2-3.7-11.6-9-.2-.6.2-1.2.8-1.4.6-.2 1.2.2 1.4.8 1.1 4.3 5 7.3 9.4 7.3s8.3-3 9.4-7.3c.2-.6.8-1 1.4-.8.6.2 1 .8.8 1.4-1.3 5.3-6.1 9-11.6 9z" />

const BadgeShape = () =>
  <g className="BadgeShape svg-fill-stroke svg-stroke-round">
    <polygon points="12,1 14.2,3.8 17.5,2.5 18,6 21.5,6.5 20.2,9.8 23,12 20.2,14.2 21.5,17.5 18,18 17.5,21.5 14.2,20.2 12,23 9.8,20.2 6.5,21.5 6,18 2.5,17.5 3.8,14.2 1,12 3.8,9.8 2.5,6.5 6,6 6.5,2.5 9.8,3.8" />
  </g>

const CheckShape = () =>
  <g className="CheckShape svg-stroke svg-stroke-bevel">
    <polyline points="8,11.9 11.3,16 16,8" />
  </g>

// -------------------------------------
// Ello icons

export const ElloMark = ({ className }) =>
  <SVGBox className={classNames('ElloMark', className)}>
    <FillShapeForty className="SVGBoxBG" />
    <SmileShapeForty />
  </SVGBox>

ElloMark.propTypes = {
  className: PropTypes.string,
}

export const ElloBoxMark = () =>
  <SVGBox className="ElloBoxMark">
    <FillShapeForty className="SVGBoxBG" />
    <SmileShapeForty />
  </SVGBox>

export const ElloRainbowMark = () =>
  <SVGBox className="ElloRainbowMark">
    <rect fill="#e31e26" y="0" width="40" height="7" />
    <rect fill="#f78c1f" y="7" width="40" height="7" />
    <rect fill="#fdec0a" y="14" width="40" height="7" />
    <rect fill="#0c8140" y="21" width="40" height="7" />
    <rect fill="#3f5fac" y="28" width="40" height="7" />
    <rect fill="#732a83" y="35" width="40" height="7" />
    <SmileShapeForty />
  </SVGBox>

export const ElloDonutMark = () =>
  <SVGBox className="ElloDonutMark">
    <rect fill="#fcc688" width="40" height="40" />
    <rect fill="#ffffff" x="11" y="11" width="16" height="16" />
    <path fill="#ef628a" d="M38.2,19.7c0-1.8-1.1-3.4-2.7-4.1c1.2-1.4,1.5-3.4,0.5-5.1c-0.9-1.6-2.7-2.4-4.4-2.2c0.4-1.8-0.4-3.7-2.1-4.7 C27.9,2.8,25.9,3,24.5,4c-0.6-1.7-2.2-3-4.2-3c-1.8,0-3.4,1.1-4,2.7c-1.4-1.2-3.4-1.4-5-0.5C9.7,4.2,8.9,5.9,9.1,7.7 C7.3,7.3,5.4,8.1,4.4,9.7c-0.9,1.6-0.8,3.5,0.3,4.9c-1.7,0.6-3,2.2-3,4.2c0,1.9,1.1,3.4,2.7,4.1C3.3,24.3,3,26.3,4,28 c0.9,1.6,2.7,2.4,4.4,2.2C8,32,8.8,33.9,10.5,34.9c1.6,0.9,3.5,0.7,4.9-0.3c0.6,1.7,2.2,3,4.2,3c1.9,0,3.4-1.1,4.1-2.7 c1.4,1.2,3.4,1.5,5.1,0.5c1.6-0.9,2.4-2.7,2.2-4.4c1.8,0.4,3.7-0.4,4.7-2.1c0.9-1.6,0.7-3.5-0.3-4.9C37,23.3,38.2,21.7,38.2,19.7z M20,26.3c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S23.9,26.3,20,26.3z" />
    <path fill="#fb9a4a" d="M20,14.1c3.6,0,6.5,2.7,6.9,6.1c0-0.3,0.1-0.6,0.1-0.9c0-3.9-3.1-7-7-7c-3.9,0-7,3.1-7,7c0,0.3,0,0.6,0.1,0.9 C13.5,16.8,16.4,14.1,20,14.1z" />
    <SmileShapeForty />
  </SVGBox>

export const ElloOutlineMark = () =>
  <SVGBox className="ElloOutlineMark">
    <FillShapeForty className="svg-fill-transparent" />
    <SmileShapeForty />
  </SVGBox>

// Modifier overlays on top of any logo marks
export const ElloNinjaSuit = () =>
  <svg className="ElloNinjaSuit" height="40" width="48">
    <path d="M5.6,6.2C3.8,8,2.4,10.2,1.4,12.7h44.2l-3.1-3.2l3.1-3.2H5.6z" />
  </svg>

// -------------------------------------
// Badge icons

export const BadgeCheckIcon = () =>
  <SVGBox className="BadgeCheckIcon" size="24">
    <BadgeShape />
    <CheckShape />
  </SVGBox>

// -------------------------------------
// SVG icons

export const ShareIcon = () =>
  <SVGIcon className="ShareIcon">
    <g>
      <polyline points="7.8,7.3 5,7.3 5,17.3 15,17.3 15,7.3 12.2,7.3" />
    </g>
    <g>
      <line x1="10" y1="2" x2="10" y2="12" />
      <polyline points="7.2,4.7 10,2 12.8,4.8" />
    </g>
  </SVGIcon>

export const XIcon = () =>
  <SVGIcon className="CancelIcon">
    <g>
      <line x1="6" x2="14" y1="6" y2="14" />
      <line x1="14" x2="6" y1="6" y2="14" />
    </g>
  </SVGIcon>

export const CheckIcon = () =>
  <SVGIcon className="CheckIcon">
    <CheckShape />
  </SVGIcon>

export const ArrowEastIcon = () =>
  <SVGIcon className="ArrowEastIcon">
    <g>
      <line x1="14.5" x2="4.5" y1="10" y2="10" />
    </g>
    <g>
      <polyline points="10,5.5 14.5,10 10,14.5" />
    </g>
  </SVGIcon>

// From Footer
export const PhoneIcon = () =>
  <SVGIcon className="PhoneIcon">
    <g>
      <line x1="5" y1="14.1" x2="14.7" y2="14.1" />
      <line x1="5" y1="5.9" x2="14.7" y2="5.9" />
      <circle cx="9.9" cy="16.3" r="0.6" />
      <circle cx="8.2" cy="3.7" r="0.6" />
      <path d="M14.7,16.8c0,1-0.8,1.8-1.8,1.8H6.8c-1,0-1.8-0.8-1.8-1.8V3.2c0-1,0.8-1.8,1.8-1.8H13 c1,0,1.8,0.8,1.8,1.8V16.8z" />
      <path d="M10.4,4.2C10,4.2,9.8,4,9.8,3.7s0.3-0.6,0.6-0.6h1.1c0.3,0,0.6,0.3,0.6,0.6s-0.3,0.6-0.6,0.6 H10.4z" />
    </g>
  </SVGIcon>

// From Footer
export const ChevronIcon = () =>
  <SVGIcon className="ChevronIcon">
    <g>
      <polyline points="5,12.2 10.2,7 15.5,12.2" />
    </g>
  </SVGIcon>

// From Footer
export const ListIcon = () =>
  <SVGIcon className="ListIcon">
    <g>
      <path d="M6.2,8.8c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h7.5c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5H6.2z" />
      <path d="M6.2,16.2c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h7.5c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5H6.2z" />
    </g>
  </SVGIcon>

// From Footer
export const GridIcon = () =>
  <SVGIcon className="GridIcon">
    <g>
      <circle cx="6.2" cy="6.2" r="2.5" />
      <circle cx="13.8" cy="6.2" r="2.5" />
      <circle cx="6.2" cy="13.8" r="2.5" />
      <circle cx="13.8" cy="13.8" r="2.5" />
    </g>
  </SVGIcon>


export const MarkerIcon = () =>
  <SVGIcon className="MarkerIcon">
    <path className="svg-fill" d="M10,2C6.7,2,4,4.7,4,8c0,3.7,4.3,9.4,5.6,11.1c0.2,0.3,0.6,0.3,0.8,0C11.7,17.4,16,11.8,16,8 C16,4.7,13.3,2,10,2z M10,9.9C9,9.9,8.1,9,8.1,8C8.1,7,9,6.1,10,6.1S11.9,7,11.9,8C11.9,9,11,9.9,10,9.9z" />
  </SVGIcon>

// -------------------------------------
// SVG social icons

export const FacebookIcon = () =>
  <SVGBox className="FacebookIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M31.3 38h-3.5v-8h-1.8v-2.8h1.8v-1.7c0-2.2 1-3.6 3.8-3.6h2.4v2.8h-1.5c-1.1 0-1.2.4-1.2 1.1v1.4h2.7l-.3 2.8h-2.4v8z" />
  </SVGBox>

export const GooglePlusIcon = () =>
  <SVGBox className="GooglePlusIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M38 25v-3h-1v3h-3v1h3v3h1v-3h3v-1zM32.2 21h-5s-4.8.1-4.8 4.4c0 4.3 4.7 3.8 4.7 3.8v1.1c0 .4.4.3.4 1.2-.3 0-6.4-.2-6.4 3.8 0 3.9 5.2 3.7 5.2 3.7s6 .3 6-4.6c0-2.9-3.4-3.8-3.4-5 0-1.2 2.6-1.5 2.6-4.3 0-1.7-.2-2.6-1.5-3.2-.1-.4 2.2-.1 2.2-.9zm-1.6 13.8c.1 1.5-1.5 2.9-3.6 3-2.1.1-3.8-1-3.9-2.5-.1-1.5 1.5-2.9 3.6-3 2-.2 3.8.9 3.9 2.5zm-3.1-6.6c-1.2.3-2.6-.8-3.1-2.5s.1-3.4 1.4-3.7c1.2-.3 2.6.8 3.1 2.5s-.2 3.4-1.4 3.7z" />
  </SVGBox>

export const LinkedInIcon = () =>
  <SVGBox className="LinkedInIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M25.9 38v-10.8h-3.6v10.8h3.6zm-1.9-12.3c1.3 0 2.1-.8 2.1-1.9 0-1.1-.8-1.9-2-1.9s-2.1.8-2.1 1.9c0 1.1.8 1.9 2 1.9zM27.9 38h3.6v-6c0-.3 0-.6.1-.9.3-.6.9-1.3 1.9-1.3 1.3 0 1.8 1 1.8 2.4v5.8h3.7v-6.2c0-3.3-1.8-4.9-4.2-4.9-2 0-2.8 1.1-3.3 1.8v-1.6h-3.6v10.9z" />
  </SVGBox>

export const MailIcon = () =>
  <SVGBox className="MailIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <polygon className="SVGBoxFG" points="20.724,25.067 20.724,34.632 26.574,29.605" />
    <polygon className="SVGBoxFG" points="33.426,29.605 39.277,34.632 39.277,25.066" />
    <path className="SVGBoxFG" d="M29.617,31.964l-2.034-1.578l-5.173,4.444h15.18l-5.173-4.444l-2.034,1.578 C30.158,32.139,29.842,32.139,29.617,31.964z" />
    <polygon className="SVGBoxFG" points="30,30.68 38.451,24.125 21.549,24.125" />
  </SVGBox>

export const PinterestIcon = () =>
  <SVGBox className="PinterestIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M30 21c-5 0-9 4-9 9 0 3.7 2.2 6.8 5.4 8.2 0-.6 0-1.4.2-2.1.2-.7 1.2-4.9 1.2-4.9s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2 1 .5 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.8 0-2-1.3-3.4-3.7-3.4-2.7 0-4.4 2-4.4 4.3 0 .8.2 1.3.6 1.8.2.2.2.3.1.5 0 .2-.1.6-.2.7-.1.2-.2.3-.5.2-1.3-.5-1.8-1.9-1.8-3.4 0-2.6 2.2-5.6 6.4-5.6 3.4 0 5.7 2.5 5.7 5.2 0 3.5-2 6.2-4.9 6.2-1 0-1.9-.5-2.2-1.1 0 0-.5 2.1-.6 2.5-.2.7-.6 1.4-.9 1.9.8.2 1.7.4 2.5.4 5 0 9-4 9-9 0-5.2-4-9.2-9-9.2z" />
  </SVGBox>

export const RedditIcon = () =>
  <SVGBox className="RedditIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M38.1 22c0 .9.7 1.6 1.6 1.6.9 0 1.6-.7 1.6-1.6 0-.9-.7-1.6-1.6-1.6-.8 0-1.6.7-1.6 1.6zm-.1-.9l-5.4-1.1c-.2 0-.5.1-.5.3l-2.1 5.7h1l1.8-5.1 5 1 .2-.8zm-18.9 11.4c.4-1.5 1.5-2.9 3-4-.4-.4-1-.6-1.6-.6-1.4 0-2.5 1.1-2.5 2.5 0 .8.4 1.6 1.1 2.1zm22.5 1.3c0-3.9-4.9-7-10.9-7s-10.9 3.1-10.9 7 4.9 7 10.9 7 10.9-3.1 10.9-7zm1.9-3.4c0-1.4-1.1-2.5-2.5-2.5-.6 0-1.2.3-1.7.7 1.5 1.1 2.6 2.5 3 4 .7-.5 1.2-1.3 1.2-2.2z" />
    <circle className="SVGBoxBG" cx="34.7" cy="32.4" r="1.7" />
    <circle className="SVGBoxBG" cx="26.7" cy="32.4" r="1.7" />
    <path className="SVGBoxBG" d="M34.4 36.9c-.7.7-1.9 1.1-3.6 1.1-1.7 0-2.9-.3-3.6-1.1-.2-.2-.4-.2-.6 0s-.2.4 0 .6c.9.9 2.2 1.3 4.2 1.3 1.9 0 3.3-.4 4.2-1.3.2-.2.2-.4 0-.6-.2-.1-.5-.1-.6 0z" />
  </SVGBox>

export const TumblrIcon = () =>
  <SVGBox className="TumblrIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M30.6 22v4h3.9v2.5h-3.9v4.1c0 .9 0 1.5.1 1.8.1.3.3.5.6.6.4.2.8.3 1.2.3.8 0 1.6-.3 2.5-.8v2.5c-.7.3-1.3.5-1.9.7-.6.1-1.2.2-1.8.2-.7 0-1.4-.1-2-.3-.6-.2-1.1-.4-1.5-.8-.4-.3-.7-.7-.8-1.1-.2-.4-.2-.9-.2-1.7v-5.6h-1.8v-2.3c.6-.2 1.2-.5 1.6-.9.5-.4.8-.8 1.1-1.4.3-.5.5-1.2.6-2h2.3z" />
  </SVGBox>

export const TwitterIcon = () =>
  <SVGBox className="TwitterIcon" size="60">
    <FillShapeSixty className="SVGBoxBG" />
    <path className="SVGBoxFG" d="M40 23.9c-.7.3-1.5.5-2.4.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.8-4.1 4 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.5-4.2-.4.6-.6 1.3-.6 2 0 1.4.7 2.6 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7-.3 0-.7 0-1-.1 1.8 1.1 4 1.8 6.3 1.8 7.8.1 12-6.1 12-11.4v-.5c.8-.6 1.5-1.3 2-2.1z" />
  </SVGBox>

