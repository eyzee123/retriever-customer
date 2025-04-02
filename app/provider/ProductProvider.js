import React, {createContext, useReducer, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

import {
  addonsReducer,
  addonsInitialState,
  variantReducer,
  variantInitialState,
  ingredientsReducer,
  ingredientsInitialState,
} from '../reducers/ProductReducer';
import {COLLECTION} from '../constants/Collections';

const ProductContext = createContext();

const ProductProvider = props => {
  const storeCollection = firestore().collection(COLLECTION.STORES);

  const [addonsState, dispatchAddonsList] = useReducer(
    addonsReducer,
    addonsInitialState,
  );
  const [variantState, dispatchVariantList] = useReducer(
    variantReducer,
    variantInitialState,
  );
  const [ingridientsState, distpachIngredientsList] = useReducer(
    ingredientsReducer,
    ingredientsInitialState,
  );
  const [variantType, setVariantType] = useState([]);

  const getProductAddOns = async (storeID, productID) => {
    dispatchAddonsList({type: 'PROCESSING'});
    try {
      let addOnsArray = [];
      await storeCollection
        .doc(storeID)
        .collection('products')
        .doc(productID)
        .collection('addons')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;
            addOnsArray.push(data);
          });

          dispatchAddonsList({
            type: 'SUCCESS',
            payload: {
              addonsList: addOnsArray,
            },
          });
        });
      return {data: addOnsArray};
    } catch (error) {
      console.log('error ' + error);
      dispatchAddonsList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const getProductVariant = async (storeID, productID) => {
    dispatchVariantList({type: 'PROCESSING'});
    try {
      let variantArray = [];
      await storeCollection
        .doc(storeID)
        .collection('products')
        .doc(productID)
        .collection('variants')
        .orderBy('price', 'asc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;
            variantArray.push(data);
          });
          let uniqueTags = [];
          variantArray.map(variant => {
            if (uniqueTags.indexOf(variant.title) === -1) {
              uniqueTags.push(variant.title);
            }
          });
          setVariantType(uniqueTags);

          dispatchVariantList({
            type: 'SUCCESS',
            payload: {
              variantList: variantArray,
            },
          });
        });

      return {data: variantArray};
    } catch (error) {
      console.log('error ' + error);
      dispatchVariantList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const getIngredients = async (storeID, productID) => {
    distpachIngredientsList({type: 'PROCESSING'});
    try {
      let ingredientsArray = [];
      await storeCollection
        .doc(storeID)
        .collection('products')
        .doc(productID)
        .collection('warnings')
        .orderBy('name', 'asc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;
            ingredientsArray.push(data);
          });

          distpachIngredientsList({
            type: 'SUCCESS',
            payload: {
              ingredientsList: ingredientsArray,
            },
          });
        });
      return {data: ingredientsArray};
    } catch (error) {
      console.log('error ' + error);
      distpachIngredientsList({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const productContext = {
    addons: addonsState.addonsList,
    variant: variantState.variantList,
    ingredients: ingridientsState.ingredientsList,
    getProductAddOns,
    getProductVariant,
    getIngredients,
    variantType,
  };

  return (
    <ProductContext.Provider value={productContext}>
      {props.children}
    </ProductContext.Provider>
  );
};

export {ProductProvider, ProductContext};
