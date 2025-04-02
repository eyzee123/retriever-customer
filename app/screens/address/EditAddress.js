import React, {
  useContext,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import {StackActions} from '@react-navigation/native';
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
import {LocationContext} from '../../provider/LocationProvider';
import {AddressContext} from '../../provider/AddressProvider';
import Labels from '../../constants/Labels';
import useInput from '../../hooks/useInput';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import {IMAGES} from '../../constants/Images';
import {getCurrentLocation as StorageCurrentLocation} from '../../utils/HelperFunctions';

const EditAddress = ({route, navigation}) => {
  const mapView = useRef(null);
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['5%', '92%'], []);
  const locationContext = useContext(LocationContext);
  const addressContext = useContext(AddressContext);
  //passed parameter
  const {address} = route.params;

  const {
    value: addressName,
    hasError: addressNameHasError,
    valueInputChangeHandler: addressNameChandedHandler,
    valueInputBlurHandler: addressNameBlurHandler,
    setHasError: setAddressNameError,
  } = useInput(value => value.trim() !== '');

  const {
    value: currentAddress,
    hasError: addressHasError,
    valueInputChangeHandler: addressChangedHandler,
    valueInputBlurHandler: addressBlurHandler,
    setHasError: setAddressError,
  } = useInput(value => value.trim() !== '');

  const {
    value: note,
    valueInputChangeHandler: noteChandedHandler,
    valueInputBlurHandler: noteBlurHandler,
    reset: resetNote,
  } = useInput(value => value.trim() !== '');

  // callbacks
  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    locationContext.getAddress(
      address.coordinates.latitude,
      address.coordinates.longitude,
    );
    locationContext.setSelectedPositon(address.coordinates);

    //initialize text field values
    addressNameChandedHandler(address.addressName);
    addressChangedHandler(address.addressDetails);
    noteChandedHandler(address.note);
  }, []);

  const handleSubmit = () => {
    if (currentAddress == '' && addressName == '') {
      setAddressNameError(true);
      setAddressError(true);

      return;
    }
    //update address in firestore
    updateAddress();
  };

  const updateAddress = async () => {
    const newAddress = {
      addressName: addressName,
      addressDetails: currentAddress,
      note: note,
      address: locationContext.address.formatted_address,
      coordinates: locationContext.selectedPosition,
    };
    addressContext.updateAddress(newAddress, address.id).then(() => {
      const popAction = StackActions.pop();
      navigation.dispatch(popAction);
    });
  };

  //delete address in firestore
  const deleteAddress = async () => {
    let location = await StorageCurrentLocation();
    addressContext.deleteAddress(address.id).then(() => {
      const popAction = StackActions.pop();
      navigation.dispatch(popAction);

      addressContext.setUserPrimaryAddress(JSON.parse(location), 0, false);
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
      <Header title="Edit Saved Location" />
      <MainFrame fullscreen>
        <MapView
          ref={mapView}
          initialRegion={address.coordinates}
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
        animateOnMount={true}
        enableHandlePanningGesture={true}
        onChange={handleSheetChange}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
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
          </View>
          <View style={styles.sectionContainer}>
            <Text style={GlobalStyle.sectionLabel}>Address</Text>
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
          </View>
          <View style={styles.sectionContainer}>
            <Text style={GlobalStyle.sectionLabel}>Address details</Text>
            <RoundedInput
              value={currentAddress}
              onBlur={addressBlurHandler}
              onChangeText={addressChangedHandler}
              placeholder="e.g Floor, unit number"
              validateError={{
                hasError: addressHasError,
                errorText: 'This field is required',
              }}
            />
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
            <View style={styles.btnContainer}>
              <View style={styles.btnWrapper}>
                <RoundedButton
                  text={Labels.delete}
                  onPress={deleteAddress}
                  btnStyle={styles.btnDelete}
                  btnText={{color: COLORS.subTextColor1}}
                />
              </View>
              <View style={{width: '50%'}}>
                <RoundedButton
                  text={Labels.saveAddress}
                  onPress={handleSubmit}
                  btnStyle={styles.btnSave}
                />
              </View>
            </View>
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
    left: '45.6%',
    position: 'absolute',
    top: '50%',
  },
  mapMarker: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.045,
  },
  bsContainer: {
    flex: 1,
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
    padding: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.inputBorderColor,
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
  btnContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.small,
    marginTop: SPACING.x_large,
  },
  btnWrapper: {
    width: '50%',
    paddingRight: SPACING.x_small,
  },
  btnDelete: {
    backgroundColor: COLORS.subTextColor,
    borderRadius: BORDER.roundedCornerInput,
  },
  btnSave: {
    borderRadius: BORDER.roundedCornerInput,
  },
});

export default EditAddress;
