import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {COLORS, FONTS, BORDER, SPACING, SIZES} from '../../styles/theme';
import Header from '../../components/headers/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Labels from '../../constants/Labels';
import {API_KEY} from '../../constants/ProjectConstants';
import {LocationContext} from '../../provider/LocationProvider';
import {ROUTES} from '../../constants/Routes';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {IMAGES} from '../../constants/Images';

const Address = ({navigation}) => {
  const locationContext = useContext(LocationContext);

  useEffect(() => {
    locationContext.requestLocationPermission();
    locationContext.setSelectedPositon(locationContext.initialPosition);
  }, []);

  const gotoChooseLocation = () => {
    navigation.navigate('ChooseLocation');
  };

  const onAddressPressed = details => {
    //note position = lat lng, address = formatted value
    //update selected position
    let coordinates = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };
    locationContext.pinMarker(coordinates, false);
    //update selected address
    locationContext.setSelectedAddress(details);
    setTimeout(() => {
      navigation.navigate(ROUTES.ADDRESS_DETAILS);
    }, 1000);
  };

  return (
    <MainScreen>
      <Header
        containerStyle={styles.containerStyle}
        backPressContainer={styles.backPressContainer}
      />
      <View style={styles.autoCompleteContainer}>
        <GooglePlacesAutocomplete
          placeholder={Labels.searchLocation}
          currentLocation={false}
          debounce={2000}
          fetchDetails={true}
          textInputProps={styles.textInputProps}
          renderHeaderComponent={item => {
            return <Text style={styles.searchResultHeader}>Suggested</Text>;
          }}
          renderRow={(data, index) => {
            return (
              <View style={styles.searchResultContainer}>
                <Icon
                  name="map-marker"
                  color={COLORS.orange}
                  size={SIZES.iconSize.small}
                />
                <Text style={styles.searchResult}>{data.description}</Text>
              </View>
            );
          }}
          renderLeftButton={() => (
            <View style={styles.iconSearch}>
              <Icon
                name="magnify"
                size={SIZES.iconSize.medium}
                color={COLORS.white}
              />
            </View>
          )}
          onPress={(data, details = null) => {
            onAddressPressed(details);
          }}
          onFail={error => console.error(error)}
          styles={styles.autoCompleteStyles}
          query={{
            key: API_KEY.GEO_API_KEY,
            language: 'en',
          }}
        />
      </View>
      <MainFrame>
        <View style={styles.contentStyle}>
          <Image
            source={IMAGES.EMPTY_ADDRESS}
            style={{height: windowHeight * 0.25, width: windowHeight * 0.3}}
          />
          <Text style={styles.txtTitle}>Got your specific address?</Text>
          <Text style={styles.txtSub}>
            You can quickly search and save your
          </Text>
          <Text style={styles.txtSub}>address through here.</Text>
        </View>
      </MainFrame>
      <TouchableOpacity style={styles.footerStyle} onPress={gotoChooseLocation}>
        <Icon
          name="map-marker"
          color={COLORS.orange}
          size={SIZES.iconSize.medium}
        />
        <Text style={styles.txtChooseMap}>Pin from Map</Text>
      </TouchableOpacity>
    </MainScreen>
  );
};
const styles = StyleSheet.create({
  containerStyle: {
    height: windowHeight * 0.1,
  },
  backPressContainer: {
    marginTop: windowHeight * 0.01,
  },
  autoCompleteContainer: {
    position: 'absolute',
    width: '81%',
    right: SPACING.medium,
  },
  textInputProps: {
    placeholderTextColor: COLORS.white,
  },
  searchResultHeader: {
    ...FONTS.bold,
    fontSize: SIZES._18px,
    color: COLORS.darkGreen,
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
  },
  searchResultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResult: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginLeft: SPACING.x_small,
    marginTop: -windowWidth * 0.006,
  },
  iconSearch: {
    paddingTop: windowHeight * 0.012,
    paddingLeft: SPACING.small,
    backgroundColor: COLORS.whiteFB2,
    height: windowHeight * 0.056,
    borderTopLeftRadius: BORDER.roundedCornerBox,
    borderBottomLeftRadius: BORDER.roundedCornerBox,
  },
  autoCompleteStyles: {
    container: {
      marginTop: SPACING.medium,
    },
    textInput: {
      ...FONTS.regular,
      color: COLORS.white,
      backgroundColor: COLORS.whiteFB2,
      borderWidth: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: BORDER.roundedCornerBox,
      borderBottomRightRadius: BORDER.roundedCornerBox,
      paddingRight: SPACING.medium,
    },
    description: {
      ...FONTS.regular,
    },
    row: {
      // borderRadius: 6,
    },
  },
  contentStyle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  txtTitle: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
  },
  txtSub: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  footerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    elevation: 20,
  },
  txtChooseMap: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginLeft: SPACING.x_small,
  },
});
export default Address;
