import React, {createContext, useReducer, useState} from 'react';
import {orderInitialState, orderReducer} from '../reducers/OrderReducer';
import firestore from '@react-native-firebase/firestore';
import {RoundOffDecimal} from '../utils/HelperFunctions';
import {COLLECTION} from '../constants/Collections';
import moment from 'moment';

const OrderContext = createContext();

const OrderProvider = props => {
  const [orderStatus, setOrderStatus] = useState(0);
  const [orderState, dispatchOrderAction] = useReducer(
    orderReducer,
    orderInitialState,
  );

  const ordersCollection = firestore().collection(COLLECTION.CURRENT_ORDERS);

  const setDeliveryDetails = async (distance, duration) => {
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
      deliveryFee =
        (+roundedOffDistance - +distanceFree) * +succedingRate + +deliveryRate;
    }
    const deliveryDetails = {
      distance: RoundOffDecimal(distance, 10),
      duration: RoundOffDecimal(duration, 1),
      deliveryFee,
    };
    dispatchOrderAction({type: 'GET_DELIVERY_FEE', payload: {deliveryDetails}});
  };

  const addOrderItem = orderItem => {
    dispatchOrderAction({type: 'ADD_ORDER_ITEM', payload: {orderItem}});
  };
  const addPromoItem = promoItem => {
    dispatchOrderAction({type: 'ADD_PROMO_ITEM', payload: {promoItem}});
  };

  const getOrderHistory = async (userId, from, to) => {
    let ordersArray = [];
    try {
      if (from == undefined) {
        from = moment().subtract(7, 'days').startOf('day').toDate(); // Seven days ago
      }
      if (to == undefined) {
        to = moment().endOf('day').toDate(); // Current date (end of day)
      }
      await ordersCollection
        .where('user.id', '==', userId)
        .where('status', 'in', [7, 99])
        .where('updatedAt', '>=', from)
        .where('updatedAt', '<=', to)
        .orderBy('updatedAt', 'desc')
        .limit(5)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(snapshot => {
            let data = snapshot.data();
            data.id = snapshot.id;
            const formattedDate = moment(
              snapshot.data().updatedAt.toDate(),
            ).format('dddd, DD MMM YYYY, h:mm a');
            ordersArray.push({...data, date: formattedDate});
          });
        });
      return {data: ordersArray};
    } catch (error) {
      console.log(error);
      return {data: []};
    }
  };

  const orderContext = {
    setDeliveryDetails,
    addPromoItem,
    addOrderItem,
    deliveryDetails: orderState.deliveryDetails,
    promo: orderState.promo,
    order: orderState.order,
    orderStatus,
    setOrderStatus,
    getOrderHistory,
  };

  return (
    <OrderContext.Provider value={orderContext}>
      {props.children}
    </OrderContext.Provider>
  );
};

export {OrderProvider, OrderContext};
