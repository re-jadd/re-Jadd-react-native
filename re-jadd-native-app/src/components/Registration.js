import React, { Component, Fragment } from 'react';
import { View, Text } from 'react-native';
import { Input, TextLink, Loading, Button } from './common';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      location: '',
      phone: '',
      error: '',
      loading: false
    };

    this.registerUser = this.registerUser.bind(this);
    this.onRegistrationFail = this.onRegistrationFail.bind(this);
  }

  registerUser() {
    const { email, name, password, location, phone } = this.state;

    this.setState({ error: '', loading: true });

    // NOTE Post to HTTPS only in production
    axios.post("http://localhost:3000/Dapi/users", {
      email: email,
      name: name,
      password: password,
      location: location,
      phone: phone
    })
    .then((response) => {
      deviceStorage.saveKey("id_token", response.data.token);
      this.props.newJWT(response.data.token);
    })

      .catch((error) => {
        console.log(error);
        this.onRegistrationFail();
      });
  }

  onRegistrationFail() {
    this.setState({
      error: 'Registration Failed',
      loading: false
    });
  }

  render() {
    const { email, name, password, location, phone, error, loading } = this.state;
    const { form, section, errorTextStyle } = styles;



    return (
      <Fragment>
        <View style={form}>
          <View style={section}>
            <Input
              placeholder="user@email.com"
              label="Email"
              value={email}
              onChangeText={email => this.setState({ email })}
            />
          </View>
          <View style={section}>
            <Input
              placeholder="name"
              label="name"
              value={name}
              onChangeText={name => this.setState({ name })}
            />
          </View>
          <View style={section}>
            <Input
              placeholder="phone"
              label="phone"
              value={phone}
              onChangeText={phone => this.setState({ phone })}
            />
          </View>
          <View style={section}>
            <Input
              secureTextEntry
              placeholder="password"
              label="Password"
              value={password}
              onChangeText={password => this.setState({ password })}
            />
          </View>

          <View style={section}>
            <Input
              placeholder="location"
              label="location"
              value={location}
              onChangeText={location => this.setState({ location })}
            />
          </View>

          <Text style={errorTextStyle}>
            {error}
          </Text>

          {!loading ?
            <Button onPress={this.registerUser}>
              Register
            </Button>
            :
            <Loading size={'large'} />
          }
        </View>
        <TextLink onPress={this.props.authSwitch}>
          Already have an account? Log in!
        </TextLink>
      </Fragment>
    );
  }
}

const styles = {
  form: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  section: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  errorTextStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red'
  }
};

export { Registration };
