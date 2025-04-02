import React, {createContext, useRef, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import {ERROR} from '../constants/Status';
import {showErrorMessage} from '../utils/FlashMessage';
import {LOCATION} from '../constants/ProjectConstants';

const LocationContext = createContext();

const DeviceLocationProvider = props => {
  const [initialPosition, setinitialPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedPosition, setSelectedPositon] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [address, setSelectedAddress] = useState('');

  const [zoom, setZoom] = useState({
    latitudeDelta: 0.0022,
    longitudeDelta: 0.00321,
  });

  const [locationPermission, setLocationPermission] = useState(null);
  const mapView = useRef(null);

  const requestLocationPermission = async () => {
    var response;
    if (Platform.OS === 'ios') {
      response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    if (response === LOCATION.GRANTED_PERMISSION) {
      getCurrentPosition();
    } else {
      setinitialPosition({
        latitude: 0,
        longitude: 0,
        ...zoom,
      });
      // showErrorMessage(ERROR.ENABLE_LOCATION_PERMISSION);
    }

    setLocationPermission(response);
    return {response: response};
  };

  const getCurrentPosition = async () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        setinitialPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ...zoom,
        });
        setSelectedPositon({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ...zoom,
        });
        setIsLoading(false);
      },
      error => {
        console.log(error);
        if (error.code === 1) {
          setinitialPosition({
            latitude: 0,
            longitude: 0,
            ...zoom,
          });
          setSelectedPositon({
            latitude: 0,
            longitude: 0,
            ...zoom,
          });
          // showErrorMessage(ERROR.ENABLE_GPS);
        } else {
          setinitialPosition({
            latitude: 0,
            longitude: 0,
            ...zoom,
          });
          setSelectedPositon({
            latitude: 0,
            longitude: 0,
            ...zoom,
          });
          // showErrorMessage(`${error.message} ${ERROR.ENABLE_GPS}`);
        }
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000},
    );
  };

  const pinMarker = (coordinate, isGetAddress = true) => {
    coordinate.latitudeDelta = selectedPosition.latitudeDelta;
    coordinate.longitudeDelta = selectedPosition.longitudeDelta;
    setSelectedPositon(coordinate);
    if (isGetAddress) {
      getAddress(coordinate.latitude, coordinate.longitude);
    }
  };

  const getAddress = async (latitude, longitude) => {
    let address = {formatted_address: ''};
    await Geocoder.from(latitude, longitude)
      .then(json => {
        setSelectedAddress(json.results[0]);
        address = json.results[0];
      })
      .catch(error => {
        console.warn(error);
      });

    return {data: address};
  };

  const locationContext = {
    selectedPosition,
    isLoading,
    initialPosition,
    address,
    mapView,
    requestLocationPermission,
    getCurrentPosition,
    pinMarker,
    setSelectedPositon,
    getAddress,
    setSelectedAddress,
    locationPermission,
    setLocationPermission,
  };

  return (
    <LocationContext.Provider value={locationContext}>
      {props.children}
    </LocationContext.Provider>
  );
};

export {DeviceLocationProvider, LocationContext};
