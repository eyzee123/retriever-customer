import React, {useContext, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Marker} from 'react-native-maps';

import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import Header from '../../components/headers/Header';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {LocationContext} from '../../provider/LocationProvider';
import Labels from '../../constants/Labels';
import {ROUTES} from '../../constants/Routes';
import {IMAGES} from '../../constants/Images';

const ChooseLocation = ({navigation}) => {
  const mapView = useRef(null);
  const locationContext = useContext(LocationContext);

  const goToAddressDetails = () => {
    navigation.navigate(ROUTES.ADDRESS_DETAILS);
  };

  useEffect(() => {
    locationContext.requestLocationPermission();
    //get formatted address
    locationContext.getAddress(
      locationContext.initialPosition.latitude,
      locationContext.initialPosition.longitude,
    );
  }, []);

  const handleBoundsChanged = e => {
    console.log(e);
    locationContext.pinMarker(e);
  };

  return (
    <MainScreen>
      <Header title={Labels.chooseLocation} />
      <MainFrame fullscreen>
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE}
          initialRegion={locationContext.initialPosition}
          onRegionChangeComplete={e => handleBoundsChanged(e)}
          style={styles.map}
        />
        <View style={styles.centerMarker}>
          <Image
            resizeMode="stretch"
            source={IMAGES.MAP_MARKER1}
            style={styles.mapMarker}
          />
        </View>
      </MainFrame>
      <View style={styles.footerStyle}>
        <View style={styles.locationContainer}>
          <Icon
            name="map-marker"
            color={COLORS.orange}
            size={SIZES.iconSize.small}
          />
          <View style={styles.locationWrapper}>
            <Text style={styles.txtHeadAddress}>
              {locationContext.address.formatted_address}
            </Text>
          </View>
        </View>
        <RoundedButton text="Confirm" onPress={goToAddressDetails} />
      </View>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  footerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER.roundedCornerPopupCard,
    borderTopRightRadius: BORDER.roundedCornerPopupCard,
    elevation: 20,
  },
  map: {
    height: windowHeight,
    width: windowWidth,
  },
  centerMarker: {
    left: '45.5%',
    position: 'absolute',
    top: '66.4%',
  },
  mapMarker: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.045,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.subTextColor,
    borderRadius: BORDER.roundedCornerPopupCard,
    marginVertical: SPACING.x_small,
  },
  locationWrapper: {
    flex: 1,
    paddingLeft: SPACING.small,
  },
  txtHeadAddress: {
    ...FONTS.bold,
    fontSize: SIZES._14px,
    color: COLORS.darkGreen,
  },
  txtSubAddress: {
    ...FONTS.regular,
    flexWrap: 'nowrap',
    fontSize: SIZES._12px,
    color: COLORS.tertiary,
  },
});

export default ChooseLocation;
