import { connect } from 'react-redux'
import { closeAlert } from 'ello-brains/actions/modals'
import Dialog from '../components/dialogs/Dialog'

export default connect(
  null,
  { closeAlert },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    onClick: dispatchProps.closeAlert,
  }),
)(Dialog)
