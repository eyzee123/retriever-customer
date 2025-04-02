import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
  Linking,
  BackHandler,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import ProgressBar from '../../components/general/ProgressBar';
import RoundedButton from '../../components/cores/RoundedButton';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import SectionLocation from '../../components/listItem/SectionLocation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SectionDeliveryPayment from '../../components/listItem/SectionDeliveryPayment';
import Header from '../../components/headers/Header';
import {ROUTES} from '../../constants/Routes';
import Lottie from 'lottie-react-native';
import OrderItemListDetails from '../../components/listItem/OrderItemListDetails';
import ReviewStoreAndRider from '../../components/modals/ReviewStoreAndRider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {COLLECTION, SUB_COLLECTION} from '../../constants/Collections';
import {ActivityIndicator} from 'react-native-paper';
import {IMAGES} from '../../constants/Images';
import axios from 'axios';
import useCountDown from '../../hooks/useCountDown';
import {
  FCM_SERVER,
  LOCAL_STORAGE,
  NOTIFICATIONS,
  TIMER,
} from '../../constants/ProjectConstants';
import {CartContext} from '../../provider/CartProvider';
import {ChatContext} from '../../provider/ChatProvider';
import {OrderContext} from '../../provider/OrderProvider';
import SetupDialogue from '../../components/modals/SetupDialogue';
import SuccessDialogue from '../../components/modals/SuccessDialogue';
import UserAvatar from 'react-native-user-avatar';
import OrderSummary from '../../components/listItem/OrderSummary';
import ProgressStepper from '../../components/general/ProgressStepper';
import {RateReviewContext} from '../../provider/RateReviewProvider';
import {getLocalDataObject} from '../../services/Storage/LocalStorageService';
import DeviceInfo from 'react-native-device-info';
import Labels from '../../constants/Labels';

