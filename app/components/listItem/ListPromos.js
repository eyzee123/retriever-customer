import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {IMAGES} from '../../constants/Images';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';

const ListPromos = props => {
  const promo = props.item;
  const selectPromoHandler = () => {
    props.onPromoSelect(promo);
  };

  return (
    <TouchableOpacity
      onPress={selectPromoHandler}
      style={styles(props).promoWrapper}>
      <Image source={IMAGES.PROMO2} style={styles(props).image} />
      <View style={styles(props).viewCenter}>
        <Text style={styles(props).promoTitle}>{promo.promoName}</Text>
        <Text style={styles(props).desc}>{promo.promoDescription}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = props =>
  StyleSheet.create({
    promoWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.medium,
      borderColor: COLORS.subTextColor1,
      borderBottomWidth: props.promoLength > 1 ? 0.4 : 0,
      marginTop: SPACING.x_small,
      paddingVertical: SPACING.small,
    },
    image: {
      width: windowHeight * 0.06,
      height: windowHeight * 0.06,
    },
    viewCenter: {
      flex: 1,
      marginLeft: SPACING.small,
    },
    promoTitle: {
      ...FONTS.bold,
      color: COLORS.darkGreen,
    },
    desc: {
      ...FONTS.regular,
      fontSize: SIZES._12px,
      color: COLORS.subTextColor1,
    },
  });
export default ListPromos;
