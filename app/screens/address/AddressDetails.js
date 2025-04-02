import React, {useContext, useCallback, useRef, useMemo} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import Header from '../../components/headers/Header';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import RoundedInput from '../../components/cores/RoundedInput';
import RoundedButton from '../../components/cores/RoundedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {LocationContext} from '../../provider/LocationProvider';
import {AddressContext} from '../../provider/AddressProvider';
import useInput from '../../hooks/useInput';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import Labels from '../../constants/Labels';
import {IMAGES} from '../../constants/Images';
import {showErrorMessage} from '../../utils/FlashMessage';
import {ERROR} from '../../constants/Status';
import {LOCATION} from '../../constants/ProjectConstants';
import {PERMISSIONS, request} from 'react-native-permissions';

const AddressDetails = ({navigation}) => {
  const mapView = useRef(null);
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['5%', '92%'], []);
  const formIsValid = addressNameIsValid && addressIsValid;
  const locationContext = useContext(LocationContext);
  const addressContext = useContext(AddressContext);

  const {
    value: addressName,
    isValid: addressNameIsValid,
    hasError: addressNameHasError,
    valueInputChangeHandler: addressNameChandedHandler,
    valueInputBlurHandler: addressNameBlurHandler,
    setHasError: setAddressNameError,
  } = useInput(value => value.trim() !== '');

  const {
    value: address,
    isValid: addressIsValid,
    hasError: addressHasError,
    valueInputChangeHandler: addressChangedHandler,
    valueInputBlurHandler: addressBlurHandler,
    setHasError: setAddressError,
  } = useInput(value => value.trim() !== '');

  const {
    value: note,
    isValid: noteIsValid,
    hasError: noteHasError,
    valueInputChangeHandler: noteChandedHandler,
    valueInputBlurHandler: noteBlurHandler,
    reset: resetNote,
  } = useInput(value => value.trim() !== '');

  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const requestLocationPermission = async () => {
    var response;
    if (Platform.OS === 'ios') {
      response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    return {response: response};
  };

  const handleSubmit = async () => {
    if (address == '' || addressName == '') {
      setAddressNameError(true);
      setAddressError(true);
      return;
    }

    const response = await requestLocationPermission();

    if (response.response != LOCATION.GRANTED_PERMISSION) {
      showErrorMessage(ERROR.ENABLE_GPS);
      return;
    }
    //save address in firestore
    saveAddress();
  };

  const saveAddress = async () => {
    const newAddress = {
      addressName: addressName,
      addressDetails: address,
      note: note,
      address: locationContext.address.formatted_address,
      coordinates: locationContext.selectedPosition,
    };
    //save to address to firestore
    addressContext.addAddress(newAddress).then(() => {
      navigation.navigate(addressContext.route, {toast: false});
    });
  };

  const handleBoundsChanged = e => {
    console.log(e);
    locationContext.pinMarker(e);
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        pressBehavior={0}
      />
    ),
    [],
  );

  return (
    <MainScreen>
      <Header title="Add to Saved Location" />
      <MainFrame fullscreen>
        <MapView
          ref={mapView}
          initialRegion={locationContext.selectedPosition}
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
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        backdropComponent={renderBackdrop}
        animateOnMount={true}
        enableHandlePanningGesture={true}
        onChange={handleSheetChange}
        snapPoints={snapPoints}
        handleStyle={{height: windowHeight * 0.05}}>
        <BottomSheetView style={styles.bsContainer}>
          <View style={styles.sectionContainer}>
            <LoadingOverlay visible={addressContext.isLoading} />
            <Text style={GlobalStyle.sectionLabel}>Name</Text>
            <RoundedInput
              value={addressName}
              onBlur={addressNameBlurHandler}
              onChangeText={addressNameChandedHandler}
              placeholder="e.g Gym, School"
              validateError={{
                hasError: addressNameHasError,
                errorText: 'This field is required',
              }}
            />
            <Text style={GlobalStyle.sectionSubLabel}>
              For easy reference, label your location
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={GlobalStyle.sectionLabel}>Address</Text>
            <View style={styles.locationContainer}>
              <Icon
                name="map-marker"
                color={COLORS.orange}
                size={SIZES.iconSize.small}
                style={{marginLeft: SPACING.x_small}}
              />
              <RoundedInput
                multiline={true}
                numberOfLines={2}
                placeholder="Address"
                value={locationContext.address.formatted_address}
                inputStyle={styles.inputStyle}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={GlobalStyle.sectionLabel}>Address details</Text>
            <RoundedInput
              value={address}
              onBlur={addressBlurHandler}
              onChangeText={addressChangedHandler}
              placeholder="e.g Floor, unit number"
              validateError={{
                hasError: addressHasError,
                errorText: 'This field is required',
              }}
            />
            <Text style={GlobalStyle.sectionSubLabel}>
              Enter other details of your address
            </Text>
          </View>
          <View
            style={[
              styles.sectionContainer,
              {marginBottom: windowHeight * 0.01},
            ]}>
            <Text style={GlobalStyle.sectionLabel}>Address note</Text>
            <RoundedInput
              value={note}
              onBlur={noteBlurHandler}
              onChangeText={noteChandedHandler}
              placeholder="e.g Meet me at our spot"
            />
            <Text
              style={[
                GlobalStyle.sectionSubLabel,
                {
                  marginBottom: SPACING.x_large,
                },
              ]}>
              Add further instructions or directions here
            </Text>
            <RoundedButton
              text={Labels.saveLocation}
              disables={!formIsValid}
              onPress={handleSubmit}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  map: {
    alignSelf: 'center',
    height: windowHeight,
    width: windowWidth,
  },
  centerMarker: {
    left: '45.5%',
    position: 'absolute',
    top: '50%',
  },
  mapMarker: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.045,
  },
  bsContainer: {
    flex: 1,
    // paddingBottom: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.white,
  },
  sectionContainer: {
    paddingBottom: SPACING.small,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: SPACING.x_small,
    borderWidth: 1,
    borderColor: COLORS.iconSearchColor,
    borderRadius: BORDER.roundedCornerPopupCard,
    marginVertical: SPACING.x_small,
  },
  inputStyle: {
    ...FONTS.bold,
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    marginVertical: 0,
    paddingHorizontal: SPACING.small,
  },
  locationWrapper: {
    flex: 1,
    paddingLeft: SPACING.small,
  },
  txtHeadAddress: {
    ...FONTS.bold,
    fontSize: SIZES.x_small,
    color: COLORS.darkGreen,
  },
  txtSubAddress: {
    ...FONTS.regular,
    flexWrap: 'nowrap',
    fontSize: SIZES.x_small,
    color: COLORS.tertiary,
  },
});

export default AddressDetails;