const OrderProcess = ({navigation, route}) => {
  const cartContext = useContext(CartContext);
  const chatContext = useContext(ChatContext);
  const orderContext = useContext(OrderContext);
  const ratingContext = useContext(RateReviewContext);

  const {counter, setCounter, isCounting, setIsCounting} = useCountDown(
    TIMER.ORDER_PENDING,
  );
  const [progressValue, setProgressValue] = useState(1);
  const [openReviewPopup, setOpenReviewPopup] = useState(true);
  const [openReviewOrder, setOpenReviewOrder] = useState(false);
  const [openThankYouReview, setOpenThankYouReview] = useState(false);
  const [type, setType] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  let products = [];

  const {orderId, fromCart} = route.params;
  //const orderId = 'kvotzDqPUDBGrPC0CKG9';

  const ORDER_STATUS_LABEL = [
    'Your order is being processed!',
    'Your order is being processed!',
    'Order is being prepared. Rider will arrive at the store shortly.',
    'Order is being prepared. Rider will arrive at the store shortly.',
    'Order is being prepared. Rider will arrive at the store shortly.',
    'Your order is on the way to you!',
    'Check your area, your rider may be around the corner.',
    'Your order has been completed!',
  ];

  const ORDER_TITLE_LABEL = [
    'We are processing your order.',
    'We are processing your order.',
    `We’re preparing, wait for ${orderDetails?.preparationTime} mins.`,
    `We’re preparing, wait for ${orderDetails?.preparationTime} mins.`,
    `We’re preparing, wait for ${orderDetails?.preparationTime} mins.`,
    'Your rider is out for delivery.',
    'Your order has arrived.',
    'Your order has been completed!',
  ];

  const ORDER_PROCESS_IMAGE = [
    IMAGES.foodDeliver_1,
    IMAGES.foodDeliver_1,
    IMAGES.foodDeliver_2,
    IMAGES.foodDeliver_2,
    IMAGES.foodDeliver_2,
    IMAGES.foodDeliver_3,
    IMAGES.foodDeliver_4,
    IMAGES.foodDeliver_4,
  ];

  const ORDER_STATUS = {
    PENDING: 0,
    PREPARING: 1,
    ACCEPTED: 2,
    ASSIGNED: 3,
    ARRIVED: 6,
    COMPLETED: 7,
  };

  const orderCollection = firestore().collection(COLLECTION.CURRENT_ORDERS);

  function handleBackButtonClick() {
    if (fromCart) {
      navigation.navigate(ROUTES.FOOD);
    } else {
      navigation.goBack();
    }
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [navigation]);

  useEffect(() => {
    const subscriber = orderCollection
      .doc(orderId)
      .onSnapshot(async documentSnapshot => {
        if (documentSnapshot.exists) {
          orderContext.setOrderStatus(documentSnapshot.data().status);

          setOrderDetails({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
          const productResponse = await orderCollection
            .doc(documentSnapshot.id)
            .collection(SUB_COLLECTION.PRODUCTS)
            .get();
          products = [];
          productResponse.forEach(product => {
            products.push({...product.data()});
          });
          setProductDetails(products);
          if (documentSnapshot.data().status === 0) {
            //start timer
            setCounter(counter => counter - 1);
            setIsCounting(true);
          }
        } else {
          setOrderDetails(null);
        }
      });

    // Stop listening for updates when no longer required
    return () => {
      subscriber();
    };
  }, []);

  useEffect(() => {
    setProgressValue(counter / TIMER.ORDER_PENDING);
    if (counter == 0) {
      updateOrderStatus();
    }
  }, [counter]);

  const cancelHandler = async () => {
    try {
      const currentOrderDoc = firestore()
        .collection(COLLECTION.CURRENT_ORDERS)
        .doc(orderDetails.id);

      const allProducts = await currentOrderDoc
        .collection(SUB_COLLECTION.PRODUCTS)
        .get();

      allProducts.forEach(async data => {
        await currentOrderDoc
          .collection(SUB_COLLECTION.PRODUCTS)
          .doc(data.id)
          .delete();
      });

      await currentOrderDoc.delete();
      navigation.navigate(ROUTES.CART_DETAILS);
    } catch (error) {
      console.log('cancel error', error);
    }
  };

  const writeLogs = async () => {
    const manufacturer = await DeviceInfo.getManufacturer();

    const deviceInfo = {
      brand: DeviceInfo.getBrand(),
      manufacturer: manufacturer,
      appVersion: DeviceInfo.getVersion(),
      osVersion: DeviceInfo.getSystemVersion(),
    };

    const date = firebase.firestore.FieldValue.serverTimestamp();
    const log = {
      orderId: orderDetails.id,
      function: 'updateOrderStatus',
      desc: 'update orders status to 1',
      appName: DeviceInfo.getApplicationName(),
      createdAt: date,
      action: 'update',
      deviceInfo: deviceInfo,
    };
    await firestore().collection(COLLECTION.LOGS).add(log);
  };

  const updateOrderStatus = async () => {
    if (orderDetails.status === 0) {
      try {
        await firestore()
          .collection(COLLECTION.CURRENT_ORDERS)
          .doc(orderDetails.id)
          .update({status: 1});

        //send push notification
        sendPushNotification();
        //remove cart temp item
        cartContext.removeItem(orderDetails.store.id);

        writeLogs();
      } catch (error) {
        console.log('update status error', error);
      }
    }
  };

  const sendPushNotification = async () => {
    const tokenResponse = await firestore()
      .collection(COLLECTION.FCM_TOKEN)
      .doc(orderDetails.store.ownerID) //receiver id
      .get();

    if (!tokenResponse.data()) {
      return;
    }

    const token = tokenResponse.data().token;
    console.log('token send', token);
    try {
      const orderData = {
        type: 'order',
        order: {...orderDetails, products: {...productDetails}},
      };
      const response = await axios.post(FCM_SERVER.URL, {
        token: token,
        title: NOTIFICATIONS.NEW_ORDER_TITLE,
        body: NOTIFICATIONS.NEW_ORDER_BODY,
        // imageUrl:
        //   'https://firebasestorage.googleapis.com/v0/b/retrieverv2dev.appspot.com/o/retriever-images%2Fuser.png?alt=media&token=77572e72-c1f4-4602-8da8-2653fbb1d8e4',
        orderData: orderData,
      });
      resetCartState();
      // console.log('send notif success', response);
    } catch (err) {
      //Do nothing
      // console.log('send notif error', err.response);
      console.log('send notif error', err);
      return;
    }
  };

  const openReview = type => {
    setType(type);
    setOpenReviewPopup(false);
  };
  const submitReview = async rating => {
    const currentUser = await getLocalDataObject(LOCAL_STORAGE.USER);
    //some code here...

    const user = {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      id: currentUser.id,
    };
    const response = await ratingContext.addRating({
      storeId: orderDetails.store.storeID,
      user,
      rating,
      review: '',
    });

    if (!response.result.success) {
      console.log('something went wrong', response.result.errorMessage);
      return;
    }

    setType('submit');
    setOpenReviewOrder(false);
  };
  const goToFood = async () => {
    setOpenThankYouReview(false);
    navigation.navigate(ROUTES.FOOD);
  };
  const backHandler = () => {
    navigation.navigate(ROUTES.FOOD);
  };

  const goToChat = async () => {
    chatContext.setCollection(orderDetails.id).then(data => {
      navigation.navigate(ROUTES.MESSAGE, {
        riderDetails: orderDetails.rider,
      });
    });
  };

  const resetCartState = async () => {
    await orderContext.addOrderItem({});
    await orderContext.setDeliveryDetails({});
    await orderContext.addPromoItem({});
  };

  const skipReview = () => {
    setOpenReviewPopup(false);
    navigation.navigate(ROUTES.FOOD);
  };

  return (
    <>
      {orderDetails === null && <ActivityIndicator />}
      {orderDetails && (
        <MainScreen containerStyle={styles.contentContainer}>
          {orderDetails.status === ORDER_STATUS.COMPLETED ? (
            <SetupDialogue
              title="Thank you for your Order 🎉🎉"
              body="We would love to hear what you think and feel about how your order went! "
              onConfirmText="Review Order"
              onConfirmText1="Skip Review"
              showModal={openReviewPopup}
              onConfirmButton1={skipReview}
              onConfirmButton={() => openReview('reviewOrder')}
              onModalHide={
                type === 'reviewOrder'
                  ? () => setOpenReviewOrder(true)
                  : () => null
              }
            />
          ) : null}
          <ReviewStoreAndRider
            showModal={openReviewOrder}
            closeModal={() => {
              setType('reviewPopup');
              setOpenReviewOrder(false);
            }}
            onModalHide={() =>
              type === 'submit'
                ? setOpenThankYouReview(true)
                : type === 'reviewPopup'
                ? setOpenReviewPopup(true)
                : null
            }
            storeImage={orderDetails.store?.storeProfilePhoto}
            storeName={orderDetails.store?.storeName}
            onPressSubmit={submitReview}
          />
          <SuccessDialogue
            title="Thank you for your feedback! 🤗"
            body={
              'We are always doing our best to improve our service. Enjoy using our app!'
            }
            confirmButtonText="Go to food dashboard"
            showModal={openThankYouReview}
            closeModal={() => setOpenThankYouReview(false)}
            onConfirm={goToFood}
          />
          <MainFrame contentStyle={styles.contentWrapper}>
            {orderDetails.status > ORDER_STATUS.PENDING && (
              <Header
                onBackPressed={fromCart ? backHandler : false}
                title="Order Tracking"
                transparent
                txtHeader={{color: COLORS.darkGreen}}
                containerStyle={styles.header}>
                {/* <TouchableOpacity style={styles.viewRight}>
                  <Image
                    source={require('../../assets/icons/info1.png')}
                    resizeMode="stretch"
                    style={{width: '100%', height: '100%'}}
                  />
                </TouchableOpacity> */}
              </Header>
            )}
            <FlatList
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  <View style={styles.lottieContainer}>
                    <Lottie
                      resizeMode="cover"
                      source={
                        orderDetails.status === ORDER_STATUS.PENDING ||
                        orderDetails.status === ORDER_STATUS.PREPARING
                          ? require('./../../assets/animations/hour_glass.json')
                          : orderDetails.status === ORDER_STATUS.ACCEPTED ||
                            orderDetails.status === ORDER_STATUS.ASSIGNED ||
                            orderDetails.status === 4
                          ? require('./../../assets/animations/prepare.json')
                          : orderDetails.status === 5
                          ? require('./../../assets/animations/rider-deliver.json')
                          : orderDetails.status === ORDER_STATUS.ARRIVED ||
                            orderDetails.status === ORDER_STATUS.COMPLETED
                          ? require('./../../assets/animations/order.json')
                          : orderDetails.status === 99
                          ? require('./../../assets/animations/canceled.json')
                          : require('./../../assets/animations/rider-deliver.json')
                      }
                      style={{height: windowHeight * 0.25}}
                      autoPlay
                      loop
                    />
                  </View>

                  <View
                    style={[
                      styles.container,
                      {
                        paddingBottom:
                          orderDetails.status === 5 || orderDetails.status === 6
                            ? windowHeight * 0.23
                            : windowHeight * 0.15,
                      },
                    ]}>
                    <View style={styles.restaurantLabelContainer}>
                      <Image
                        resizeMode="stretch"
                        source={
                          orderDetails.status === 99
                            ? IMAGES.foodDeliver_5
                            : ORDER_PROCESS_IMAGE[orderDetails.status]
                        }
                        style={styles.foodProcessImage}
                      />
                      <View style={styles.restaurantLabelWrapper}>
                        <Text style={styles.txtRestaurant}>
                          {orderDetails.status === 99
                            ? 'Order cancelled.'
                            : ORDER_TITLE_LABEL[orderDetails.status]}
                        </Text>
                        {/* <Text style={styles.txtAmount}>₱230</Text> */}
                        <Text style={styles.txtSub}>
                          {orderDetails.status === 99
                            ? orderDetails.cancelReason
                            : ORDER_STATUS_LABEL[orderDetails.status]}
                        </Text>
                      </View>
                    </View>

                    {orderDetails.status === ORDER_STATUS.PENDING ? (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressWrapper}>
                          <ProgressBar
                            progress={progressValue}
                            color={COLORS.orange}
                            style={styles.progressStyle}
                            width={windowWidth * 0.75}
                            unfilledColor={COLORS.subTextColor}
                          />
                        </View>
                        <TouchableOpacity onPress={cancelHandler}>
                          <Text style={styles.txtCancel}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : orderDetails.status === 99 ||
                      orderDetails.status === 7 ? null : (
                      <View style={styles.progressStepper}>
                        <ProgressStepper
                          steps={
                            orderDetails.status === 1
                              ? 0
                              : orderDetails.status > 1 &&
                                orderDetails.status < 5
                              ? 1
                              : orderDetails.status === 5
                              ? 2
                              : 3
                          }
                          preparationTime={orderDetails.preparationTime}
                        />
                      </View>
                    )}

                    {orderDetails.rider &&
                      orderDetails.status >= ORDER_STATUS.ASSIGNED &&
                      orderDetails.status <= ORDER_STATUS.ARRIVED && (
                        <View style={styles.riderContainer}>
                          <UserAvatar
                            size={windowHeight * 0.055}
                            name={orderDetails.rider.name}
                            textColor={COLORS.black}
                            bgColor={'#E5E5E6'}
                            style={styles.image}
                          />

                          <View style={styles.viewCenter}>
                            <View style={styles.riderNameContainer}>
                              <Text style={styles.riderName}>
                                {orderDetails.rider.name}
                              </Text>
                              <Icon
                                name="star"
                                size={SIZES.iconSize.small}
                                color="#FF9F1C"
                                style={styles.icon}
                              />
                              <Text style={styles.rating}>
                                {' '}
                                {orderDetails.rider.avgRating}
                              </Text>
                            </View>
                            <View style={styles.riderNameContainer}>
                              <Text style={styles.riderUnit}>
                                {orderDetails.rider.unit}
                              </Text>
                              {orderDetails.rider.plateNo && (
                                <>
                                  <Text style={styles.bullet}>•</Text>
                                  <Text style={styles.riderUnit}>
                                    {' '}
                                    {orderDetails.rider.plateNo}
                                  </Text>
                                </>
                              )}
                            </View>
                          </View>
                          <View
                            style={[
                              styles.btnContainerCallText,
                              {marginRight: SPACING.x_small},
                            ]}>
                            <RoundedButton
                              icon="phone-in-talk"
                              iconStyle={styles.iconStyle}
                              onPress={() =>
                                Linking.openURL(
                                  `tel:${orderDetails.rider.phoneNumber}`,
                                )
                              }
                            />
                          </View>
                          <View style={styles.btnContainerCallText}>
                            <RoundedButton
                              icon="message-text"
                              iconStyle={styles.iconStyle}
                              onPress={() => goToChat()}
                            />
                          </View>
                        </View>
                      )}

                    {orderDetails.status === ORDER_STATUS.PENDING && (
                      <View style={styles.absolute} />
                    )}

                    <View
                      style={[
                        styles.specialInstrucContainer,
                        {
                          marginTop:
                            orderDetails.status === 99 ||
                            orderDetails.status === 7 ||
                            orderDetails.status === 1 ||
                            orderDetails.status === 2
                              ? SPACING.medium
                              : 0,
                        },
                      ]}>
                      <Text style={styles.sectionLabel}>Order Summary</Text>
                      <FlatList
                        data={productDetails}
                        renderItem={({item}) => (
                          <OrderItemListDetails
                            order={item.productName}
                            type={item.variants?.name}
                            addons={item.addons.map(items => `\n${items.name}`)}
                            quantity={item.amount}
                            specialInstructions={item.specialInstructions}
                            totalCost={item.totalCost}
                          />
                        )}
                      />
                    </View>

                    <SectionLocation
                      storeName={orderDetails.store.storeName}
                      displayAddress={orderDetails.store.displayAddress}
                      deliver_to={orderDetails.deliveryAddressName}
                      address={orderDetails.deliveryAddress}
                      disabled
                    />

                    <View style={styles.SectionDeliveryPaymentContainer}>
                      <SectionDeliveryPayment
                        icon="clock-time-three"
                        title="Delivery Time"
                        status={`${
                          orderDetails.estimatedDeliveryTime || ''
                        } Minutes Away`}
                        disabled
                      />
                    </View>
                    <View style={styles.SectionDeliveryPaymentContainer}>
                      <SectionDeliveryPayment
                        image={IMAGES.CARD}
                        imageStyle={{height: windowHeight * 0.015}}
                        title="Payment Method"
                        status={orderDetails.paymentMethod}
                        disabled>
                        <View style={styles.viewLeft}>
                          <Image
                            resizeMode="stretch"
                            source={
                              orderDetails.paymentMethod == Labels.cod
                                ? IMAGES.MONEY_1
                                : IMAGES.GCASH
                            }
                            style={{height: '100%', width: '100%'}}
                          />
                        </View>
                      </SectionDeliveryPayment>
                    </View>
                    <OrderSummary
                      title="Order Total"
                      subTotal={orderDetails.subTotal}
                      deliveryFee={orderDetails.deliveryFee}
                      discount={orderDetails.discount}
                      totalCost={orderDetails.totalCost}
                    />
                  </View>
                </>
              }
            />
          </MainFrame>
          <View style={styles.btnContainer}>
            {orderDetails.status === 5 ||
            orderDetails.status === ORDER_STATUS.ARRIVED ? (
              <RoundedButton
                image={require('../../assets/icons/track1.png')}
                text="Track Order"
                onPress={() =>
                  navigation.navigate(ROUTES.TRACK_ORDER, {
                    orderDetails: orderDetails,
                    productDetails: productDetails,
                  })
                }
              />
            ) : null}
            <RoundedButton
              icon="format-list-bulleted"
              text="View Current Orders"
              onPress={() => navigation.navigate(ROUTES.CURRENT_ORDERS)}
            />
          </View>
        </MainScreen>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // backgroundColor: COLORS.cardBackground,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.white,
  },
  header: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  viewRight: {
    height: windowHeight * 0.027,
    width: windowHeight * 0.027,
    marginRight: SPACING.x_small,
  },
  lottieContainer: {
    marginVertical: SPACING.medium,
    alignItems: 'center',
  },
  progressStepper: {
    width: '100%',
    marginTop: SPACING.medium,
    marginBottom: SPACING.x_small,
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium, //12
    backgroundColor: COLORS.white,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  restaurantLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLabelWrapper: {
    marginLeft: SPACING.small,
    flex: 1,
  },
  foodProcessImage: {
    width: windowHeight * 0.06,
    height: windowHeight * 0.06,
  },
  txtRestaurant: {
    ...FONTS.bold,
    flex: 1,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
  },
  txtAmount: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  txtSub: {
    flex: 1,
    ...FONTS.regular,
    color: COLORS.orange,
    fontSize: SIZES._12px,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.small,
  },
  progressWrapper: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  txtCancel: {
    ...FONTS.regular,
    flex: 1,
    fontSize: SIZES._12px,
    color: COLORS.orange,
    textAlign: 'right',
    marginTop: -SPACING.x_small,
    // textDecorationLine: 'underline',
  },
  riderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  image: {
    borderRadius: BORDER.circle,
    marginRight: SPACING.x_small,
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'space-around',
    paddingLeft: SPACING.x_small,
  },
  riderNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderName: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  icon: {
    paddingLeft: SPACING.x_small,
    paddingRight: windowHeight * 0.002,
  },
  rating: {
    ...FONTS.regular,
    color: COLORS.darkGreen,
  },
  riderUnit: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  bullet: {
    color: COLORS.tertiary,
    paddingHorizontal: SPACING.x_small,
  },
  btnContainerCallText: {
    // width: windowHeight * 0.056,
    width: 45,
  },
  absolute: {
    position: 'absolute',
    backgroundColor: COLORS.grayText,
    opacity: 0.4,
    height: '100%',
    width: windowWidth,
    top: windowHeight * 0.13,
    zIndex: 1,
  },
  specialInstrucContainer: {
    paddingTop: SPACING.small,
    paddingBottom: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    borderColor: COLORS.subTextColor,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: SPACING.small,
  },
  iconStyle: {
    marginRight: 0,
  },
  SectionDeliveryPaymentContainer: {
    paddingTop: SPACING.small,
  },
  viewLeft: {
    height: windowHeight * 0.016,
    width: windowHeight * 0.021,
    marginRight: SPACING.small,
  },
  btnContainer: {
    position: 'absolute',
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.small,
    backgroundColor: COLORS.white,
    width: '100%',
    bottom: 0,
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.lightGray,
  },
  sectionLabel: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
    marginBottom: -SPACING.small,
  },
  txtLabel: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  cancelledContainer: {
    width: windowWidth * 0.75,
    alignItems: 'center',
    marginTop: -windowHeight * 0.01,
    marginBottom: -windowHeight * 0.062,
  },
  cancelledReasonTitle: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.red1,
  },
  cancelledReasonBody: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    textAlign: 'center',
  },
});

export default OrderProcess;
