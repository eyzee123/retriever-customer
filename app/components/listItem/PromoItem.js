import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {IMAGES} from '../../constants/Images';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const PromoItem = props => {
  return (
    <View style={styles(props).container}>
      <Image source={IMAGES.PROMO_ICON2} style={styles(props).image} />
      <Text style={styles(props).promo}>{props.promo}</Text>
    </View>
  );
};
const styles = props =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.grayF7,
      padding: SPACING.small,
      borderRadius: BORDER.roundedCornerBox,
      marginLeft: props.promoIndex == 0 ? SPACING.medium : SPACING.small,
      marginRight:
        props.promoIndex == props.promoLength - 1 ? SPACING.medium : 0,
    },
    image: {
      height: windowWidth * 0.04,
      width: windowWidth * 0.04,
    },
    promo: {
      ...FONTS.bold,
      color: COLORS.subTextColor1,
      marginLeft: SPACING.medium,
    },
  });
export default PromoItem;
