import { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectAllowsAnalytics, selectAnalyticsId, selectCreatedAt } from '../selectors/profile'

export function addSegment(uid, createdAt) {
  if (typeof window !== 'undefined') {
    /* eslint-disable */
    !function(){const analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){const e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(let t=0;t<analytics.methods.length;t++){const e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){const e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";const n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};
      /* eslint-enable */
      analytics.SNIPPET_VERSION = '3.1.0'
      analytics.load(ENV.SEGMENT_WRITE_KEY)
      if (uid) {
        analytics.identify(uid, { createdAt })
      }
    }
    }();
  }
}

export function doesAllowTracking() {
  if (typeof window === 'undefined') { return false }
  return !(
    window.navigator.doNotTrack === '1' ||
    window.navigator.msDoNotTrack === '1' ||
    window.doNotTrack === '1' ||
    window.msDoNotTrack === '1'
  )
}

function mapStateToProps(state) {
  return {
    allowsAnalytics: selectAllowsAnalytics(state),
    analyticsId: selectAnalyticsId(state),
    createdAt: selectCreatedAt(state),
    isLoggedIn: selectIsLoggedIn(state),
  }
}

class AnalyticsContainer extends PureComponent {

  static propTypes = {
    allowsAnalytics: PropTypes.bool,
    analyticsId: PropTypes.string,
    createdAt: PropTypes.string,
    isLoggedIn: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    allowsAnalytics: null,
    analyticsId: null,
    createdAt: null,
  }

  componentWillMount() {
    this.hasLoadedTracking = false
  }

  componentDidMount() {
    const { analyticsId, allowsAnalytics, createdAt, isLoggedIn } = this.props
    if (this.hasLoadedTracking) { return }
    if (!isLoggedIn && doesAllowTracking()) {
      this.hasLoadedTracking = true
      addSegment()
    } else if (analyticsId && allowsAnalytics) {
      this.hasLoadedTracking = true
      addSegment(analyticsId, createdAt)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { allowsAnalytics, analyticsId, createdAt } = nextProps
    if (this.hasLoadedTracking) {
      // identify the user if they didn't previously have an id to identify with
      if (!this.props.analyticsId && analyticsId) {
        window.analytics.identify(analyticsId, { createdAt })
      }
    } else if (this.props.analyticsId && analyticsId && allowsAnalytics) {
      this.hasLoadedTracking = true
      addSegment(analyticsId, createdAt)
    }
  }

  render() {
    return null
  }
}

export default connect(mapStateToProps)(AnalyticsContainer)

