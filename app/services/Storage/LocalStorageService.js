import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import * as Keychain from 'react-native-keychain';
import SInfo from 'react-native-sensitive-info';

export const saveSensitiveInfo = async (email, password) => {
  // Store the credentials
  await Keychain.setGenericPassword(email, password);

  // await Keychain.resetGenericPassword();
};

export const getSenstiveInfo = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' +
          JSON.stringify(credentials.username),
      );
      return;
    } else {
      console.log('No credentials stored');
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

export const storeLocalData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error'
    console.log(e);
  }
};

export const storeLocalDataObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return jsonValue;
  } catch (e) {
    // saving error
    console.log(e);
  }
};

export const getLocalData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    // console.log('local data', value);
    if (value !== null) {
      return value;
      // value previously stored
    }
  } catch (e) {
    console.log('error reading value' + e.toString());
    // error reading value
  }
};

export const getLocalDataObject = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    // error reading value
  }
};

export const clearLocalData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

export const updateLocalDataObject = async (
  key,
  storyId,
  isSeen,
  pressedIndex,
  progressIndex,
) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    let localData;
    if (jsonValue !== null) localData = JSON.parse(jsonValue);

    if (localData[pressedIndex]?.stories[progressIndex]?.storyId === storyId) {
      localData[pressedIndex].stories[progressIndex].updatedAt = new Date();
      localData[pressedIndex].stories[progressIndex].isSeen = isSeen;
      localData[pressedIndex].stories[progressIndex].progressIndex =
        progressIndex;
    }

    await AsyncStorage.setItem(key, JSON.stringify(localData));
  } catch (e) {
    console.log(e);
    // error update value
  }
};

export const updateShowInstructions = async (
  key,
  showFoodInstructions,
  showHomeInstructions,
  allowNotifications,
) => {
  try {
    console.log(  showFoodInstructions,
      showHomeInstructions, allowNotifications)
    const jsonValue = await AsyncStorage.getItem(key);
    let localData;
    if (jsonValue !== null) localData = JSON.parse(jsonValue);

    if (showFoodInstructions != null) {
      localData.instructionsFood = showFoodInstructions;
    }

    if (showHomeInstructions != null) {
      localData.instructionsHome = showHomeInstructions;
    }

    if(allowNotifications != null){
      localData.allowNotifications = allowNotifications;
    }

    await AsyncStorage.setItem(key, JSON.stringify(localData));
  } catch (e) {
    console.log(e);
    // error update value
  }
};
