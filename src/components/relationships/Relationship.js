// @flow
import React from 'react'
import classNames from 'classnames'
import { css, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

type Props = {
  children: React.Element<*>,
  className: string,
  relationshipPriority: string,
}

const relationshipStyle = css(
  modifier('.inUserProfile', s.inlineBlock, s.alignTop),
  modifier('.inUserProfileCard', s.inlineBlock, s.alignTop),
)

const Relationship = (props: Props) => (
  <div
    className={classNames(`RelationshipContainer ${relationshipStyle}`, props.className)}
    data-priority={props.relationshipPriority}
  >
    {props.children}
  </div>
)

export default Relationship

