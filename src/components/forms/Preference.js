/* eslint-disable react/no-danger */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { camelize } from 'humps'
import ToggleControl from '../forms/ToggleControl'
import { profilePath } from '../../networking/api'

const Preference = ({ definition, id, isChecked, isDisabled, onToggleChange }) =>
  <form action={profilePath().path} className="Preference" method="POST">
    <dl>
      <dt>{definition.term ? definition.term : ''}</dt>
      <dd dangerouslySetInnerHTML={{ __html: definition.desc ? definition.desc : '' }} />
    </dl>
    <ToggleControl
      id={id}
      isChecked={isChecked}
      isDisabled={isDisabled}
      onChange={onToggleChange}
    />
  </form>

Preference.propTypes = {
  definition: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onToggleChange: PropTypes.func.isRequired,
}
Preference.defaultProps = {
  isChecked: false,
  isDisabled: false,
}

function mapStateToProps(state, ownProps) {
  return {
    isChecked: state.profile.get(camelize(ownProps.id)),
    isDisabled: !state.profile.get('isPublic') && ownProps.id === 'has_sharing_enabled',
  }
}

export default connect(mapStateToProps)(Preference)

