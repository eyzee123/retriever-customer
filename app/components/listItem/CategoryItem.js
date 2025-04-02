import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';

const CategoryItem = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.categoryName}>{props.categoryName}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.x_small,
    marginVertical: SPACING.x_small,
    padding: SPACING.small,
    backgroundColor: COLORS.transparent,
    borderRadius: BORDER.roundedCornerButton,
    borderColor: COLORS.orange,
    borderWidth: 1,
    width: 100,
    alignItems: 'center',
  },

  categoryName: {
    ...FONTS.bold,
    color: COLORS.borderColor,
    fontSize: windowHeight * 0.018,
  },
});
export default CategoryItem;
