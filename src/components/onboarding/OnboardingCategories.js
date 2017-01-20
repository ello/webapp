import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import { CheckIcon } from '../editor/EditorIcons'

class CategoryButton extends Component {

  static propTypes = {
    category: PropTypes.object.isRequired,
    onCategoryClick: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = { isActive: false }
  }

  onClick = () => {
    const { category, onCategoryClick } = this.props
    this.setState({ isActive: !this.state.isActive })
    onCategoryClick(category.get('id'))
  }

  render() {
    const { category } = this.props
    const { isActive } = this.state
    return (
      <button
        onClick={this.onClick}
        className={classNames('CategoryLink', { isActive })}
        style={{ backgroundImage: `url("${category.getIn(['tileImage', 'large', 'url'])}")` }}
      >
        <span className="CategoryLinkName">
          {isActive ? <CheckIcon /> : null}
          {category.get('name')}
        </span>
      </button>
    )
  }
}

const OnboardingCategories = ({
  categories,
  isNextDisabled,
  onCategoryClick,
}) => {
  const btns = []
  categories.map(category =>
    btns.push(
      <CategoryButton
        category={category}
        key={`CategoryLink_${category.get('slug')}`}
        onCategoryClick={onCategoryClick}
      />,
    ),
  )
  return (
    <MainView className="Onboarding OnboardingCategories">
      <h1 className="OnboardingHeading">
        <span>{'Pick what you\'re into.'}</span>
        <span> Slow down & check out some cool ass shit.</span>
      </h1>
      <section className="StreamContainer">
        <div className="Categories asGrid">{btns}</div>
      </section>
      <OnboardingNavbar isNextDisabled={isNextDisabled} />
    </MainView>
  )
}

OnboardingCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  isNextDisabled: PropTypes.bool.isRequired,
  onCategoryClick: PropTypes.func.isRequired,
}

export default OnboardingCategories

