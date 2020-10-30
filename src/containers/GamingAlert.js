import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { closeGamingAlert } from "../actions/gui";
import { closeModal } from "../actions/modals";
import { css, media, descendent } from "../styles/jss";

const background = '/static/images/alerts/gaming-alert-bg.jpg'

export function mapStateToProps() {
  return {};
}

const gamingAlertStyle = css(
  {
    position: "fixed",
    top: "50%",
    margin: "auto",
    transform: "translateX(50%) translateY(-50%)",
    background: `rgb(0, 0, 0) url(${background}) no-repeat center center`,
    backgroundSize: "cover",
    padding: "32px",
    maxWidth: "30rem",
    paddingTop: "176px",
    zIndex: "9999",
  },
  descendent("h2,p", {
    color: "rgb(255, 255, 255)",
  }),
  descendent("h2", {
    fontSize: "2rem",
    lineHeight: "1",
    fontWeight: "bold",
    margin: "0 0 8px",
  }),
  descendent("p", {
    fontSize: "0.875rem",
  }),
  descendent(".actions", {
    display: "flex",
    marginTop: "1rem",
    alignItems: "center",
  }),
  descendent("button.main", {
    padding: "8px 16px",
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(0, 0, 0)",
    fontWeight: "bold",
    border: "none",
    margin: "0 16px 0 0"
  }),
  descendent("button.main:hover, button.main:focus, button.main:active", {
    color: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255, 255, 255)",
  }),
  descendent("a", {
    color: "rgb(255, 255, 255)",
    fontSize: "0.875rem",
  }),

  media("screen and (max-width: 30rem)", {
    overflow: "auto",
    width: "100vw",
    height: "100vh",
    maxWidth: "none",
  })
);

class GamingAlert extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  onClickAccept = () => {
    const redirectUrl = "https://tlnt.at/2HtMW5h";
    const win = window.open(redirectUrl, "_blank");
    win.focus();
    this.closeModalAndAlert();
  };

  onClickClose = () => {
    this.closeModalAndAlert();
  };

  closeModalAndAlert = () => {
    const { dispatch } = this.props;
    dispatch(closeGamingAlert());
    dispatch(closeModal());
  };

  render() {
    return (
      <div className={gamingAlertStyle}>
        <h2>Got Game?</h2>
        <p>Tell us more! We want to learn about your gaming skills.</p>
        <div className="actions">
          <button className="main" onClick={this.onClickAccept}>
            Tell us more
          </button>
          <a href="#nothanks" onClick={this.onClickClose}>
            No, thanks
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(GamingAlert);
