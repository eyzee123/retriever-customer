import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import Header from '../../components/headers/Header';
import OrderItems from '../../components/listItem/OrderItems';
import SectionDeliveryPayment from '../../components/listItem/SectionDeliveryPayment';
import SectionLocation from '../../components/listItem/SectionLocation';
import {IMAGES} from '../../constants/Images';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION, SUB_COLLECTION} from '../../constants/Collections';
import OrderSummary from '../../components/listItem/OrderSummary';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Labels from '../../constants/Labels';

const OrderDetails = ({navigation, route}) => {
  const {orderItem} = route.params;
  const orderCollection = firestore().collection(COLLECTION.CURRENT_ORDERS);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setIsLoading(true);
    let productList = [];

    const productResponse = await orderCollection
      .doc(orderItem.id)
      .collection(SUB_COLLECTION.PRODUCTS)
      .get();

    if (productResponse.empty) {
      setIsLoading(false);
      return;
    }

    productResponse.forEach(snapshot => {
      productList.push({
        id: snapshot.id,
        ...snapshot.data(),
      });
    });
    setIsLoading(false);
    setProducts(productList);
  };

  return (
    <MainScreen>
      <Header title="Order Details" />
      <MainFrame fullscreen>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {orderItem.status == 99 && (
              <View style={styles.cancelledContainer}>
                <Icon
                  style={styles.cancelledIcon}
                  name="information"
                  size={windowHeight * 0.027}
                  color={COLORS.red1}
                />
                <View style={styles.cancelledWrapper}>
                  <Text style={styles.cancelledTitle}>Order Cancelled</Text>
                  <Text style={styles.cancelledBody}>
                    {orderItem.cancelReason}
                  </Text>
                </View>
              </View>
            )}
            <Text style={styles.sectionLabel}>Delivery Details</Text>
            <SectionLocation
              deliver_to="Delivery Address"
              address={orderItem.deliveryAddress}
              distance=""
              disabled
            />
            <Text style={[styles.sectionLabel, {marginTop: SPACING.large}]}>
              Food
            </Text>
            {products.map((item, index) => (
              <OrderItems
                key={item.id}
                image={item.productPicture}
                name={item.productName}
                type={item.productType}
                price={item.totalCost}
                addons={item.addons.map(items => `\n${items.name}`)}
                quantity={item.amount}
              />
            ))}

            <View style={styles.orderSummaryContainer}>
              <OrderSummary
                title="Order Summary"
                subTotal={orderItem.subTotal}
                deliveryFee={orderItem.deliveryFee}
                discount={orderItem.discount}
                totalCost={orderItem.totalCost}
              />
            </View>

            <View style={styles.sectionLocationContainer}>
              <SectionDeliveryPayment
                image={IMAGES.CARD}
                imageStyle={styles.imageStyle}
                title="Payment Method"
                status={orderItem.paymentMethod}
                disabled>
                <View style={styles.viewLeft}>
                  <Image
                    resizeMode="stretch"
                    source={
                      orderItem.paymentMethod == Labels.cod
                        ? IMAGES.MONEY_1
                        : IMAGES.GCASH
                    }
                    style={{height: '100%', width: '100%'}}
                  />
                </View>
              </SectionDeliveryPayment>
            </View>
          </View>
        </ScrollView>
      </MainFrame>
      {/* <View style={styles.btnContainer}>
        <RoundedButton text="Order Again" />
      </View> */}
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.medium,
  },
  cancelledContainer: {
    backgroundColor: COLORS.subTextColor,
    paddingTop: windowHeight * 0.019,
    paddingHorizontal: SPACING.medium,
    paddingBottom: SPACING.medium,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    marginTop: SPACING.x_small,
    marginBottom: windowHeight * 0.013,
  },
  cancelledIcon: {
    transform: [{rotate: '180deg'}],
    marginTop: windowHeight * 0.0028,
  },
  cancelledWrapper: {
    flex: 1,
    marginLeft: SPACING.small,
  },
  cancelledTitle: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
  },
  cancelledBody: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.tertiary,
  },
  sectionLabel: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    marginBottom: SPACING.small,
  },
  orderSummaryContainer: {
    marginTop: SPACING.medium,
  },
  sectionLocationContainer: {
    marginTop: SPACING.small,
    marginBottom: SPACING.x_small,
  },
  imageStyle: {
    height: windowHeight * 0.015,
  },
  viewLeft: {
    height: windowHeight * 0.016,
    width: windowHeight * 0.021,
    marginRight: SPACING.small,
  },
  btnContainer: {
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
});

export default OrderDetails;
