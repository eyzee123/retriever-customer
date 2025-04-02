import React, {useState} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {formatThousands} from '../../utils/HelperFunctions';

const OrderItemListDetails = props => {
  const [icon, setIcon] = useState('chevron-down');
  const [show, setShow] = useState(
    props.type || props.addons.length != 0 || props.specialInstructions
      ? true
      : false,
  );

  const showOrderDesc = () => {
    if (icon === 'chevron-down') {
      setIcon('chevron-up');
      setShow(false);
    } else {
      setIcon('chevron-down');
      setShow(true);
    }
  };

  return (
    <View style={styles(props).container}>
      <View style={styles(props).viewLeft}>
        <Text style={styles(props).count}>{props.quantity}</Text>
      </View>
      <View style={styles(props).viewCenter}>
        <Text style={[styles(props).sectionLabel, props.sectionLabel]}>
          {props.order}
        </Text>
        {props.type || props.addons.length != 0 ? (
          <View
            style={{flexDirection: 'row', marginTop: windowHeight * 0.002}}
            onStartShouldSetResponder={showOrderDesc}>
            <Text style={styles(props).sectionSubLabel}>Show more </Text>
            <Icon name={icon} size={SIZES.iconSize.x_small} color={'#7D7E82'} />
          </View>
        ) : null}
        {show ? (
          <>
            {props.type ? (
              <Text style={[styles(props).variant]}>{props.type}</Text>
            ) : null}

            {props.addons.length != 0 ? (
              <View style={{marginTop: -windowHeight * 0.007}}>
                <Text style={styles(props).sectionSubLabel}>
                  {props.addons}
                </Text>
              </View>
            ) : null}

            {props.specialInstructions ? (
              <>
                <Text
                  style={[
                    styles(props).sectionSubLabel,
                    {marginTop: SPACING.small, color: COLORS.orange},
                  ]}>
                  Special Instructions
                </Text>
                <Text style={styles(props).sectionSubLabel}>
                  {props.specialInstructions}
                </Text>
              </>
            ) : null}
          </>
        ) : null}
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={[styles(props).price, props.priceStyle]}>
          ₱{formatThousands(props.totalCost)}
        </Text>
      </View>
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginTop: SPACING.large,
      borderBottomColor: COLORS.subTextColor,
    },
    viewLeft: {
      marginRight: SPACING.small,
      paddingTop: Platform.OS === 'ios' ? windowWidth * 0.003 : 0,
      paddingHorizontal: windowWidth * 0.01,
      borderRadius: 6,
      height: windowWidth * 0.05,
      backgroundColor: '#E5E5E6',
      marginTop: props.type || props.addons.length != 0 ? SPACING.small : 0,
    },
    count: {
      fontSize: SIZES._12px,
      color: COLORS.darkGreen,
    },
    viewCenter: {
      flex: 1,
    },
    sectionLabel: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.darkGreen,
    },
    price: {
      ...FONTS.regular,
      fontSize: SIZES._12px,
      textAlign: 'left',
      paddingLeft: windowWidth * 0.03,
    },
    variant: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.subTextColor1,
      marginTop: SPACING.small,
    },
    sectionSubLabel: {
      ...GlobalStyle.sectionSubLabel,
      color: '#7D7E82',
    },
    paymentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
export default OrderItemListDetails;
