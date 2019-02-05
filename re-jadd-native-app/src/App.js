import React, { Component } from 'react';
import { Loading } from './components/common/';
import Auth from './screens/Auth';
import LoggedIn from './screens/LoggedIn';
import deviceStorage from './services/deviceStorage.js';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      loading: true
    }

    this.newJWT = this.newJWT.bind(this);
    this.deleteJWT = deviceStorage.deleteJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();
  }

  newJWT(jwt){
    this.setState({
      token: jwt
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <Loading size={'large'} />
       );
    } else if (!this.state.token) {
      return (
        <Auth newJWT={this.newJWT} />
      );
    } else if (this.state.token) {
      return (
        <LoggedIn token={this.state.token} deleteJWT={this.deleteJWT} />
      );
    }
  }
}
