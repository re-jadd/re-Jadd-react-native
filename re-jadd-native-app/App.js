import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import firebase from 'firebase';


export default class App extends React.Component {
  state = {
    email: '',
    password: '',
    errorMessage: null
  }
  componentWillMount() {
    var config = {
      apiKey: "AIzaSyA0vOsAFGvYmqOUJ8KH4TY4LSAb1AtsLpE",
      authDomain: "re-jadd-1548851180899.firebaseapp.com",
      databaseURL: "https://re-jadd-1548851180899.firebaseio.com",
      projectId: "re-jadd-1548851180899",
      storageBucket: "re-jadd-1548851180899.appspot.com",
      messagingSenderId: "366255930281"
    };
    firebase.initializeApp(config);
  }


  componentDidMount() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user);
      } else {
        console.log('no user')
      }
    });
  }


  handleSignIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log("User sign in!!!!");
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        // ...
      });

  }

  handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      console.log('sign out!!!')
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Sign in!</Text>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          // style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign in" onPress={this.handleSignIn} />
        <Button title="Sign Out" onPress={this.handleSignOut} />
      </View>
    );
  }
}

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */
