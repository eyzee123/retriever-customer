import React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {formatThousands} from '../../utils/HelperFunctions';

const OrderSummary = props => {
  return (
    <View style={styles.orderTotalContainer}>
      <Text style={styles.sectionLabel}>{props.title}</Text>
      <View style={styles.orderTotalWrapper}>
        <Text style={styles.txtLabel}>Subtotal</Text>
        <Text style={[styles.txtLabel, {fontWeight: 'bold'}]}>
          ₱{formatThousands(props.subTotal)}
        </Text>
      </View>
      <View style={styles.orderTotalWrapper}>
        <Text style={styles.txtLabel}>Delivery Fee</Text>
        <Text style={[styles.txtLabel, {fontWeight: 'bold'}]}>
          ₱{props.deliveryFee}
        </Text>
      </View>
      {props.discount ? (
        <View style={styles.orderTotalWrapper}>
          <Text style={[styles.txtLabel1, {color: COLORS.orange}]}>
            {props.promoApplication
              ? `${props.promoApplication || ''} Promo`
              : 'Promos'}
          </Text>
          <Text style={[styles.txtLabel1, {fontWeight: 'bold'}]}>
            -₱{props.discount}
          </Text>
        </View>
      ) : null}
      <View style={styles.line} />
      <View style={styles.orderTotalWrapper}>
        <Text style={styles.txtLabel2}>Total</Text>
        <Text style={styles.txtLabel2}>
          ₱{formatThousands(props.totalCost)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderTotalContainer: {
    paddingTop: Platform.OS === 'ios' ? SPACING.small : SPACING.x_small,
    paddingBottom: SPACING.x_small,
    paddingHorizontal: SPACING.medium,
    borderColor: COLORS.subTextColor,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: SPACING.small,
  },
  sectionLabel: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
    paddingBottom: SPACING.small,
  },
  orderTotalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.x_small,
  },
  txtLabel: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  txtLabel1: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  txtLabel2: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    fontSize: SIZES._14px,
  },
  line: {
    width: '100%',
    borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    borderColor: COLORS.subTextColor1,
    borderBottomWidth: 1,
    marginTop: SPACING.x_small,
    marginBottom: SPACING.small,
  },
});

export default OrderSummary;
