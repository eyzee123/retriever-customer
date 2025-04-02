import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import RoundedInput from '../../components/cores/RoundedInput';
import WalletHeader from '../../components/headers/WalletHeader';
import PaymentMethod from '../../components/modals/PaymentMethod';
import {ROUTES} from '../../constants/Routes';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';

const WalletTopUp = ({navigation}) => {
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const clickToShowPayment = () => {
    setOpenModalPayment(true);
  };
  const clickToClosePayment = () => {
    setOpenModalPayment(false);
  };
  return (
    <MainScreen>
      <WalletHeader
        plain
        title="Top up"
        onBackButtonPressed={() => navigation.goBack()}
      />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <Text style={styles.sectionLabel}>Set Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.pesoSign}>₱</Text>
            <RoundedInput placeholder="0.00" inputStyle={styles.inputStyle} />
          </View>
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
          <TouchableOpacity
            style={styles.paymentContainer}
            onPress={clickToShowPayment}>
            <Icon
              name="cash-multiple"
              size={SIZES.iconSize.x_small}
              color={COLORS.orange}
            />
            <Text style={styles.paymentType}>Payment Method</Text>
            <Text style={styles.selectPaymentMethod}>
              Select a payment method
            </Text>
          </TouchableOpacity>
        </View>
      </MainFrame>
      <PaymentMethod
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        showModal={openModalPayment}
        closeModal={clickToClosePayment}
        onPress={() => navigation.navigate(ROUTES.ADD_CARD)}
      />
      <View style={styles.btnFooterContainer}>
        <RoundedButton
          text="Pay Now"
          onPress={() =>
            navigation.navigate(ROUTES.WALLET_SUCCESS, {
              transactType: '',
              modeOfTransaction: 'Gcash',
            })
          }
        />
      </View>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginBottom: SPACING.x_small,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.x_small,
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.4,
    borderRadius: BORDER.roundedCornerInput,
    marginBottom: SPACING.x_small,
  },
  pesoSign: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginLeft: SPACING.x_small,
  },
  inputStyle: {
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingRight: SPACING.large,
    marginVertical: 0,
    paddingHorizontal: SPACING.x_small,
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: SPACING.small,
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
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.3,
    borderRadius: BORDER.roundedCornerInput,
    marginTop: SPACING.medium,
  },
  paymentType: {
    ...FONTS.bold,
    flex: 1,
    color: COLORS.darkGreen,
    marginLeft: SPACING.small,
  },
  selectPaymentMethod: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  btnFooterContainer: {
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
});

export default WalletTopUp;
