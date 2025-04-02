import uuid from 'react-native-uuid';
import {
  storeLocalData,
  getLocalData,
} from '../services/Storage/LocalStorageService';
import moment from 'moment';
import {firebase} from '@react-native-firebase/firestore';

import {LOCATION, LOCAL_STORAGE} from '../constants/ProjectConstants';
import {getPreciseDistance, convertDistance} from 'geolib';

export const isObjEmpty = obj => {
  return Object.keys(obj).length === 0;
};
export const formatDate = toFormat => {
  let date = toFormat;
  try {
    date = moment(date.toDate().toUTCString()).format('MMM DD, YYYY hh:mm A');
    return date;
  } catch (e) {
    console.log(e);
    date = new Date();
    date = moment(date.toUTCString()).format('MMM DD, YYYY hh:mm A');
    return date.toString();
  }
};

export const addTime = (startTime, minutes) => {
  var time = moment(startTime, 'MMM DD, YYYY hh:mm A')
    .add(minutes, 'minutes')
    .format('MMM DD, YYYY hh:mm A');
  return time;
};

export const formatTimeRange = timeRange => {
  const [startTime, endTime] = timeRange.split('-');
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const formattedStartTime = formatTimeFromDate(
    new Date().setHours(startHour, startMinute),
  );
  const formattedEndTime = formatTimeFromDate(
    new Date().setHours(endHour, endMinute),
  );

  return `${formattedStartTime} - ${formattedEndTime}`;
};

export const formatTimeFromDate = date => {
  const hours = new Date(date).getHours() % 12 || 12;
  const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
  const amOrPm = new Date(date).getHours() < 12 ? 'AM' : 'PM';
  return `${hours}:${minutes} ${amOrPm}`;
};

export const convertToFirestoreTimestamp = date => {
  return new firebase.firestore.Timestamp(date.seconds, date.nanoseconds);
};

export const getHoursDifference2Dates = (date2, date1) => {
  dt1 = new Date(date1);
  dt2 = new Date(date2);

  const diffInMilliseconds = Math.abs(dt2 - dt1); // absolute value in case dates are in different order
  const diffInHours = Math.floor(diffInMilliseconds / 3600000);

  return diffInHours;
};

//get precise distance between coordinates 1 and coordinates 2
export const getSpecificDistance = (start, end) => {
  const distance = getPreciseDistance(start, end);

  return convertToKm(distance);
};

//convert distance to km
export const convertToKm = distance => {
  const convertToKm = parseFloat(convertDistance(distance, 'km').toFixed(2));

  return convertToKm;
};

//format thousands with commas
export const formatThousands = num => {
  const n = String(num),
    p = n.indexOf('.');
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
    p < 0 || i < p ? `${m},` : m,
  );
};

export const getOrCreateDeviceId = async () => {
  let deviceId = await getLocalData(LOCAL_STORAGE.DEVICE_ID);
  if (!deviceId) {
    // unique device ID for the whole app life
    deviceId = Platform.OS + '-' + uuid.v4() + '-' + Date.now();
    await storeLocalData(LOCAL_STORAGE.DEVICE_ID, deviceId);
  }
  console.log('device id: ' + deviceId);
  return deviceId;
};

export const getCurrentLocation = async () => {
  let data = await getLocalData(LOCATION.CURRENT_LOCATION);
  // console.log('data',data)
  return data;
};

export const saveCurrentLocation = async currentLocation => {
  await storeLocalData(LOCATION.CURRENT_LOCATION, currentLocation);
  return currentLocation;
};

export const getDocID = async () => {
  try {
    let data = await getLocalData(LOCAL_STORAGE.PRIMARY_ADDRESS_ID);
    return data;
  } catch (error) {
    return;
  }
};

export const saveDocID = async docID => {
  await storeLocalData(LOCAL_STORAGE.PRIMARY_ADDRESS_ID, docID);
  return docID;
};

export const omit = (obj, ...props) => {
  const result = {...obj};
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
};

export const RoundOffDecimal = (number, decimals) => {
  return Math.round(number * decimals) / decimals;
};

export const formatDecimals = (number, decimals) => {
  return number.toFixed(decimals);
};

///https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
export const isArrayEqual = (value, other) => {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen =
    type === '[object Array]' ? value.length : Object.keys(value).length;
  var otherLen =
    type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  const compare = (item1, item2) => {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isArrayEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};
