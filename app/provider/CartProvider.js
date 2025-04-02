import {createContext, useCallback, useReducer, useEffect} from 'react';
import {cartReducer, defaultCartState} from '../reducers/CartReducer';
import {
  addCartInFiresTore,
  updateCartInFiresTore,
} from '../services/CartService';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {isArrayEqual} from '../utils/HelperFunctions';
import {ERROR} from '../constants/Status';
import {COLLECTION, SUB_COLLECTION} from '../constants/Collections';
import {StoreProvider} from './StoreProvider';
import {useRoute} from '@react-navigation/native';

const CartContext = createContext();

const CartProvider = props => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState,
  );

  const authChanged = useCallback(firebaseUser => {
    if (firebaseUser) {
      if (cartState.items.length === 0) {
        getCartfromFirestore();
      }
    } else {
      dispatchCartAction({type: 'EMPTY'});
    }
  }, []);

  //check if auth change
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authChanged);
    return subscriber;
  }, [authChanged]);

  const getCartfromFirestore = async () => {
    const currentUSer = auth().currentUser;
    const cartCollection = firestore()
      .collection(COLLECTION.USERS)
      .doc(currentUSer.uid)
      .collection(SUB_COLLECTION.CART_TEMP);
    const storeData = await cartCollection.get();
    let itemList = [];
    storeData.forEach(async snapshot => {
      let productList = [];
      const productData = await cartCollection
        .doc(snapshot.id)
        .collection(SUB_COLLECTION.PRODUCTS)
        .get();
      productData.forEach(async snapshot => {
        productList.push({
          ...snapshot.data(),
        });
      });
      itemList.push({...snapshot.data(), product: productList});
      dispatchCartAction({type: 'SUCCESS', payload: {item: itemList}});
    });
  };

  const addItemToCartHandler = useCallback(async item => {
    dispatchCartAction({type: 'PROCESSING'});

    const productAmount = +item.product.amount;
    const productTotalCost = +item.product.totalCost;

    //overall total
    const totalAmount = productTotalCost;

    let updatedItems = [...cartState.items];

    const existingCartItemIndex = updatedItems.findIndex(
      data => data.id === item.id,
    );

    /// Item
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (cartState.items.length === 3 && !existingCartItem) {
      dispatchCartAction({
        type: 'ERROR',
        payload: {error: ERROR.CART_ITEMS_LIMIT},
      });
      return {limit: true};
    }

    if (existingCartItem) {
      const existingCartItemProductIndex = existingCartItem.product.findIndex(
        data =>
          data.productID === item.product.productID &&
          (isArrayEqual(data.variants, item.product.variants) ||
            data.variants === item.product.variants) &&
          isArrayEqual(data.addons, item.product.addons),
      );

      const existingCartItemProduct =
        existingCartItem.product[existingCartItemProductIndex];

      let updatedItemProducts;
      let update;

      if (existingCartItemProduct) {
        const updatedItemProduct = {
          ...existingCartItemProduct,
          amount: existingCartItemProduct.amount + item.product.amount,
          totalCost: existingCartItemProduct.totalCost + productTotalCost,
        };
        updatedItemProducts = [...existingCartItem.product];
        updatedItemProducts[existingCartItemProductIndex] = updatedItemProduct;
        update = true;
        const response = await addCartInFiresTore(
          {
            ...item,
            amount: existingCartItemProduct
              ? existingCartItemProduct.amount + item.product.amount
              : {...item.amount},
            totalCost: existingCartItemProduct
              ? existingCartItemProduct.totalCost + item.product.totalCost
              : {...item.totalCost},
            totalAmount: existingCartItem.totalAmount + totalAmount,
          },
          update,
          1,
        );
      } else {
        update = false;
        const response = await addCartInFiresTore(
          {
            ...item,
            amount: existingCartItemProduct
              ? existingCartItemProduct.amount + item.product.amount
              : {...item.amount},
            totalCost: existingCartItemProduct
              ? existingCartItemProduct.totalCost + item.product.totalCost
              : {...item.totalCost},
            totalAmount: existingCartItem.totalAmount + totalAmount,
          },
          update,
          1,
        );

        updatedItemProducts = existingCartItem.product.concat({
          ...item.product,
          id: response.result.result,
          productID: item.product.id,
        });
      }
      const updatedItem = {
        ...existingCartItem,
        product: updatedItemProducts,
        totalAmount: existingCartItem.totalAmount + totalAmount,
      };

      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const response = await addCartInFiresTore({
        ...item,
        totalAmount: totalAmount,
      });
      const items = {
        ...item,
        product: [
          {
            ...item.product,
            id: response.result.result,
            productID: item.product.id,
          },
        ],
        createdAt: new Date(),
        totalAmount: totalAmount,
      };

      updatedItems = cartState.items.concat(items);
    }
    dispatchCartAction({type: 'SUCCESS', payload: {item: updatedItems}});
  });

  const updateItemFromCartHandler = useCallback(async item => {
    const productTotalCost = +item.product.totalCost;

    const existingCartItemIndex = cartState.items.findIndex(
      data => data.id === item.id,
    );

    /// Item
    const existingCartItem = cartState.items[existingCartItemIndex];
    let updatedItems;

    const existingCartItemProductIndex = existingCartItem.product.findIndex(
      data => data.id === item.product.id,
    );

    const existingCartItemProduct =
      existingCartItem.product[existingCartItemProductIndex];

    let updatedItemProducts;

    updatedItemProducts = [...existingCartItem.product];
    updatedItemProducts[existingCartItemProductIndex] = item.product;

    let tempTotal = 0;
    existingCartItem.product.forEach(prod => {
      if (prod.id != existingCartItemProduct.id) {
        tempTotal += +prod.totalCost;
      }
    });
    const totalAmount = tempTotal + productTotalCost;

    const updatedItem = {
      ...existingCartItem,
      product: updatedItemProducts,
      totalAmount: totalAmount,
    };

    updateCartInFiresTore({...item, totalAmount});

    updatedItems = [...cartState.items];
    updatedItems[existingCartItemIndex] = updatedItem;

    dispatchCartAction({type: 'SUCCESS', payload: {item: updatedItems}});
  });

  const removeItemFromCartHandler = useCallback(async id => {
    dispatchCartAction({type: 'PROCESSING'});

    const newItemList = cartState.items.filter(item => item.id !== id);

    const cartTempDoc = firestore()
      .collection(COLLECTION.USERS)
      .doc(auth().currentUser.uid)
      .collection(SUB_COLLECTION.CART_TEMP)
      .doc(id);

    const allProducts = await cartTempDoc
      .collection(SUB_COLLECTION.PRODUCTS)
      .get();

    //delete products in cart temp
    allProducts.forEach(data => {
      cartTempDoc.collection(SUB_COLLECTION.PRODUCTS).doc(data.id).delete();
    });

    //delete item in cart temp
    cartTempDoc.delete();

    dispatchCartAction({type: 'SUCCESS', payload: {item: newItemList}});
  });

  const removeProductFromCartHandler = useCallback(async item => {
    const storeId = item.id;
    const productId = item.product.id;

    dispatchCartAction({type: 'PROCESSING'});

    let prevCartItems = [...cartState.items];

    const cartItemIndex = prevCartItems.findIndex(item => item.id === storeId);

    const currentItem = prevCartItems[cartItemIndex];

    const updatedProducts = currentItem.product.filter(
      item => item.id !== productId,
    );

    let totalAmount = 0;
    updatedProducts.forEach(prod => {
      totalAmount += prod.totalCost;
    });

    const updatedItem = {
      ...currentItem,
      product: updatedProducts,
      totalAmount: totalAmount,
    };

    prevCartItems[cartItemIndex] = updatedItem;

    const cartTempDoc = firestore()
      .collection(COLLECTION.USERS)
      .doc(auth().currentUser.uid)
      .collection(SUB_COLLECTION.CART_TEMP)
      .doc(storeId);

    cartTempDoc.update({totalAmount});

    const productDoc = cartTempDoc
      .collection(SUB_COLLECTION.PRODUCTS)
      .doc(productId);

    // //delete item in cart temp
    productDoc.delete();

    let newItemList = prevCartItems;
    if (totalAmount === 0) {
      cartTempDoc.delete();
      newItemList = newItemList.filter(item => item.id !== storeId);
    }

    dispatchCartAction({type: 'SUCCESS', payload: {item: newItemList}});
  });

  const cartContext = {
    items: cartState.items,
    isLoading: cartState.isLoading,
    addItem: addItemToCartHandler,
    updateItem: updateItemFromCartHandler,
    removeItem: removeItemFromCartHandler,
    removeProduct: removeProductFromCartHandler,
    error: cartState.error,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export {CartProvider, CartContext};
