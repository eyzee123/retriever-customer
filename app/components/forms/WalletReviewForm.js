import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';

const WalletReviewForm = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Transfer with</Text>
      <View style={styles.walletContainer}>
        <Text style={styles.walletType}>Retriever Wallet</Text>
        <View style={styles.viewRight}>
          <Text style={styles.totalBalance}>₱{props.wallet_balance}</Text>
          <Text style={styles.txtBalance}>Balance</Text>
        </View>
      </View>
      <Text style={styles.sectionLabel}>Amount to be sent</Text>
      <View style={styles.walletContainer}>
        <Text style={styles.walletType}>Total Amount</Text>
        <Text style={styles.totalAmountSent}>₱{props.amount_sent}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginBottom: SPACING.small,
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.3,
    borderRadius: BORDER.roundedCornerInput,
    marginBottom: SPACING.large,
  },
  walletType: {
    ...FONTS.regular,
    flex: 1,
    color: COLORS.darkGreen,
  },
  viewRight: {
    alignItems: 'flex-end',
  },
  totalBalance: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  txtBalance: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  totalAmountSent: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
});

export default WalletReviewForm;
