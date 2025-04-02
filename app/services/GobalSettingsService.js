import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from '../constants/Collections';
import {RoundOffDecimal} from '../utils/HelperFunctions';

export const calculateDeliveryFee = async distance => {
  const fee = await firestore()
    .collection(COLLECTION.SETTINGS)
    .doc('deliveryFee')
    .get();

  const deliveryRate = await fee.data().base;
  const succedingRate = await fee.data().succedingRate;
  const distanceFree = await fee.data().distanceFree;

  const roundedOffDistance = RoundOffDecimal(distance, 1);
  let deliveryFee = deliveryRate;

  if (roundedOffDistance > distanceFree) {
    deliveryFee = (+roundedOffDistance - +distanceFree) * +succedingRate;
  }
  return deliveryFee;
};
