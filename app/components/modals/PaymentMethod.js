import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListPaymentMethod from '../listItem/ListPaymentMethod';
import {IMAGES} from '../../constants/Images';
import Labels from '../../constants/Labels';

const PaymentMethod = props => {
  const paymentMethod = [
    {
      image: IMAGES.MONEY,
      title: Labels.codTitle,
      description: Labels.codDescription,
      value: Labels.cod,
    },
    {
      image: IMAGES.GCASH,
      title: Labels.gcashTitle,
      description: Labels.gcashDescription,
      value: Labels.gcash,
    },
  ];
  return (
    <Modal
      isVisible={props.showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      onBackdropPress={props.closeModal}
      coverScreen={false}
      style={styles.contentContainer}
      {...props}>
      <View style={styles.container}>
        {paymentMethod.map((item, index) => {
          return (
            <ListPaymentMethod
              image={item.image}
              title={item.title}
              description={item.description}
              key={index}
              onPress={() => props.onConfirmPaymentMethod(item)}
            />
          );
        })}
        <View style={styles.locationDetailsContainer}>
          {/* <Icon
            name="plus-thick"
            color={COLORS.orange}
            size={SIZES.iconSize.x_small}
          />
          <Text style={styles.txtLocation} onPress={props.onPress}>
            Add Credit / Debit Card
          </Text> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: -SPACING.large,
  },
  container: {
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER.roundedCornerPopupCard,
    borderTopRightRadius: BORDER.roundedCornerPopupCard,
    width: windowWidth,
  },
  locationDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  txtLocation: {
    flex: 1,
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
    paddingLeft: SPACING.small,
  },
});

export default PaymentMethod;
