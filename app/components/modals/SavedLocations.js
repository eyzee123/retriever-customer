import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, FlatList, Platform} from 'react-native';
import Modal from 'react-native-modal';
import {windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {AddressContext} from '../../provider/AddressProvider';
import {LocationContext} from '../../provider/LocationProvider';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import {
  saveCurrentLocation,
  getCurrentLocation as StorageCurrentLocation,
  getDocID,
  saveDocID,
} from '../../utils/HelperFunctions';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {ROUTES} from '../../constants/Routes';
import {LOCATION} from '../../constants/ProjectConstants';
import {UserContext} from '../../provider/UserProvider';
import {COLLECTION} from '../../constants/Collections';
import {ERROR} from '../../constants/Status';
import {showErrorMessage} from '../../utils/FlashMessage';
import {useIsFocused} from '@react-navigation/native';
import {LoadingOverlay} from '../general/LoadingIndicator';
import SetupDialogue from './SetupDialogue';
import LocationItem from '../listItem/LocationItem';
import RoundedButton from '../cores/RoundedButton';

const SavedLocations = props => {
  const userCtx = useContext(UserContext);
  const addressContext = useContext(AddressContext);
  const locationContext = useContext(LocationContext);
  const isFocused = useIsFocused();

  const [checked, setChecked] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [openModalSetupAcc, setOpenModalSetupAcc] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    props.closeModal();
    if (props.navigateTo) {
      addressContext.setSelectedRoute(props.navigateTo);
    }
    setCollection();
  }, [userCtx.currentUser, isFocused]);

  const setCollection = async () => {
    if (userCtx.isLoggedIn) {
      //if user is registered update address collection
      addressContext
        .setCollection(
          firestore()
            .collection(COLLECTION.USERS)
            .doc(userCtx.currentUser.id)
            .collection('addressList'),
        )
        .then(data => {
          getAddressList(data.collection);
        });
    } else {
      addressContext.clearAddressList();
      getSavedLocation();
    }
  };

  //get firestore address
  const getAddressList = async addressCollection => {
    //saved address doc id
    const primaryAddressDocID = await getDocID();
    if (primaryAddressDocID === undefined) {
      return;
    }
    await addressContext.getAddress(addressCollection).then(data => {
      data.data.map((item, index) => {
        //loop through address list to check for primary address
        if (primaryAddressDocID == item.id) {
          addressContext.setUserPrimaryAddress(item, index, true);
        }
      });
    });
  };

  const getSavedLocation = async () => {
    let location = await StorageCurrentLocation();
    //if local storage is not null
    if (location != null) {
      await addressContext.setUserPrimaryAddress(
        JSON.parse(location),
        0,
        false,
      );
      await getCurrentPosition(false);
    } else {
      //no location saved
      await getCurrentPosition();
    }
  };

  const getCurrentPosition = async (isPrimary = true, isClickFocused) => {
    await Geolocation.getCurrentPosition(
      position => {
        setLoading(true);
        getCurrentLocation(
          position.coords.latitude,
          position.coords.longitude,
          isPrimary,
        );
      },
      error => {
        setLoading(false);
        console.log('getCurrentPosition error', error);
        if (isClickFocused == 'isClickFocused') {
          if (error.code === 1) {
            showErrorMessage(ERROR.ENABLE_GPS);
          } else {
            showErrorMessage(`${error.message} ${ERROR.ENABLE_GPS}`);
          }
        }
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  //Geocoder request
  const getCurrentLocation = async (lat, long, isPrimary = false) => {
    try {
      locationContext.requestLocationPermission().then(async permission => {
        if (permission.response == LOCATION.GRANTED_PERMISSION) {
          //check initial position
          let currentPosition = {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.00321,
          };
          currentPosition.latitude = lat;
          currentPosition.longitude = long;
          //Geocoder request to get formatted address
          await locationContext.getAddress(lat, long).then(address => {
            //create address object
            let addressObject = {
              id: '0',
              addressName: 'Current Location',
              address: address.data.formatted_address,
              isPrimary: true,
              coordinates: currentPosition,
            };
            setAddress(addressObject, isPrimary);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    } catch (e) {
      console.log('error', e);
    }
  };

  //append current location to address list
  const setAddress = async (addressObject, isPrimary = true) => {
    let addressArray = addressContext.addressList;
    const newData = addressArray.slice(0);

    //check if list is not empty
    if (addressArray.length != 0) {
      if (addressArray[0].addressName == 'Current Location') {
        //update current address (index 0)
        newData[0] = addressObject;
      } else {
        //add current location to index 0
        newData.splice(addressArray, 0, addressObject);
      }
    } else {
      //add current location to index 0
      newData.splice(addressArray, 0, addressObject);
    }
    //function to add location
    addressContext.addCurrentLocation(newData);
    saveCurrentLocation(JSON.stringify(addressObject));
    if (isPrimary) {
      addressContext.setUserPrimaryAddress(addressObject, 0, isPrimary);
    }
  };

  const goToEditAddress = item => {
    //requestLocationPermission to prevent users from navigating when location permission is disabled
    locationContext.requestLocationPermission().then(async permission => {
      if (permission.response == LOCATION.GRANTED_PERMISSION) {
        navigation.navigate(ROUTES.EDIT_ADDRESS, {address: item});
      }
    });
  };

  const goToAddress = () => {
    {
      userCtx.isLoggedIn
        ? //requestLocationPermission to prevent users from navigating when location permission is disabled
          locationContext.requestLocationPermission().then(async permission => {
            navigation.navigate('Address');
            // if (permission.response == LOCATION.GRANTED_PERMISSION) {
            //   navigation.navigate('Address');
            // }else{
            //   showErrorMessage(ERROR.ENABLE_GPS);
            // }
          })
        : setOpenModalSetupAcc(true);
    }
  };

  const goToLogin = async () => {
    setOpenModalSetupAcc(false);
    await navigation.navigate(ROUTES.LOGIN);
  };

  const goToRegister = async () => {
    setOpenModalSetupAcc(false);
    await navigation.navigate(ROUTES.REGISTER);
  };

  return (
    <Modal
      isVisible={props.showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      onBackdropPress={props.closeModal}
      coverScreen={false}
      {...props}
      style={[styles(props).contentContainer, props.modalStyle]}>
      <View style={[styles(props).container, props.containerStyle]}>
        <LoadingOverlay visible={loading} textContent={'Fetching Location'} />
        {locationContext.locationPermission == LOCATION.GRANTED_PERMISSION &&
          addressContext.addressList != undefined && (
            <View style={styles(props).addressListContainer}>
              <FlatList
                data={addressContext.addressList.sort(
                  (a, b) => a.createdAt - b.createdAt,
                )}
                renderItem={({item, index}) => (
                  <LocationItem
                    setPrimaryAddress={() =>
                      addressContext.setUserPrimaryAddress(item, index, true)
                    }
                    checked={addressContext.checked}
                    index={index}
                    item={item}
                    goToEditAddress={() => goToEditAddress(item)}
                  />
                )}
                keyExtractor={(item, index) => String(index)}
              />
            </View>
          )}

        <View style={styles(props).locationDetailsContainer}>
          <Icon
            name="plus-thick"
            color={COLORS.orange}
            size={SIZES.iconSize.x_small}
          />
          <Text style={styles(props).txtLocation} onPress={goToAddress}>
            Add new location
          </Text>
        </View>

        <RoundedButton
          icon="map-marker"
          text="Use current location"
          onPress={() => getCurrentPosition(true, 'isClickFocused')}
        />
      </View>
      <SetupDialogue
        title="Ooops! No Account Logged. 🙊"
        body="There currently is no active account on this device. Let’s get you set up with our quick registration system!"
        onConfirmText="Register"
        onConfirmText1="Log in"
        showModal={openModalSetupAcc}
        closeModal={() => setOpenModalSetupAcc(false)}
        onConfirmButton1={goToLogin}
        onConfirmButton={goToRegister}
      />
    </Modal>
  );
};

const styles = props =>
  StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      // top: -windowHeight * 0.022,
    },
    container: {
      padding: SPACING.medium,
      backgroundColor: COLORS.white,
      borderBottomLeftRadius: BORDER.roundedCornerPopupCard,
      borderBottomRightRadius: BORDER.roundedCornerPopupCard,
      width: windowWidth,
    },
    addressListContainer: {
      marginBottom: Platform.OS === 'ios' ? SPACING.large : SPACING.medium,
    },
    locationDetailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.medium,
    },
    txtLocation: {
      flex: 1,
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.darkGreen,
      paddingLeft: SPACING.small,
    },
  });
export default SavedLocations;
