import React, { Component, PropTypes } from 'react'
import FormControl from './FormControl'

class UsernameControl extends Component {

  static propTypes = {
    suggestions: PropTypes.array,
  }

  static defaultProps = {
    className: 'UsernameControl',
    id: 'username',
    label: 'Username',
    name: 'user[username]',
    placeholder: 'Enter your username',
    suggestions: null,
  }

  onClickUsernameSuggestion = (e) => {
    const val = e.target.title
    const element = document.getElementById('username')
    if (element) {
      element.value = val
    }
  }

  renderSuggestions = () => {
    const { suggestions } = this.props
    if (suggestions && suggestions.length) {
      return (
        <ul className="FormControlSuggestionList hasSuggestions">
          <p>Here are some available usernames &mdash;</p>
          {suggestions.map(suggestion =>
            <li key={`suggestion_${suggestion}`}>
              <button
                className="FormControlSuggestionButton"
                title={suggestion}
                onClick={this.onClickUsernameSuggestion}
              >
                {suggestion}
              </button>
            </li>,
            )}
        </ul>
      )
    }
    return (
      <p className="FormControlSuggestionList">
        <span />
      </p>
    )
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        maxLength="50"
        renderFeedback={this.renderSuggestions}
        trimWhitespace
        type="text"
      />
    )
  }
}

export default UsernameControl

