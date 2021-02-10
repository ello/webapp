import React from 'react'
import { css, select } from '../../styles/jss'
import * as i from '../assets/Icons'
import * as s from '../../styles/jso'

const sectionStyle = css(s.flex, s.flexColumn, s.flexWrap, s.wrapperPaddingX, s.my40)
const h2Style = css(s.mb10, s.fontSize16)
const groupStyle = css(
  s.flex,
  s.mb40,
  select('& > *', s.mr10),
)

// TODO: Move to icons...
const badgeStyle = select('& .CheckShape', { stroke: '#fff' })

export default () =>
  (<section className={sectionStyle}>
    <h2 className={h2Style}>Ello icons</h2>
    <div className={groupStyle}>
      <i.ElloBoxMark />
      <i.ElloMark />
      <i.ElloRainbowMark />
      <i.ElloDonutMark />
    </div>
    <h2 className={h2Style}>Badge icons</h2>
    <div className={groupStyle}>
      <button className={badgeStyle} title="BadgeCheckIcon">
        <i.BadgeCheckIcon />
      </button>
    </div>
    <h2 className={h2Style}>Icons</h2>
    <div className={groupStyle}>
      { [
        i.ArrowIcon,
        i.BoltIcon,
        i.BrowseIcon,
        i.BubbleIcon,
        i.CheckCircleIcon,
        i.CheckIconSM,
        i.CheckIcon,
        i.CheckIconLG,
        i.ChevronCircleIcon,
        i.ChevronIcon,
        i.CircleIcon,
        i.CircleIconLG,
        i.DotsIcon,
        i.DragIcon,
        i.EyeIcon,
        i.FlagIcon,
        i.GridIcon,
        i.HeartIcon,
        i.LinkIcon,
        i.ListIcon,
        i.LockIcon,
        i.MarkerIcon,
        i.MoneyIcon,
        i.PencilIcon,
        i.PlusCircleIcon,
        i.PlusIconSM,
        i.RelationshipIcon,
        i.ReplyIcon,
        i.ReplyAllIcon,
        i.RepostIcon,
        i.SearchIcon,
        i.ShareIcon,
        i.SparklesIcon,
        i.XBoxIcon,
        i.XIcon,
        i.XIconLG,
      ].map(icon => <button key={icon.name} title={icon.name}>{icon()}</button>) }
    </div>
    <h2 className={h2Style}>Social icons</h2>
    <div className={groupStyle} >
      { [
        i.FacebookIcon,
        i.GooglePlusIcon,
        i.LinkedInIcon,
        i.MailIcon,
        i.PinterestIcon,
        i.RedditIcon,
        i.TumblrIcon,
        i.TwitterIcon,
      ].map(icon => <button key={icon.name} title={icon.name}>{icon()}</button>) }
    </div>
  </section>)

