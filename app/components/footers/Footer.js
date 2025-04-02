import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BORDER, COLORS, SPACING} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
const Footer = props => {
  return (
    <View style={[styles.footer, props.footerStyle]}>{props.children}</View>
  );
};
const styles = StyleSheet.create({
  footer: {
    width: windowWidth,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.small,
    // borderTopLeftRadius: BORDER.roundedCornerInput,
    // borderTopRightRadius: BORDER.roundedCornerInput,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 12,
  },
});

export default Footer;
