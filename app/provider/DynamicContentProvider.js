import React, {createContext, useReducer, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION, SUB_COLLECTION} from '../constants/Collections';
import {
  dynamicContentFoodInitialState,
  dynamicContentFoodReducer,
  dynamicContentHomeInitialState,
  dynamicContentHomeReducer,
} from '../reducers/DynamicContentReducer';
import {showErrorMessage} from '../utils/FlashMessage';
import Labels from '../constants/Labels';

const DynamicContentContext = createContext();
const DynamicContentProvider = props => {
  const dynamicCollection = firestore().collection(COLLECTION.DYNAMIC_CONTENT);
  const [dynamicFoodState, dispatchDynamicFoodList] = useReducer(
    dynamicContentFoodReducer,
    dynamicContentFoodInitialState,
  );
  const [dynamicHomeState, dispatchDynamicHomeList] = useReducer(
    dynamicContentHomeReducer,
    dynamicContentHomeInitialState,
  );

  const getBannerFood = async () => {
    dispatchDynamicFoodList({type: 'PROCESSING'});
    try {
      dynamicCollection
        .doc('banners')
        .collection(SUB_COLLECTION.FOOD_BANNERS)
        .where('status', '==', 1)
        .onSnapshot(querySnapshot => {
          let bannerFoodArray = [];
          querySnapshot.forEach(snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;
            bannerFoodArray.push(data);
          });

          dispatchDynamicFoodList({
            type: 'SUCCESS',
            payload: {
              bannerFoodList: bannerFoodArray,
            },
          });
          return {data: bannerFoodArray};
        });
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchDynamicFoodList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const getBannerHome = async () => {
    dispatchDynamicHomeList({type: 'PROCESSING'});
    try {
      dynamicCollection
        .doc('banners')
        .collection(SUB_COLLECTION.HOME_BANNERS)
        .where('status', '==', 1)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;

            dispatchDynamicHomeList({
              type: 'SUCCESS',
              payload: {
                bannerHomeList: data,
              },
            });

            return {data: data};
          });
        });
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchDynamicHomeList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const dynamicContext = {
    bannerFoodList: dynamicFoodState.bannerFoodList,
    bannerHomeList: dynamicHomeState.bannerHomeList,
    isLoading: dynamicFoodState.isLoading,
    getBannerFood,
    getBannerHome,
  };
  return (
    <DynamicContentContext.Provider value={dynamicContext}>
      {props.children}
    </DynamicContentContext.Provider>
  );
};

export {DynamicContentProvider, DynamicContentContext};
