import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {COLORS, FONTS, GlobalStyle, SPACING} from '../../styles/theme';
import RoundedButton from '../cores/RoundedButton';
import RoundedInput from '../cores/RoundedInput';

const WalletTransferForm = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Transfer to</Text>
      <RoundedInput placeholder="Enter Name or Mobile Number" />
      <Text style={styles.sectionLabel}>Amount</Text>
      <RoundedInput placeholder="0.00" />
      <View style={styles.btnContainer}>
        <View style={[styles.btnWrapper, {marginRight: SPACING.small}]}>
          <RoundedButton
            text="₱ 100"
            btnStyle={styles.btnStyle}
            btnText={styles.btnText}
          />
        </View>
        <View style={styles.btnWrapper}>
          <RoundedButton
            text="₱ 250"
            btnStyle={styles.btnStyle}
            btnText={styles.btnText}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <View style={[styles.btnWrapper, {marginRight: SPACING.small}]}>
          <RoundedButton
            text="₱ 500"
            btnStyle={styles.btnStyle}
            btnText={styles.btnText}
          />
        </View>
        <View style={styles.btnWrapper}>
          <RoundedButton
            text="₱ 1000"
            btnStyle={styles.btnStyle}
            btnText={styles.btnText}
          />
        </View>
      </View>
      <Text style={styles.sectionLabel}>Message</Text>
      <RoundedInput placeholder="(Optional)" multiline={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: SPACING.small,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginTop: SPACING.small,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btnWrapper: {
    flex: 1,
  },
  btnStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.3,
  },
  btnText: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
});
export default WalletTransferForm;
