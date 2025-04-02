import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const ListViewMenuItem = props => {
  return (
    <TouchableOpacity style={styles.listViewContainer} onPress={props.onPress}>
      <Text style={styles.productName}>{props.productName}</Text>
      <Text style={styles.price}>{props.actual_price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productName: {
    ...FONTS.regular,
    color: COLORS.brown332,
  },
  price: {
    ...FONTS.bold,
    color: COLORS.brown332,
  },
  listViewContainer: {
    paddingTop: windowWidth * 0.04,
    paddingBottom: windowWidth * 0.03,
    borderBottomWidth: 1,
    borderColor: COLORS.grayF9,
  },
});

export default ListViewMenuItem;
