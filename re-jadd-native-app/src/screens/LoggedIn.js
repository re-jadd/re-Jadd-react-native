import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button, Loading } from '../components/common/';
import { MapView } from "expo";
import axios from 'axios';
import Polyline from '@mapbox/polyline';
import getDirections from 'react-native-google-maps-directions'
import { Icon } from 'react-native-elements'
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
      Coordinates: [],
      distanceTravelled: 0,

    }
    this.getDirections = this.getDirections.bind(this)
    this.handleGetDirections = this.handleGetDirections.bind(this)
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

      console.log("\n\n\n\n\n", "lajkhsa", Object.keys(response.data).join(', '))
      // console.log(response)
      console.log(this.state.data)
    }).catch((error) => {

      this.setState({
        error: 'Error retrieving data',
        loading: false
      });
    });
  }
  async getDirections(driverloc, orderloc) {
    try {
      let resp = await fetch(
        `http://MAP_TYPES.googleapis.com/maps/api/directions/json?origin=${driverloc}&destination=${orderloc}&mode=walking&key=AIzaSyDD-SoH6u8iFqWUzUK2d-IGNuDBgkP8bws
`  );
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routs[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]

        }
      })
      const newCoords = [...this.state.coordinate, coords];
      this.setState({ coordinate: newCoords })
      return coords
    } catch (error) {
      return error
    }
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
      this.getDirections(
        this.order.userlocation.x,
        this.order.userlocation.y,
        this.state.mapRegion.latitude,
        this.state.mapRegion.longitude,
      )
      console.log("\n\n\n\n\n", "lajkhsa", Object.keys(response.data).join(', '))
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
        if (postion == this.state.order.userlocation) {

        }
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

  renderPhone() {

    if (this.state.order !== '') {
      return (
        <View>
          <View
          
          >
          <Icon
            name='call'
            />
          <Text>
            {this.state.order.userphone}
          </Text>
          </View>
          <Button onPress={this.handleGetDirections}>
            Start tracking
          </Button>
        </View>
      )
    }
  }
  handleGetDirections = () => {
    const data = {
      source: {
        latitude: -33.8356372,
        longitude: 18.6947617
      },
      destination: {
        latitude: -33.8600024,
        longitude: 18.697459
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode 
        }
      ]
    }

    getDirections(data)
  }

  render() {
    const { container, emailText, errorText } = styles;
    const { loading, data, error, coordinates } = this.state;

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


            {data.map((marker, index) => {
              return (<MapView.Marker
                key={index}
                coordinate={this.formatLocation(marker.location.x, marker.location.y)}
                title={marker.state_order}
                description={marker.type}
                onPress={() => { this.fetchOrder(marker.id) }}

              // onPress={}
              />)
            })}


            <MapView.Marker.Animated
              image={require('../../assets/icon.png')}
              coordinate={this.state.mapRegion}
              title="Your Location"
              description="Some description"
            />

            {/* {coordinates !== '' ? coordinates.map((coords, index) => (
              <MapView.Polyline
                key={index}
                index={index}
                coordinates={coords}
                strokeWidth={2}
                strokColor="blue"

              />
            )) : ''} */}



          </MapView>


          <Button onPress={this.props.deleteJWT}>
            Log Out
          </Button>
          <View>
            {this.renderPhone()}
          </View>
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
