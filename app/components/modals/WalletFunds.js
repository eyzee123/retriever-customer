import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import TrophyIllustration from '../../assets/images/svg/throphy.svg';
import RoundedButton from '../cores/RoundedButton';
import {windowHeight} from '../../utils/Dimensions';

const WalletFunds = props => {
  return (
    <Modal
      isVisible={true}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}>
      <View style={styles.contentContainer}>
        <View style={styles.svgContainer}>
          <TrophyIllustration height="100%" />
        </View>
        <View style={styles.container}>
          <Text style={styles.sectionLabel}>
            Retriever Wallet funds have been topped up!
          </Text>
          <Text style={styles.sectionSub}>
            Congratulations! You have succesfully added{' '}
            <Text style={styles.topUp}>₱250</Text> to your Retriever Wallet
            Funds.
          </Text>
          <View style={styles.buttonContainer}>
            <RoundedButton
              icon="undo"
              text="Back to Retriever Wallet"
              btnStyle={styles.btnStyle}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    borderRadius: BORDER.roundedCornerPopupCard,
    backgroundColor: COLORS.cardBackground,
    paddingTop: SPACING.small,
  },
  svgContainer: {
    height: windowHeight * 0.15,
  },
  container: {
    width: '100%',
    padding: SPACING.medium,
    borderRadius: BORDER.roundedCornerPopupCard,
    backgroundColor: COLORS.white,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.orange,
  },
  sectionSub: {
    ...FONTS.regular,
    textAlign: 'justify',
    fontSize: SIZES.x_small,
    color: COLORS.darkGreen,
    marginVertical: SPACING.x_small,
  },
  topUp: {
    ...FONTS.bold,
    fontSize: SIZES.x_small,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.medium,
  },
  btnStyle: {
    borderRadius: BORDER.circle,
  },
});
export default WalletFunds;
