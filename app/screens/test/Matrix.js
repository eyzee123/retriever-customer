import React from 'react';
import {Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {API_KEY} from '../../constants/ProjectConstants';

const Matrix = () => {
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE = 37.3318456;
  const LONGITUDE = -122.0296002;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const origin = {latitude: 37.3318456, longitude: -122.0296002};
  const destination = {latitude: 37.771707, longitude: -122.4053769};

  return (
    <MapViewDirections
      origin={origin}
      destination={destination}
      apikey={API_KEY.GEO_API_KEY}
      onReady={result => {
        console.log(`Distance: ${result.distance} km`);
        console.log(`Duration: ${result.duration} min.`);
      }}
    />
  );
};

export default Matrix;
