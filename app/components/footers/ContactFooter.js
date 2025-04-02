import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const ContactFooter = props => {
  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <Icons name="cellphone" style={styles.iconStyle}></Icons>
        <Text style={styles.txtLabel}>09883345298</Text>
      </View>
      <View style={styles.footerContainer}>
        <Icons
          name="phone"
          size={windowHeight * 0.019}
          style={styles.iconStyle}></Icons>
        <Text style={styles.txtLabel}>(082) 223 - 4435</Text>
      </View>
      <View style={styles.footerContainer}>
        <Icons
          name="email"
          size={windowHeight * 0.019}
          style={styles.iconStyle}></Icons>
        <Text style={styles.txtLabel}>support@retriever.ph</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER.roundedFooterCorderCard,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.x_small,
  },
  iconStyle: {
    marginRight: SPACING.x_small,
    color: COLORS.text,
  },
  txtLabel: {
    ...FONTS.regular,
    fontSize: windowWidth * 0.0295,
  },
});

export default ContactFooter;
