import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { sample } from 'lodash'
import { selectCoverDPI } from '../selectors/gui'
import { selectPromotionsAuthentication } from '../selectors/promotions'
import { trackEvent } from '../actions/analytics'
import { SignUp } from '../components/views/SignUp'

function mapStateToProps(state) {
  return {
    coverDPI: selectCoverDPI(state),
    promotions: selectPromotionsAuthentication(state),
  }
}

class SignUpContainer extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    promotions: PropTypes.array.isRequired,
  }

  componentWillMount() {
    const { promotions } = this.props
    this.state = { promotion: sample(promotions) }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.promotion) {
      this.setState({ promotion: sample(nextProps.promotions) })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  render() {
    const { coverDPI } = this.props
    const { promotion } = this.state
    const onClickTrackCredits = this.onClickTrackCredits
    const props = { coverDPI, onClickTrackCredits, promotion }
    return <SignUp {...props} />
  }
}

export default connect(mapStateToProps)(SignUpContainer)

