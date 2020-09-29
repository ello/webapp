import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closeClubhouseAlert } from '../actions/gui'
import { closeModal } from '../actions/modals'
import { css, media, descendent } from '../styles/jss'

const chLogo = '/static/images/ch-logo.png'

export function mapStateToProps() {
  return {
  }
}

const clubhouseAlertStyle = css(
  {
    position: 'fixed',
    top: '50%',
    margin: 'auto',
    transform: 'translateX(50%) translateY(-50%)',
    background: 'rgba(245, 245, 245, 0.9)',
    padding: '48px',
    maxWidth: '30rem',
    zIndex: '9999',
  },
  descendent('h2,p', {
    color: 'black',
  }),
  descendent('h2,img', {
    display: 'inline-block',
    height: '60px',
    marginTop: '-2px',
  }),
  descendent('h2', {
    fontSize: '1.5rem',
    lineHeight: '1',
  }),
  descendent('p', {
    fontSize: '0.875rem',
  }),
  descendent('.actions', {
    textAlign: 'center',
    marginTop: '2rem',
  }),
  descendent('button.main', {
    width: '100%',
    marginBottom: '1rem',
    height: '3.75rem',
    lineHeight: '3.75rem',
    paddingRight: '1.875rem',
    paddingLeft: '1.875rem',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(196,92,221)',
    background: 'linear-gradient(0deg, rgba(196,92,221,1) 0%, rgba(79,109,253,1) 100%)',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: 'none',
    transition: 'background-color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, width 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s',
  }),
  descendent('button.main:hover, button.main:focus, button.main:active', {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 177, 0)',
    borderColor: 'rgb(0, 177, 0)',
  }),

  descendent('a', {
    color: '#000',
  }),
  descendent('button', {
    background: 'transparent',
    border: '0',
    fontSize: '0.875rem',
    height: '2.25rem',
    lineHeight: '2.25rem',
    paddingRight: '1.875rem',
    paddingLeft: '1.875rem',
    color: 'rgba(255,255,255,0.5)',
    transition: 'color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s',
  }),

  descendent('button:hover, button:focus, button:active', {
    color: 'rgba(255,255,255,1)',
  }),

  media('screen and (max-width: 30rem)', {
    overflow: 'auto',
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
  }),
)

class ClubhouseAlert extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  onClickAccept = () => {
    const redirectUrl = 'https://tlnt.at/30lF38W'
    const win = window.open(redirectUrl, '_blank')
    win.focus()
    this.closeModalAndAlert()
  }

  onClickClose = () => {
    this.closeModalAndAlert()
  }

  closeModalAndAlert = () => {
    const { dispatch } = this.props
    dispatch(closeClubhouseAlert())
    dispatch(closeModal())
  }

  render() {
    return (
      <div className={clubhouseAlertStyle}>
        <h2>
          Let&rsquo;s build a more creative world with <img src={chLogo} alt="Club.House" />
        </h2>
        <p>
          Club.House is a place for Young Creators to learn and collaborate with brands,
          celebrities and educators.
        </p>
        <div className="actions">
          <button className="main" onClick={this.onClickAccept}>Join the Club</button>
          <a href="#nothanks" onClick={this.onClickClose}>No Thanks</a>
        </div>
      </div>)
  }
}

export default connect(mapStateToProps)(ClubhouseAlert)
