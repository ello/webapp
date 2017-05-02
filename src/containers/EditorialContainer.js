// @flow
import React, { Component } from 'react'
import Editorial from '../components/editorial/Editorial'

const editorials = [
  { title: 'Editorial 00', bgc: 'magenta' },
  { title: 'Editorial 01', bgc: 'blue' },
  { title: 'Editorial 02', bgc: 'red' },
  { title: 'Editorial 03', bgc: 'green' },
  { title: 'Editorial 04', bgc: 'purple' },
  { title: 'Editorial 05', bgc: 'olive' },
  { title: 'Editorial 06', bgc: 'teal' },
  { title: 'Editorial 07', bgc: 'orange' },
  { title: 'Editorial 08', bgc: 'darkolivegreen' },
  { title: 'Editorial 10', bgc: 'darkred' },
  { title: 'Editorial 11', bgc: 'palevioletred' },
  { title: 'Editorial 12', bgc: 'midnightblue' },
  { title: 'Editorial 13', bgc: 'peru' },
  { title: 'Editorial 14', bgc: 'salmon' },
  { title: 'Editorial 15', bgc: 'slategrey' },
  { title: 'Editorial 16', bgc: 'steelblue' },
  { title: 'Editorial 17', bgc: 'rebeccapurple' },
  { title: 'Editorial 18', bgc: 'lightcoral' },
  { title: 'Editorial 19', bgc: 'orangered' },
  { title: 'Editorial 20', bgc: 'plum' },
  { title: 'Editorial 21', bgc: 'mediumorchid' },
  { title: 'Editorial 22', bgc: 'mediumslateblue' },
  { title: 'Editorial 23', bgc: 'saddlebrown' },
  { title: 'Editorial 24', bgc: 'seagreen' },
]

export default class extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return <Editorial modules={editorials} />
  }
}

