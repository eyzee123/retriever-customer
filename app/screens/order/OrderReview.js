import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import Header from '../../components/headers/Header';
import OrderItems from '../../components/listItem/OrderItems';
import SectionDeliveryPayment from '../../components/listItem/SectionDeliveryPayment';
import SectionLocation from '../../components/listItem/SectionLocation';
import {images, menu} from '../../styles/images';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import BagIllustration from '../../assets/images/bag.svg';

const OrderReview = ({navigation}) => {
  const orderItem = [
    {
      image: images.imageCoffee,
      name: 'Cappucino Ala King con Carne Binondo Style',
      type: 'Regular',
      price: '125',
    },
    {
      image: images.imageCoffee,
      name: 'Cappucino Ala King con Carne Binondo Style',
      type: 'Regular',
      price: '125',
    },
  ];

  return (
    <MainScreen>
      <Header title="Order Overview" />
      <MainFrame fullscreen>
        {orderItem.length == null ? (
          <View style={styles.cartEmptyContainer}>
            <BagIllustration height={windowHeight * 0.25} />
            <Text style={styles.sectionTitle}>There is nothing here</Text>
            <Text style={styles.sectionSub}>
              You haven’t added anything to your bag
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.container}>
                <Text style={styles.sectionLabel}>Delivery Details</Text>
                <View style={styles.sectionLocationContainer}>
                  <SectionLocation
                    deliver_to="Current Location"
                    address="Junjun St., Buhangin, Davao City"
                    distance="8KM Away"
                  />
                </View>
                <SectionDeliveryPayment
                  icon="clock-time-three"
                  title="Deliver Now"
                  status="56 Minutes Away"
                />
                <Text style={[styles.sectionLabel, {marginTop: SPACING.small}]}>
                  Food
                </Text>
                <View style={styles.orderContainer}>
                  <FlatList
                    data={orderItem}
                    renderItem={({item}) => (
                      <View style={{paddingTop: SPACING.small}}>
                        <OrderItems
                          image={item.image}
                          name={item.name}
                          type={item.type}
                          price={item.price}
                        />
                      </View>
                    )}
                  />
                </View>
                <View style={styles.orderSummaryContainer}>
                  <Text style={styles.sectionLabel}>Order Summary</Text>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>SubTotal</Text>
                    <Text style={styles.totalPrice}>₱250</Text>
                  </View>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Delivery Fee</Text>
                    <Text style={styles.totalPrice}>₱40</Text>
                  </View>
                  <View style={styles.totalContainer}>
                    <Text style={[styles.totalLabel, {color: COLORS.orange}]}>
                      Promos
                    </Text>
                    <Text style={[styles.totalPrice, {color: COLORS.orange}]}>
                      -₱60
                    </Text>
                  </View>
                  <View style={styles.line} />
                  <View style={styles.totalContainer}>
                    <Text style={styles.allTotalLabel}>Total</Text>
                    <Text style={styles.allTotalPrice}>₱230</Text>
                  </View>
                </View>
                <Text style={styles.sectionLabel}>Payment Details</Text>
                <View style={styles.sectionLocationContainer}>
                  <SectionDeliveryPayment
                    icon="cash-multiple"
                    title="Payment Method"
                    status="Retriever Wallet"
                  />
                </View>
                <SectionDeliveryPayment
                  icon="check-decagram"
                  title="Choose Promos"
                  status=""
                />
              </View>
            }
          />
        )}
      </MainFrame>
      <View style={styles.btnContainer}>
        <RoundedButton
          icon="check-bold"
          text="Confirm Order Details"
          onPress={() => navigation.navigate('OrderProcess')}
        />
      </View>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  cartEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  sectionSub: {
    ...FONTS.regular,
    fontSize: SIZES.x_small,
    color: COLORS.subTextColor1,
  },
  container: {
    padding: SPACING.small,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    paddingBottom: SPACING.small,
  },
  sectionLocationContainer: {
    marginBottom: SPACING.x_small,
  },
  orderContainer: {
    marginTop: -SPACING.x_small,
    paddingBottom: SPACING.small,
  },
  orderSummaryContainer: {
    padding: SPACING.small,
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.4,
    borderRadius: BORDER.roundedCornerInput,
    marginBottom: SPACING.small,
  },
  line: {
    borderStyle: 'dashed',
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.7,
    marginVertical: SPACING.x_small,
  },
  totalContainer: {
    flexDirection: 'row',
  },
  totalLabel: {
    ...FONTS.regular,
    flex: 1,
    fontSize: SIZES.x_small,
    color: COLORS.darkGreen,
  },
  totalPrice: {
    ...FONTS.regular,
    fontSize: SIZES.x_small,
    color: COLORS.darkGreen,
  },
  allTotalLabel: {
    ...FONTS.bold,
    flex: 1,
    fontSize: windowHeight * 0.017,
    color: COLORS.darkGreen,
  },
  allTotalPrice: {
    ...FONTS.bold,
    fontSize: windowHeight * 0.017,
    color: COLORS.darkGreen,
  },
  btnContainer: {
    marginHorizontal: SPACING.small,
  },
});

export default OrderReview;
