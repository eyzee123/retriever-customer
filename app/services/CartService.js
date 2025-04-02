import React from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {omit} from '../utils/HelperFunctions';
import {COLLECTION, SUB_COLLECTION} from '../constants/Collections';

export const addCartInFiresTore = async (
  data,
  update = false,
  updateState = 0,
) => {
  let result;
  const currentUSer = auth().currentUser;

  const cartCollection = firestore()
    .collection(COLLECTION.USERS)
    .doc(currentUSer.uid)
    .collection('cartTemp');

  const product = {
    ...data.product,
  };

  const store = omit(data, 'product');

  try {
    const date = firebase.firestore.FieldValue.serverTimestamp();
    if (!update) {
      let storeData = {
        ...store,
        createdAt: date,
      };
      if (updateState === 0) {
        await cartCollection.doc(store.id).set(storeData);
      }
      const productResponse = await cartCollection
        .doc(store.id)
        .collection('products')
        .add(product);

      await cartCollection
        .doc(store.id)
        .collection('products')
        .doc(productResponse.id)
        .update({id: productResponse.id});

      result = {success: true, result: productResponse.id};
    } else {
      await cartCollection
        .doc(store.id)
        .collection('products')
        .where('productID', '==', product.productID)
        .where('variants', '==', product.variants)
        .where('addons', '==', product.addons)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(snapshot => {
            const productRefence = cartCollection
              .doc(store.id)
              .collection('products')
              .doc(snapshot.id);

            firestore().runTransaction(async transaction => {
              // Get post data first
              const postSnapshot = await transaction.get(productRefence);

              if (!postSnapshot.exists) {
                throw 'Post does not exist!';
              }

              transaction.update(productRefence, {
                amount: postSnapshot.data().amount + product.amount,
                totalCost: postSnapshot.data().totalCost + product.totalCost,
                specialInstructions: product.specialInstructions,
              });
            });
          });
        });
      result = {success: true};
    }
    await cartCollection.doc(store.id).update({totalAmount: store.totalAmount});
    return {result};
  } catch (error) {
    result = {success: false, result: error};
    console.log('CartService', error);
    return {result};
  }
};

export const updateCartInFiresTore = async data => {
  const currentUSer = auth().currentUser;

  const cartCollection = firestore()
    .collection(COLLECTION.USERS)
    .doc(currentUSer.uid)
    .collection(SUB_COLLECTION.CART_TEMP);

  const product = {
    ...data.product,
  };

  const store = omit(data, 'product');

  try {
    await cartCollection
      .doc(store.id)
      .collection(SUB_COLLECTION.PRODUCTS)
      .doc(product.id)
      .set(product);

    await cartCollection.doc(store.id).update({totalAmount: store.totalAmount});
  } catch (error) {
    console.log(error);
  }
};
