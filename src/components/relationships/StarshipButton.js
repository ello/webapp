import React, { PropTypes, PureComponent } from 'react'
import classNames from 'classnames'
import { RELATIONSHIP_PRIORITY } from '../../constants/relationship_types'
import { StarIcon } from '../relationships/RelationshipIcons'

export function getNextPriority(currentPriority) {
  switch (currentPriority) {
    case RELATIONSHIP_PRIORITY.NOISE:
      return RELATIONSHIP_PRIORITY.FRIEND
    default:
      return RELATIONSHIP_PRIORITY.NOISE
  }
}

class StarshipButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    priority: PropTypes.oneOf([
      RELATIONSHIP_PRIORITY.INACTIVE,
      RELATIONSHIP_PRIORITY.FRIEND,
      RELATIONSHIP_PRIORITY.NOISE,
      RELATIONSHIP_PRIORITY.SELF,
      RELATIONSHIP_PRIORITY.MUTE,
      RELATIONSHIP_PRIORITY.BLOCK,
      RELATIONSHIP_PRIORITY.NONE,
      null,
    ]).isRequired,
    userId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  }

  componentWillMount() {
    this.state = { nextPriority: getNextPriority(this.props.priority) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ nextPriority: getNextPriority(nextProps.priority) })
  }

  onClickUpdatePriority = () => {
    const { nextPriority } = this.state
    const { onClick, priority, userId } = this.props
    if (onClick) {
      onClick({ userId, priority: nextPriority, existing: priority })
    }
  }

  renderStar() {
    const { className, priority } = this.props
    return (
      <button
        className={classNames('StarshipButton', className)}
        data-priority={priority}
        onClick={this.onClickUpdatePriority}
      >
        <StarIcon />
        <span className="StarshipButtonLabel">{priority === 'noise' ? 'Starred' : 'Star'}</span>
      </button>
    )
  }

  render() {
    const { priority } = this.props
    return priority === RELATIONSHIP_PRIORITY.SELF ? null : this.renderStar()
  }
}

export default StarshipButton

