import React, { Component } from 'react';
import { View, Text } from 'react-native';

class CurrentLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      // location: { coords: { latitude: null, longitude: null } },
      error: null,
    };
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
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

  render() {
    return (
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MapView
            MapView
            style={{ alignSelf: 'stretch', height: '80%' }}
            provider="google"
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            onRegionChange={this.props._handleMapRegionChange}
          >

   {this.props.data.map((marker, index) => {
              <MapView.Marker
                key={index}
                coordinate={this.state.orderLocation.coords}
                title={marker.type}
                description="Some description"
              /> 
            })}
              <MapView.Marker
                coordinate={this.state.location.coords}
                title="Your Location"
                description="Some description"
              />
        
          </MapView>

        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
}

export default CurrentLocation;