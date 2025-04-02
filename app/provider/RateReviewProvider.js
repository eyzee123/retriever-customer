import {UserContext} from './UserProvider';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION, SUB_COLLECTION} from '../constants/Collections';
import {createContext, useReducer} from 'react';
import {ratingInitialState, ratingReducer} from '../reducers/RateReviewReducer';
import {RoundOffDecimal, formatDecimals} from '../utils/HelperFunctions';

const RateReviewContext = createContext();

const RateReviewProvider = props => {
  const [ratingState, dispatchRating] = useReducer(
    ratingReducer,
    ratingInitialState,
  );

  const storesCollection = firestore().collection(COLLECTION.STORES);
  const currentDateTime = firestore.FieldValue.serverTimestamp();
  let response;

  const postRateReview = async data => {
    const ratingCollection = storesCollection
      .doc(data.storeId)
      .collection(SUB_COLLECTION.RATINGS);

    try {
      await ratingCollection.add({
        user: data.user,
        rating: data.rating,
        review: data.review,
        updateAt: currentDateTime,
        createdAt: currentDateTime,
      });
      response = {
        success: true,
      };
    } catch (error) {
      response = {
        success: false,
        errorMessage: error,
      };
    }
    return {
      result: response,
    };
  };

  const getRateReview = async storeId => {
    const ratingCollection = storesCollection
      .doc(storeId)
      .collection(SUB_COLLECTION.RATINGS);

    dispatchRating({type: 'PROCESSING'});

    const response = await ratingCollection.get();

    let arrRatings = [];
    let rating = 0;
    let avgRating = 0;

    if (!response.empty) {
      response.forEach(res => {
        const result = res.data();
        arrRatings.push(result);
        rating = rating + result.rating;
      });

      avgRating = rating / response.size;
    }

    const ratingsObj = {
      ratings: arrRatings,
      averageRatings:
        avgRating % 1 != 0
          ? formatDecimals(avgRating, 1)
          : RoundOffDecimal(avgRating, 1),
      totalRatingsCount: response.size,
    };

    dispatchRating({
      type: 'GET_RATINGS',
      payload: ratingsObj,
    });

    return {
      result: ratingsObj,
    };
  };

  const rateReviewContext = {
    addRating: postRateReview,
    getRatings: getRateReview,
    storeRating: {
      ratings: ratingState.ratings,
      averageRatings: ratingState.averageRatings,
      totalRatingsCount: ratingState.totalRatingsCount,
    },
    isLoading: ratingState.isLoading,
  };

  return (
    <RateReviewContext.Provider value={rateReviewContext}>
      {props.children}
    </RateReviewContext.Provider>
  );
};
export {RateReviewProvider, RateReviewContext};
