import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { searchPosts, searchUsers } from 'ello-brains/networking/api'
import FormControl from './FormControl'
import { SearchIcon } from '../assets/Icons'
import { TabListButtons } from '../tabs/TabList'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const searchBarStyle = css(
  s.relative,
  { maxWidth: 680, padding: '20px 10px 10px' },
  select('+ StreamContainer .Users.asList', s.mxAuto, { maxWidth: 680 }),
  select('& .SearchControl', {
    marginTop: '15vh',
    transition: 'margin-top 0.2s ease',
    transitionDelay: '1s',
  }),
  select('& .SearchControl.hasValue', s.mt0),
  media(
    s.minBreak2,
    s.mxAuto,
    { padding: '40px 20px 10px' },
  ),
  media(
    s.minBreak4,
    s.px40,
  ),
)

class SearchControl extends Component {

  static propTypes = {
    activeType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    text: PropTypes.string,
    tabs: PropTypes.array.isRequired,
  }

  static defaultProps = {
    className: 'SearchControl',
    id: 'terms',
    label: 'Search',
    name: 'search[terms]',
    placeholder: 'Search',
    text: '',
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.text.input.focus()
    })
  }

  shouldComponentUpdate(nextProps) {
    return this.props.text !== nextProps.text || this.props.activeType !== nextProps.activeType
  }

  render() {
    const { activeType, onChange, onSubmit, tabs, text } = this.props
    return (
      <form
        action={activeType === 'users' ? searchUsers(text).path : searchPosts(text).path}
        className={searchBarStyle}
        method="POST"
        onSubmit={onSubmit}
      >
        <FormControl
          {...this.props}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          icon={<SearchIcon />}
          isSearch
          key={activeType}
          ref={(comp) => { this.text = comp }}
          type="text"
        />
        <TabListButtons
          activeType={activeType}
          className="SearchTabList"
          onTabClick={onChange}
          tabClasses="LabelTab SearchLabelTab"
          tabs={tabs}
        />
      </form>
    )
  }
}

export default SearchControl

