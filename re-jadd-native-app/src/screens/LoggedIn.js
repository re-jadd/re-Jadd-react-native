import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Loading } from '../components/common/';
import axios from 'axios';

export default class LoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      location: '',
      error: ''
    }
  }

  componentDidMount(){
    const headers = {
      'x-auth-token': this.props.token
    };
    // console.error(headers);
    axios({
      method: 'GET',
      url: 'http://localhost:3000/Dapi/driver',
      headers: headers,
    }).then((response) => {response.data
      this.setState({
        data: response.data,
        loading: false
      });
      console.log("/n/n/n/n/", "lajkhsa", Object.keys(response.data).join(', '))
      // console.log(response)
      console.log(this.state.data)
    }).catch((error) => {

      this.setState({
        error: 'Error retrieving data',
        loading: false
      });
    });
  }

  render() {
    const { contalsiner, emailText, errorText } = styles;
    const { loading, data, error } = this.state;

    if (loading){
      return(
        <View style={container}>
          <Loading size={'large'} />
        </View>
      )
    } else {
        return(
          <View style={container}>
            <View>
              {email ?
                <Text style={emailText}>
                  Your email: {email}
                </Text>
                :
                <Text style={errorText}>
                  {error}
                </Text>}
            </View>
            <Button onPress={this.props.deleteJWT}>
              Log Out
            </Button>
          </View>
      );
    }
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  emailText: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 20
  },
  errorText: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red'
  }
};
