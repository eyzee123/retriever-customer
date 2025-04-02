import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform, Alert} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import Header from '../../components/headers/Header';
import OrderItems from '../../components/listItem/OrderItems';
import SectionDeliveryPayment from '../../components/listItem/SectionDeliveryPayment';
import SectionLocation from '../../components/listItem/SectionLocation';
import StoreRecommendMenu from '../../components/listItem/StoreRecommendMenu';
import SavedLocations from '../../components/modals/SavedLocations';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import PaymentMethod from '../../components/modals/PaymentMethod';
import BagIllustration from '../../assets/images/bag.svg';
import {ROUTES} from '../../constants/Routes';
import {UserContext} from '../../provider/UserProvider';
import {IMAGES} from '../../constants/Images';
import {formatThousands, omit} from '../../utils/HelperFunctions';
import {AddressContext} from '../../provider/AddressProvider';
import {
  API_KEY,
  LOCAL_STORAGE,
  LOCATION,
  PROMO_TEXT,
} from '../../constants/ProjectConstants';
import MapViewDirections from 'react-native-maps-directions';
import {OrderContext} from '../../provider/OrderProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {COLLECTION, SUB_COLLECTION} from '../../constants/Collections';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import {CartContext} from '../../provider/CartProvider';
import {getLocalDataObject} from '../../services/Storage/LocalStorageService';
import useGenerateTracking from '../../hooks/useGenerateTracking';
import ConfirmationDialogue from '../../components/modals/ConfirmationDialogue';
import SetupDialogue from '../../components/modals/SetupDialogue';
import OrderSummary from '../../components/listItem/OrderSummary';
import {StoreContext} from '../../provider/StoreProvider';
import CartIconHeader from '../../components/headers/CartIconHeader';
import DeviceInfo from 'react-native-device-info';
import {LocationContext} from '../../provider/LocationProvider';
import {showErrorMessage} from '../../utils/FlashMessage';
import {ERROR} from '../../constants/Status';

