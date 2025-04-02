import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import RoundedButton from '../cores/RoundedButton';
import ListSingleStoreStories from './ListSingleStoreStories';
import {formatThousands} from '../../utils/HelperFunctions';

const ListofCurrentOrders = props => {
  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.rowContainer}>
          <View style={styles.viewLeft}>
            <ListSingleStoreStories store={props.store} small />
          </View>
          <View style={styles.viewCenter}>
            <Text style={styles.sectionLabel}>{props.storeName}</Text>
            <Text style={styles.sectionSubLabel}>
              {props.order_count} {props.order_count > 1 ? 'Orders' : 'Order'}
            </Text>
          </View>
        </View>
        <View style={[styles.rowContainer, styles.trackNoContainer]}>
          <Text style={[styles.sectionLabel, {flex: 1}]}>{props.track_no}</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.sectionSubLabel}>Total Price: </Text>
            <Text style={styles.total}>
              ₱{formatThousands(props.total_price)}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.rowContainer, styles.bottomWrapper]}>
        <Text style={styles.orderStatus}>{props.order_status}</Text>
        <View>
          <RoundedButton
            text="  Order Tracking  "
            onPress={props.onPressTrack}
            iconStyle={styles.iconStyle}
            btnStyle={styles.btnStyleOrderDetails}
            outline
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.small,
    borderRadius: BORDER.roundedCornerBox,
    backgroundColor: COLORS.white,
  },
  divider: {
    borderBottomColor: COLORS.subTextColor,
    borderBottomWidth: 1,
    paddingBottom: windowHeight * 0.01,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLeft: {
    marginLeft: windowWidth * 0.015,
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: windowWidth * 0.035,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
  },
  sectionSubLabel: {
    ...FONTS.regular,
    fontSize: SIZES._14px,
    color: COLORS.subTextColor1,
  },
  trackNoContainer: {
    marginTop: SPACING.small,
  },
  total: {
    ...FONTS.bold,
    fontSize: SIZES._14px,
    color: COLORS.orange,
  },
  bottomWrapper: {
    alignItems: 'center',
    marginTop: SPACING.small,
  },
  orderStatus: {
    flex: 1,
    ...FONTS.regular,
    color: COLORS.orange,
    fontSize: SIZES._12px,
    marginRight: SPACING.x_small,
  },
  iconStyle: {
    marginRight: 0,
  },
  btnStyleOrderDetails: {
    marginVertical: 0,
  },
});
export default ListofCurrentOrders;
