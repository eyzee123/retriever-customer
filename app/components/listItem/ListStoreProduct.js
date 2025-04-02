import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import {IMAGES} from '../../constants/Images';

const ListStoreProduct = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image
        source={props.image != '' ? {uri: props.image} : IMAGES.NO_IMAGE}
        resizeMode="stretch"
        style={styles.image}
      />
      <View style={styles.menuContainer}>
        <Text style={styles.menuName}>{props.product}</Text>
        <Text style={styles.price}>₱{props.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  image: {
    width: windowHeight * 0.06,
    height: windowHeight * 0.06,
    borderRadius: BORDER.roundedCornerBox,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.small,
  },
  menuName: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.tertiary,
  },
  price: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.tertiary,
  },
});

export default ListStoreProduct;
