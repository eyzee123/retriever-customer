import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import Header from '../../components/headers/Header';
import ListofCurrentOrders from '../../components/listItem/ListofCurrentOrders';
import {ROUTES} from '../../constants/Routes';
import {COLORS, SPACING} from '../../styles/theme';
import EmptyCart from '../../components/empty/EmptyCart';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION, SUB_COLLECTION} from '../../constants/Collections';
import {LOCAL_STORAGE, TRACKING_NUMBER} from '../../constants/ProjectConstants';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import {getLocalDataObject} from '../../services/Storage/LocalStorageService';
import {IMAGES} from '../../constants/Images';

const CurrentOrders = ({navigation}) => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const ORDER_STATUS_LABEL = [
    'Your order is being processed!',
    'Your order is being processed!',
    'Order is being prepared. Rider will arrive at the store shortly.',
    'Order is being prepared. Rider will arrive at the store shortly.',
    'Order is being prepared. Rider will arrive at the store shortly.',
    'Your order is on the way to you!',
    'Your order has arrived!',
    'Your order has been completed!',
  ];

  const orderCollection = firestore().collection(COLLECTION.CURRENT_ORDERS);

  const getCurrentOrders = async () => {
    const currentUser = await getLocalDataObject(LOCAL_STORAGE.USER);
    setIsLoading(true);

    let query = orderCollection;
    query = query.where('user.id', '==', currentUser.id);
    query = query.where('status', '<', 7);
    query = query.orderBy('status', 'asc');

    query.onSnapshot(querySnapshot => {
      let orders = [];
      if (querySnapshot.empty) {
        setIsLoading(false);
        setCurrentOrders([]);
      } else {
        querySnapshot.forEach(async snapshot => {
          const productResponse = await orderCollection
            .doc(snapshot.id)
            .collection(SUB_COLLECTION.PRODUCTS)
            .get();

          let orderQty = 0;

          productResponse.forEach(product => {
            orderQty += +product.data().amount;
          });

          orders.push({
            id: snapshot.id,
            ...snapshot.data(),
            orderCount: orderQty,
          });

          if (querySnapshot.size == orders.length) {
            setIsLoading(false);
            setCurrentOrders(orders);
          }
        });
      }
    });
  };

  useEffect(() => {
    getCurrentOrders();
  }, []);

  let currentOrdersContent = (
    <EmptyCart
      image={IMAGES.EMPTY_CURRENTORDER}
      label="There is nothing here."
      sub_label={`You have no current orders yet, let’s fill${'\n'}your stomach up.`}
      tap_here="Tap here."
      onPress={() => navigation.navigate(ROUTES.FOOD)}
    />
  );

  if (currentOrders.length > 0) {
    currentOrdersContent = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={currentOrders}
        renderItem={({item, index}) => (
          <View
            style={[
              styles.listWrapper,
              {
                marginBottom:
                  currentOrders.length - 1 == index ? SPACING.medium : 0,
              },
            ]}>
            <ListofCurrentOrders
              avatar={item.store.storeProfilePhoto}
              storeName={item.store.storeName}
              type={item.store.type}
              total_price={item.totalCost}
              track_no={`${TRACKING_NUMBER.PREFIX}${
                item.trackingNumber || item.id
              }`}
              order_count={item.orderCount}
              order_status={ORDER_STATUS_LABEL[item.status]}
              outline={false}
              onPressTrack={() =>
                navigation.navigate(ROUTES.ORDER_PROCESS, {
                  orderId: item.id,
                  fromCart: false,
                })
              }
              store={item.store}
            />
          </View>
        )}
      />
    );
  }

  return (
    <MainScreen containerStyle={styles.contentContainer}>
      <Header title="List of Current Orders" />
      <MainFrame fullscreen>
        {isLoading && (
          <LoadingOverlay visible={isLoading} textContent="LOADING..." />
        )}
        {!isLoading && (
          <View style={styles.container}>{currentOrdersContent}</View>
        )}
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.whiteFA,
  },
  container: {
    flex: 1,
    marginHorizontal: SPACING.medium,
  },
  listWrapper: {
    marginTop: SPACING.medium,
  },
});
export default CurrentOrders;
