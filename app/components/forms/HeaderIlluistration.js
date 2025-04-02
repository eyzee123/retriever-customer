import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SPACING, windowWidth} from '../../styles/theme';

const HeaderIlluistration = props => {
  return (
    <View style={styles.topContainer}>
      <Text style={styles.pageTitle}>{props.title}</Text>
      <View style={styles.illustration}>{props.children}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  pageTitle: {
    ...FONTS.pageTitle,
    color: COLORS.black,
  },
  topContainer: {
    marginBottom: SPACING.x_large,
    alignSelf: 'center',
  },
  illustration: {
    marginTop: SPACING.small,
    alignSelf: 'center',
  },
});
export default HeaderIlluistration;
