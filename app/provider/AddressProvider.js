import React, {createContext, useContext, useReducer, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  addressInitialState,
  addressReducer,
  getAddressReducer,
  getAddressInitialState,
} from '../reducers/AddressReducer';
import {showSuccessMessage, showErrorMessage} from '../utils/FlashMessage';
import Labels from '../constants/Labels';
import {getCurrentLocation, saveDocID} from '../utils/HelperFunctions';
import {ROUTES} from '../constants/Routes';
import {LocationContext} from './LocationProvider';

const AddressContext = createContext();

const AddressProvider = props => {
  const locationContext = useContext(LocationContext);

  const [route, setSelectedRoute] = useState(ROUTES.HOME);
  const [addressCollection, setSelectedCollection] = useState(null);
  const [checked, setChecked] = useState('');

  const [addressState, dispatchAddress] = useReducer(
    addressReducer,
    addressInitialState,
  );
  const [getAddressState, dispatchGetAddress] = useReducer(
    getAddressReducer,
    getAddressInitialState,
  );
  const [primaryAddress, setPrimaryAddress] = useState({
    addressName: '',
    address: '',
  });

  const addAddress = async address => {
    dispatchAddress({type: 'ADDRESS_PROCESSING'});
    address.createdAt = firestore.FieldValue.serverTimestamp();
    address.isPrimary = false;
    try {
      //save to addressList collection based on device id
      await addressCollection.add(address).then(() => {
        dispatchAddress({
          type: 'ADDRESS_SUCCESS',
          payload: {
            address: address,
          },
        });
        showSuccessMessage(Labels.addressAdded);
      });
      return {success: true};
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchAddress({
        type: 'ADDRESS_FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {success: false};
    }
  };

  const getAddress = async collection => {
    dispatchGetAddress({type: 'GET_ADDRESS_PROCESSING'});
    //get current location in react async storage
    let location = await getCurrentLocation();

    try {
      //get addressList collection based on device id
      let addressArray = [];

      await collection.get().then(querySnapshot => {
        querySnapshot.forEach(
          async snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;
            addressArray.push(data);
            // console.log('GET ADDRESS ' +JSON.stringify(data))
          },
          error => {
            console.log(error);
          },
        );
        //if current location is not null, add to address array
        if (location != null) {
          let addressData = addressArray;
          const newData = addressData.slice(0);
          newData.splice(addressArray, 0, JSON.parse(location));
          addressArray = newData;
        }
        dispatchGetAddress({
          type: 'GET_ADDRESS_SUCCESS',
          payload: {
            addressList: addressArray,
          },
        });
      });
      return {data: addressArray};
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchGetAddress({
        type: 'GET_ADDRESS_FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const addCurrentLocation = async addressArray => {
    dispatchGetAddress({
      type: 'GET_ADDRESS_SUCCESS',
      payload: {
        addressList: addressArray,
      },
    });
  };

  const clearAddressList = async () => {
    dispatchGetAddress({
      type: 'CLEAR_ADDRESS',
    });
    return {success: true};
  };

  const updateAddress = async (updatedAddress, id) => {
    dispatchAddress({type: 'ADDRESS_PROCESSING'});

    updatedAddress.updatedAt = firestore.FieldValue.serverTimestamp();
    updatedAddress.isPrimary = false;

    try {
      //update firestore address
      await addressCollection
        .doc(id)
        .set(updatedAddress)
        .then(
          () => {
            dispatchAddress({
              type: 'ADDRESS_SUCCESS',
              payload: {
                address: updatedAddress,
              },
            });
            showSuccessMessage(Labels.addressUpdated);
          },
          {merge: false},
        );
      return {success: true};
    } catch (error) {
      showErrorMessage(Labels.genericError);

      console.log('error ' + error);
      dispatchAddress({
        type: 'ADDRESS_FAILED',
        payload: {
          errorMessage: error.message,
        },
      });

      return {success: false};
    }
  };

  const deleteAddress = async id => {
    dispatchAddress({type: 'ADDRESS_PROCESSING'});

    try {
      //delete firestore address
      await addressCollection
        .doc(id)
        .delete()
        .then(() => {
          showSuccessMessage(Labels.addressDeleted);
        });
      dispatchAddress({
        type: 'ADDRESS_SUCCESS',
        payload: {
          address: '',
        },
      });
      return {success: true};
    } catch (error) {
      showErrorMessage(Labels.genericError);

      console.log('error ' + error);

      dispatchAddress({
        type: 'ADDRESS_FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {success: false};
    }
  };

  const setCollection = async collection => {
    setSelectedCollection(collection);
    return {collection: collection};
  };

  //set the primary address in header
  const setUserPrimaryAddress = async (item, index, setAsPrimary = false) => {
    //set coordinates to pin in map
    locationContext.setSelectedPositon(item.coordinates);
    //checked address to show in ui
    setChecked(index);
    //header address saved in context for global fetching
    setPrimaryAddress(item);
    //save address doc id to compare primary address
    if (setAsPrimary) {
      saveDocID(item.id);
    }
    //on change primary address change move to coordinates
    try {
      locationContext.mapView.current.animateToRegion(item.coordinates);
    } catch (e) {
      console.log('animate error', e);
    }
  };

  const addressContext = {
    addressCollection,
    isLoading: addressState.isLoading,
    addressIsLoading: getAddressState.loadingAddress,
    address: addressState.address,
    addressList: getAddressState.addressList,
    primaryAddress,
    route,
    checked,
    setSelectedRoute,
    setCollection,
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    addCurrentLocation,
    setPrimaryAddress,
    clearAddressList,
    setUserPrimaryAddress,
    setChecked,
  };

  return (
    <AddressContext.Provider value={addressContext}>
      {props.children}
    </AddressContext.Provider>
  );
};

export {AddressProvider, AddressContext};
