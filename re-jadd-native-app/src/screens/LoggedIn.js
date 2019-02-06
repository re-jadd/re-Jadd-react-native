import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Loading } from '../components/common/';
import { CurrentLocation } from '../components/CurrentLocation';
import { MapView, Location, Permissions } from "expo";
import axios from 'axios';

// const fakedata = [
//    {
//     driver_id: 1,
//     id: 1,
//     location:  {
//       x: 24.666352,
//       y: 46.674326,
//     },
//     size: 15,
//     state_order: processing,
//     type: Medium,
//     user_id: 1,
//   },
//    {
//     driver_id: 2,
//     id: 2,
//     location:  {
//       x: 24.663232,
//       y: 46.673658,
//     },
//     size: 15,
//     state_order: processing,
//     type: Medium,
//     user_id: 1
//   }
// ]
export default class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: '',
      order: '',
      error: '',
      mapRegion: {
        latitude: 24.6939648,
        longitude: 46.7091456,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      locationResult: null,
      location: { coords: { latitude: null, longitude: null } },
      orderLocation: { coords: { latitude: 24, longitude: 46 } },
    }
  }
  componentDidMount() {
    this.fetchallorder()
    // this._getLocationAsync();
    this.CurrentLocation()
  }


  fetchallorder() {
    const headers = {
      'x-auth-token': this.props.token
    };
    // console.error(headers);
    axios({
      method: 'GET',
      url: 'http://localhost:3000/Dapi/driver',
      headers: headers,
    }).then((response) => {
      response.data
      this.setState({
        data: response.data,
        loading: false
      })
      this.allordermarker()

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

  // _getLocationAsync = async () => {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //     this.setState({
  //       locationResult: 'Permission to access location was denied',
  //       location,
  //     });
  //   }

  //   let location = await Location.getCurrentPositionAsync({});
  //   this.setState({ locationResult: JSON.stringify(location), location, });
  // };
  allordermarker() {

    {
      this.state.data.map((marker) => {

        this.setState({
          orderLocation: {
            coords: {
              latitude: marker.location.x,
              longitude: marker.location.y
            }
          }

        });
      })
    }
  }
  // _handleMapRegionChange = mapRegion => {
  //   this.setState({ mapRegion });
  // };

  fetchOrder(id) {
    const headers = {
      'x-auth-token': this.props.token
    };
    axios({
      method: 'GET',
      url: `http://localhost:3000/Dapi/driver/${id}`,
      headers: headers,
    }).then((response) => {
      this.setState({
        order: response.data,
        loading: false
      })
      console.log("/n/n/n/n/", "lajkhsa", Object.keys(response.data).join(', '))
      // console.log(response)
      console.log(this.state.order)
    }).catch((error) => {

      this.setState({
        error: 'Error retrieving data',
        loading: false
      });
    });

  }


  CurrentLocation() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          location: {
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          },
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  printRegionLocation() {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n ggggg", this.state.mapRegion)
  }

  formatLocation(lan, long) {
    return {
      latitude: lan,
      latitudeDelta: 0.0922,
      longitude: long,
      longitudeDelta: 0.0421,
    }
  }

  renderPhone(){
    if(this.state.order !== ''){
    return (
      <View>
            <Text>
            Phone call: {this.state.order.userphone}
            </Text>
            <Button onPress={this.props.deleteJWT}>
            Start tracking
          </Button>
          </View>
    )}
  }
  render() {
    const { container, emailText, errorText } = styles;
    const { loading, data, error, order } = this.state;

    if (loading) {
      return (
        <View style={container}>
          <Loading size={'large'} />
        </View>
      )
    } else {
      return (
        <View >
          <MapView
            MapView
            style={{ alignSelf: 'stretch', height: '80%' }}
            provider="google"
            region={{
              latitude: this.state.mapRegion.latitude,
              longitude: this.state.mapRegion.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          // onRegionChange={this._handleMapRegionChange}
          >

            {/* <orderPlace
allordermarker

/> */}

            {data.map((marker, index) => {
              return (<MapView.Marker
                key={index}
                coordinate={this.formatLocation(marker.location.x, marker.location.y)}
                title={marker.state_order}
                description={marker.type}
                onPress={() => {this.fetchOrder(marker.id)}}

              // onPress={}
              />)
            })}


            <MapView.Marker
              image={require('../../assets/icon.png')}
              coordinate={this.state.mapRegion}
              title="Your Location"
              description="Some description"
            />

          </MapView>

          <View>

          </View>
          <Button onPress={this.props.deleteJWT}>
            Log Out
          </Button>

          {this.renderPhone()}
 
        </View>
      );
    }
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',

    alignItems: 'center',
    backgroundColor: '#ecf0f1',
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
