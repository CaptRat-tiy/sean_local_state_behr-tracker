"use strict";

import React from 'react';

import styles from '../styles/App.css';
import Main from './Main'
import Header from './Header'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Header />
        <Main />
      </div>
    )
  }
}