const CartDetails = ({navigation, route}) => {
  const userCtx = useContext(UserContext);
  const addressContext = useContext(AddressContext);
  const storeContext = useContext(StoreContext);
  const orderContext = useContext(OrderContext);
  const locationContext = useContext(LocationContext);
  const cartCtx = useContext(CartContext);

  const {
    distance: deliveryDistance,
    duration: deliveryTime,
    deliveryFee,
  } = orderContext.deliveryDetails;
  const orderItem = orderContext.order;
  const promoItem = orderContext.promo;
  const {primaryAddress} = addressContext;

  const [openModalSetupAcc, setOpenModalSetupAcc] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [openModalConfirmOrder, setConfirmOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  const [discount, setDiscount] = useState(0);
  const [totalCost, setTotalCost] = useState(orderItem.totalAmount || 0);

  const store = omit(orderItem, 'product');

  const destination = {latitude: store.latitude, longitude: store.longitude};

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const isPromoSet = () => {
    return Object.keys(promoItem).length === 0 ? false : true;
  };

  useEffect(() => {
    if (Object.keys(orderItem).length === 0) {
      // navigation.navigate(ROUTES.CART);
    }
    if (isPromoSet()) {
      calculateDiscount();
    }
    setIsCalculating(true);
    calculateTotalCost();
  }, [promoItem, deliveryFee, orderItem, discount]);

  const calculateTotalCost = () => {
    const d_fee = deliveryFee || 0;
    const totalCost = +orderItem.totalAmount + +d_fee - +discount;
    setIsCalculating(false);
    setTotalCost(totalCost);
  };
  const calculateDiscount = () => {
    let discount = promoItem.promoDiscount;
    if (promoItem.promoApplication === PROMO_TEXT.SUB_TOTAL) {
      if (promoItem.promoType === 'percentage') {
        discount = (orderItem.totalAmount * promoItem.promoDiscount) / 100;
      }
    }
    if (promoItem.promoApplication === PROMO_TEXT.DELIVERY_FEE) {
      if (promoItem.promoType === 'percentage') {
        const d_fee = deliveryFee || 0;
        discount = (d_fee * promoItem.promoDiscount) / 100;
      }
    }
    setDiscount(discount);
  };

  const clickToShowSavedAddress = () => {
    setOpenModalAddress(true);
  };
  const clickToCloseSavedAddress = () => {
    setOpenModalAddress(false);
  };
  const clickToShowPayment = () => {
    setOpenModalPayment(true);
  };
  const clickToClosePayment = () => {
    setOpenModalPayment(false);
  };

  const goToLogin = async () => {
    setOpenModalSetupAcc(false);
    await navigation.navigate(ROUTES.LOGIN);
  };

  const goToRegister = async () => {
    setOpenModalSetupAcc(false);
    await navigation.navigate(ROUTES.REGISTER);
  };
  const resetPromo = async () => {
    await orderContext.addPromoItem({});
    setDiscount(0);
  };
  const resetCartState = async () => {
    await orderContext.addOrderItem({});
    await orderContext.setDeliveryDetails({});
  };
  const clickCheckout = () => {
    if (!userCtx.isLoggedIn) {
      setOpenModalSetupAcc(true);
      return;
    }
    if (locationContext.locationPermission != LOCATION.GRANTED_PERMISSION) {
      locationContext.requestLocationPermission().then(res => {
        console.log(res);
        if (res.response !== 'granted') {
          showErrorMessage(ERROR.SELECT_ADDRESS);
        } else {
          if (primaryAddress.address == '') {
            showErrorMessage(ERROR.SELECT_ADDRESS);
          }
        }
      });
      return;
    } else {
      if (primaryAddress.address == '') {
        showErrorMessage(ERROR.SELECT_ADDRESS);
        return;
      }
    }
    // if (!deliveryFee) {
    //   Alert.alert('Please select delivery address');
    //   return;
    // }
    setConfirmOrder(!openModalConfirmOrder);
  };

  const promoIsValid = async () => {
    let result = {valid: true, message: 'Valid promo'};
    const now = new Date();
    const currentTimeStamp = firestore.Timestamp.fromDate(now);
    const current_date = currentTimeStamp.toDate();

    try {
      const response = await firestore()
        .collection(COLLECTION.PROMOS)
        .doc(promoItem.id)
        .get();

      const promoDetails = response.data();
      const expiration_date = promoDetails.promoTill.toDate();

      if (promoDetails.promoCount >= promoDetails.promoAllowusers) {
        result = {
          valid: false,
          message: 'This promo is no longer available',
        };
      }
      if (current_date >= expiration_date) {
        result = {
          valid: false,
          message: 'This promo already expired',
        };
      }
      if (orderItem.totalAmount < promoDetails.promoMin) {
        result = {
          valid: false,
          message:
            'You did not reached the minimum order amount to avail this promo',
        };
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const writeLogs = async orderId => {
    const manufacturer = await DeviceInfo.getManufacturer();

    const deviceInfo = {
      brand: DeviceInfo.getBrand(),
      manufacturer: manufacturer,
      appVersion: DeviceInfo.getVersion(),
      osVersion: DeviceInfo.getSystemVersion(),
    };

    const date = firebase.firestore.FieldValue.serverTimestamp();
    const log = {
      orderId: orderId,
      function: 'placeOrder',
      desc: 'place order with status 0',
      appName: DeviceInfo.getApplicationName(),
      createdAt: date,
      action: 'add',
      deviceInfo: deviceInfo,
    };
    await firestore().collection(COLLECTION.LOGS).add(log);
  };

  const placeOrder = async () => {
    setConfirmOrder(!openModalConfirmOrder);
    setIsLoading(true);
    if (isPromoSet()) {
      const promoValidity = await promoIsValid();
      if (!promoValidity.valid) {
        setIsLoading(false);
        Alert.alert(promoValidity.message);
        await resetPromo();
        return;
      }
    }
    const date = firebase.firestore.FieldValue.serverTimestamp();
    const cartCollection = firestore().collection(COLLECTION.CURRENT_ORDERS);
    const currentUser = await getLocalDataObject(LOCAL_STORAGE.USER);
    let storeDetails = omit(store, 'createdAt');
    storeDetails = omit(store, 'stories');
    const userDetails = omit(currentUser, 'createdAt');
    const {trackingNumber} = useGenerateTracking();

    let totalBasePrice = 0;
    let productTotalBasePrice = 0;
    let variantsTotalBasePrice = 0;
    let addonsTotalBasePrice = 0;
    await orderItem.product.forEach(async item => {
      addonsTotalBasePrice = item.addons?.reduce(
        (prevValue, currentValue) =>
          item?.addons != null
            ? prevValue + parseFloat(currentValue?.basePrice)
            : 0,
        0,
      );
      variantsTotalBasePrice = +item?.variants?.basePrice || 0;

      productTotalBasePrice +=
        (+item.productBasedPrice +
          addonsTotalBasePrice +
          variantsTotalBasePrice) *
        item.amount;
    });

    totalBasePrice = productTotalBasePrice;
    console.log('totalBasePrice', totalBasePrice);

    const orderDetails = {
      trackingNumber,
      user: userDetails,
      store: storeDetails,
      rider: null,
      promo: promoItem,
      paymentMethod: paymentMethod,
      addressNote: primaryAddress.note === undefined ? '' : primaryAddress.note,
      deliveryCoordinates: origin,
      deliveryAddressName: primaryAddress.addressName,
      deliveryAddress: primaryAddress.address,
      deliveryTime: 'ASAP',
      estimatedDeliveryTime: deliveryTime,
      deliveryDistance: deliveryDistance,
      preparationTime: storeDetails.preparationTime,
      deliveryFee,
      discount: discount,
      subTotal: orderItem.totalAmount,
      totalCost: totalCost,
      totalBasePrice: totalBasePrice,
      createdAt: date,
      updatedAt: date,
      status: 0,
      device: Platform.OS == 'ios' ? 'ios' : 'android',
    };

    try {
      //insert into current orders
      const orderReponse = await cartCollection.add(orderDetails);

      await orderItem.product.forEach(async item => {
        await cartCollection
          .doc(orderReponse.id)
          .collection(SUB_COLLECTION.PRODUCTS)
          .doc(item.id)
          .set(item);
      });
      if (isPromoSet()) {
        await cartCollection
          .doc(orderReponse.id)
          .collection(SUB_COLLECTION.PROMO)
          .doc(promoItem.id)
          .set(promoItem);
      }

      orderReponse.get().then(snapshot => {
        console.log('place order success');
        navigation.navigate(ROUTES.ORDER_PROCESS, {
          orderId: snapshot.id,
          fromCart: true,
        });

        writeLogs(snapshot.id);
        setIsLoading(false);
      });
    } catch (error) {
      setIsLoading(false);
      console.log('place order error', error);
    }
  };

  const onConfirmPaymentMethod = val => {
    //amount,email,payment_mode
    setPaymentMethod(val.value);
    setOpenModalPayment(false);
  };

  var orderItemProductID = orderItem.product.map(function (a) {
    return a.productID;
  });

  let storeProducts = [];

  storeContext.storeList
    .filter(item => item.storeID == store.storeID)
    .map(item =>
      item.products
        .filter(
          item =>
            item.soldQTY > 0 &&
            item.status == true &&
            orderItemProductID.indexOf(item.productID) === -1,
        )
        .sort((a, b) => b.soldQTY > a.soldQTY)
        .map((product, index) => {
          if (index < 5) {
            storeProducts.push(product);
          }
        }),
    );

  return (
    <>
      <LoadingOverlay visible={isLoading} textContent="LOADING..." />
      <MainScreen containerStyle={styles.contentContainer}>
        <Header title="Order Details">
          <CartIconHeader />
        </Header>
        <SetupDialogue
          image={IMAGES.SETUP}
          title="Set up an account for easier checkout!"
          body="There currently is no active account on this device. Let’s get you set up with our quick registration system!"
          onConfirmText="Register"
          onConfirmText1="Log in"
          showModal={openModalSetupAcc}
          closeModal={() => setOpenModalSetupAcc(false)}
          goToLogin={goToLogin}
          goToRegister={goToRegister}
        />
        <ConfirmationDialogue
          image={IMAGES.FOOD_ORDER}
          title="Confirm Orders  ✅"
          body="Done finalizing your cart? Tap “Place Order” to submit your given orders."
          onCancelButtonText="Cancel"
          confirmButtonText="Place Order"
          showModal={openModalConfirmOrder}
          onCancel={() => setConfirmOrder(false)}
          onConfirm={placeOrder}
        />

        <MainFrame fullscreen>
          {Object.keys(orderItem).length === 0 ? (
            <View style={styles.cartEmptyContainer}>
              <BagIllustration height={windowHeight * 0.25} />
              <Text style={styles.title}>There is nothing here</Text>
              <Text style={styles.body}>
                You haven’t added anything to your bag
              </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.container}>
                  <Text style={styles.sectionLabel}>Delivery Details</Text>
                  <View
                    style={[
                      styles.sectionLocationContainer,
                      styles.sideMargin,
                    ]}>
                    <SectionLocation
                      deliver_to={
                        locationContext.locationPermission !=
                        LOCATION.GRANTED_PERMISSION
                          ? 'No Location Provided'
                          : primaryAddress.addressName
                      }
                      address={
                        locationContext.locationPermission !=
                        LOCATION.GRANTED_PERMISSION
                          ? 'No Location Provided'
                          : primaryAddress.address
                      }
                      distance={
                        locationContext.locationPermission !=
                        LOCATION.GRANTED_PERMISSION
                          ? ''
                          : deliveryDistance
                          ? `${deliveryDistance}KM Away`
                          : 'Select address'
                      }
                      onPress={clickToShowSavedAddress}
                      chevron
                    />

                    {origin.latitude && origin.longitude && (
                      <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={API_KEY.GEO_API_KEY}
                        onReady={result => {
                          console.log(`Distance: ${result.distance} km`);
                          console.log(`Duration: ${result.duration} min.`);
                          orderContext.setDeliveryDetails(
                            result.distance,
                            result.duration,
                          );
                        }}
                        onStart={params => {
                          console.log(
                            `Started routing between "${params.origin}" and "${params.destination}"`,
                          );
                        }}
                        onError={error => {
                          console.log('sds', origin, destination);
                        }}
                      />
                    )}
                  </View>
                  <View style={styles.sideMargin}>
                    <SectionDeliveryPayment
                      icon="clock-time-three"
                      title="Deliver Now"
                      status={
                        locationContext.locationPermission !=
                        LOCATION.GRANTED_PERMISSION
                          ? ''
                          : deliveryTime
                          ? `${deliveryTime} Minutes Away`
                          : ''
                      }
                      disabled
                    />
                  </View>
                  <Text
                    style={[styles.sectionLabel, {marginTop: SPACING.large}]}>
                    Food
                  </Text>
                  <View style={styles.orderContainer}>
                    <FlatList
                      data={orderItem.product}
                      renderItem={({item}) => (
                        <OrderItems
                          key={item.id}
                          image={item.productPicture}
                          name={item.productName}
                          type={item.variants ? item.variants.name : ''}
                          price={item.totalCost}
                          quantity={item.amount}
                          addons={item.addons.map(items => `\n${items.name}`)}
                          special_instructions={item.specialInstructions}
                          edit={() =>
                            navigation.navigate(ROUTES.ADD_TO_CART, {
                              action: 'edit',
                              product: item,
                              store: store,
                            })
                          }
                        />
                      )}
                    />
                  </View>
                  <View style={styles.sideMargin}>
                    <OrderSummary
                      title="Order Summary"
                      subTotal={orderItem.totalAmount}
                      deliveryFee={deliveryFee || 0}
                      promoApplication={promoItem.promoApplication}
                      discount={discount}
                      totalCost={totalCost > 0 ? totalCost : 0}
                    />
                  </View>
                  {storeProducts.length > 0 && (
                    <View style={styles.recommendContainer}>
                      <Text
                        style={[styles.sectionLabel, styles.recommendLabel]}>
                        Store Recommendations
                      </Text>
                      <View style={styles.recommendWrapper}>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={storeProducts}
                          renderItem={({item, index}) => (
                            <StoreRecommendMenu
                              image={item.productPicture}
                              menu={item.productName}
                              price={item.productPrice}
                              index={index}
                              recommendMenuLength={
                                storeProducts.length < 5
                                  ? storeProducts.length
                                  : 5
                              }
                              onPress={() =>
                                navigation.navigate(ROUTES.ADD_TO_CART, {
                                  action: 'cartDetails',
                                  store: store,
                                  product: item,
                                })
                              }
                            />
                          )}
                        />
                      </View>
                    </View>
                  )}

                  <View style={[styles.paymentContainer, styles.sideMargin]}>
                    <View style={styles.sectionLocationContainer}>
                      <SectionDeliveryPayment
                        imageStyle={{height: windowHeight * 0.015}}
                        titleStyle={styles.titleStyle}
                        image={require('../../assets/icons/wallet1.png')}
                        title="Payment Method"
                        status={paymentMethod}
                        onPress={clickToShowPayment}
                        chevron
                      />
                    </View>
                    <SectionDeliveryPayment
                      image={require('../../assets/icons/promo1.png')}
                      title={`${promoItem.promoName || 'Choose Promos'}`}
                      subTitle={promoItem.promoDescription}
                      status=""
                      hasCancel={isPromoSet() && true}
                      onCancel={resetPromo}
                      onPress={() => navigation.navigate(ROUTES.ADD_PROMO)}
                    />
                  </View>
                </View>
              }
            />
          )}
        </MainFrame>
        <SavedLocations
          navigateTo={ROUTES.CART_DETAILS}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          showModal={openModalAddress}
          closeModal={clickToCloseSavedAddress}
          modalStyle={styles.modalStyle}
          containerStyle={styles.containerStyle}
        />
        <PaymentMethod
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          showModal={openModalPayment}
          closeModal={clickToClosePayment}
          onConfirmPaymentMethod={onConfirmPaymentMethod}
        />
        {Object.keys(orderItem).length === 0 ||
          (totalCost !== 0 && (
            <View style={styles.btnContainer}>
              <View style={{marginHorizontal: SPACING.small}}>
                <RoundedButton
                  disabled={isLoading && isCalculating}
                  icon="check-bold"
                  text={`₱${totalCost > 0 ? formatThousands(totalCost) : 0}`}
                  onPress={clickCheckout}
                  btnTextContainer={styles.btnTextContainer}>
                  <Text style={styles.btnText}>Place Order</Text>
                </RoundedButton>
              </View>
            </View>
          ))}
      </MainScreen>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.whiteFA,
  },
  cartEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
  },
  body: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  container: {
    marginTop: SPACING.small,
    marginBottom: SPACING.medium,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
    paddingBottom: SPACING.small,
    marginLeft: SPACING.medium,
  },
  sectionLocationContainer: {
    marginBottom: SPACING.x_small,
  },
  sideMargin: {
    marginHorizontal: SPACING.medium,
  },
  orderContainer: {
    marginTop: -SPACING.x_small,
    paddingBottom: SPACING.large,
    marginHorizontal: SPACING.medium,
  },
  recommendContainer: {
    marginBottom: SPACING.large,
  },
  recommendWrapper: {
    marginTop: -SPACING.small,
  },
  recommendLabel: {
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
  },
  modalStyle: {
    justifyContent: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 0 : -SPACING.medium,
  },
  containerStyle: {
    borderTopLeftRadius: BORDER.roundedCornerPopupCard,
    borderTopRightRadius: BORDER.roundedCornerPopupCard,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: SPACING.x_large,
  },
  paymentContainer: {
    marginTop: SPACING.x_small,
    marginBottom: SPACING.x_large,
  },
  titleStyle: {
    marginTop: Platform.OS == 'ios' ? windowWidth * 0.011 : windowWidth * 0.003,
  },
  btnTextContainer: {
    justifyContent: 'flex-start',
    marginHorizontal: SPACING.small,
  },
  btnText: {
    ...FONTS.bold,
    flex: 1,
    color: COLORS.white,
  },
  btnContainer: {
    paddingVertical: SPACING.small,
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.lightGray,
  },
});

export default CartDetails;
