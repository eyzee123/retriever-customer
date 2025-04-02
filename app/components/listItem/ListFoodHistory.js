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
import ListSingleStoreStories from './ListSingleStoreStories';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import RoundedButton from '../cores/RoundedButton';
import {formatThousands} from '../../utils/HelperFunctions';

const ListFoodHistory = props => {
  return (
    <View style={styles(props).container}>
      <View style={styles(props).divider}>
        <View style={styles(props).rowContainer}>
          <View style={styles(props).viewLeft}>
            <ListSingleStoreStories store={props.store} small />
          </View>
          <View style={styles(props).viewCenter}>
            <Text style={styles(props).sectionSubLabel}>{props.date}</Text>
            <Text style={styles(props).sectionLabel}>{props.storeName}</Text>
          </View>
        </View>
        <View
          style={[styles(props).rowContainer, styles(props).priceContainer]}>
          <Text style={styles(props).sectionSubLabel}>Total Price: </Text>
          <Text style={styles(props).total}>
            ₱{formatThousands(props.total)}
          </Text>
        </View>
      </View>
      <View style={[styles(props).rowContainer, styles(props).bottomWrapper]}>
        <View style={styles(props).viewSubLeft}>
          <Text style={styles(props).sectionSubLabel}>Order Status</Text>
          <Text style={styles(props).status}>
            {props.status == 99 ? 'Cancelled' : 'Completed'}
          </Text>
        </View>
        <View>
          <RoundedButton
            text="  Order Details  "
            onPress={props.onPressDetails}
            iconStyle={styles.iconStyle}
            btnStyle={styles(props).btnStyleOrderDetails}
            outline
          />
        </View>
      </View>
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      borderRadius: BORDER.roundedCornerBox,
      padding: SPACING.small,
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
      marginLeft: windowWidth * 0.035,
    },
    sectionSubLabel: {
      ...FONTS.regular,
      fontSize: SIZES._14px,
      color: COLORS.subTextColor1,
    },
    sectionLabel: {
      ...GlobalStyle.sectionLabel,
      color: COLORS.darkGreen,
    },
    priceContainer: {
      marginTop: SPACING.small,
      justifyContent: 'flex-end',
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
    viewSubLeft: {
      flex: 1,
    },
    status: {
      ...FONTS.bold,
      fontSize: SIZES._14px,
      color: props.status == 99 ? COLORS.red : COLORS.green,
    },
    iconStyle: {
      marginRight: 0,
    },
    btnStyleOrderDetails: {
      marginVertical: 0,
    },
  });

export default ListFoodHistory;
