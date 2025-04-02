import React from 'react';
import {View, Text, StyleSheet, ImageBackground, Platform, SafeAreaView} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import WalletHeader from '../../components/headers/WalletHeader';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoundedButton from '../../components/cores/RoundedButton';
import ListTransactionHistory from '../../components/listItem/ListTransactionHistory';
import {FlatList} from 'react-native-gesture-handler';
import {ROUTES} from '../../constants/Routes';
import {IMAGES} from '../../constants/Images';

const Wallet = ({navigation}) => {
  const transactionHistory = [
    {
      transaction: 'Kapehan ni Manong Ryan',
      type: 'Payment',
      money: '- ₱230',
      date: '04 March 2022',
    },
    {
      transaction: 'Gcash',
      type: 'Top Up',
      money: '₱100',
      date: '04 March 2022',
    },
    {
      transaction: 'Online Bank Transfer',
      type: 'Top Up',
      money: '- ₱230',
      date: '04 March 2022',
    },
    {
      transaction: 'Gretchen Bator',
      type: 'Transfer',
      money: '- ₱300',
      date: '04 March 2022',
    },
    {
      transaction: 'Jollibee',
      type: 'Payment',
      money: '- ₱599',
      date: '04 March 2022',
    },
    {
      transaction: 'Minute Burger',
      type: 'Payment',
      money: '- ₱190',
      date: '04 March 2022',
    },
    {
      transaction: 'Minute Burger',
      type: 'Payment',
      money: '- ₱190',
      date: '04 March 2022',
    },
    {
      transaction: 'Minute Burger',
      type: 'Payment',
      money: '- ₱190',
      date: '04 March 2022',
    },
  ];

  return (
    <MainScreen>
      <SafeAreaView>
        <ImageBackground
          source={IMAGES.WALLET_BACKGROUD}
          resizeMode="cover"
          style={styles.imageBackground}>
          <WalletHeader
            title="Retriever Wallet"
            onBackButtonPressed={() => navigation.goBack()}>
            <Text style={styles.walletBalance}>₱100</Text>
            <View style={styles.subContainer}>
              <View style={styles.subContainerWrapper}>
                <Text style={styles.mobileNo}>09193124192</Text>
                <Icon
                  name="checkbox-multiple-blank"
                  size={SIZES.iconSize.x_small}
                  color={COLORS.white}
                  style={{transform: [{rotate: '180deg'}]}}
                />
              </View>
              <Text style={styles.userName}>Martinez Jerome</Text>
            </View>
          </WalletHeader>

          <MainFrame fullscreen>
            <FlatList
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.container}>
                  <View style={styles.btnContainer}>
                    <View
                      style={[
                        styles.btnContainerWrapper,
                        {marginRight: SPACING.small},
                      ]}>
                      <RoundedButton
                        text="Transfer"
                        icon="credit-card-multiple-outline"
                        iconStyle={styles.iconStyle}
                        btnStyle={styles.btnStyle}
                        btnText={styles.btnText}
                        onPress={() =>
                          navigation.navigate(ROUTES.WALLET_CONTACT_LIST)
                        }
                      />
                    </View>
                    <View style={styles.btnContainerWrapper}>
                      <RoundedButton
                        text="Top Up"
                        icon="credit-card-multiple-outline"
                        iconStyle={styles.iconStyle}
                        btnStyle={styles.btnStyle}
                        btnText={styles.btnText}
                        onPress={() => navigation.navigate(ROUTES.WALLET_TOPUP)}
                      />
                    </View>
                  </View>
                  <Text style={styles.sectionLabel}>Transaction History</Text>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={transactionHistory}
                    renderItem={({item, index}) => (
                      <>
                        <ListTransactionHistory
                          transaction={item.transaction}
                          type={item.type}
                          money={item.money}
                          date={item.date}
                        />
                        <View style={styles.line} />
                      </>
                    )}
                  />
                </View>
              }
            />
          </MainFrame>
        </ImageBackground>
      </SafeAreaView>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    height: windowHeight,
    paddingTop: Platform.OS == 'ios' ? windowHeight * 0.07 : 0,
    marginTop: Platform.OS == 'ios' ? -windowHeight * 0.07: 0,
  },
  walletBalance: {
    ...FONTS.bold,
    position: 'absolute',
    right: Platform.OS === 'ios' ? SPACING.small : SPACING.small,
    top: Platform.OS === 'ios' ? windowHeight * 0.015 : windowHeight * 0.025,
    fontSize: SIZES._34px,
    color: COLORS.white,
  },
  subContainer: {
    marginVertical: SPACING.medium,
    left: Platform.OS === 'ios' ? windowHeight * 0.045 : windowHeight * 0.043,
  },
  subContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileNo: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.white,
    marginRight: SPACING.x_small,
    opacity: 0.8,
  },
  userName: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.white,
  },
  image: {
    alignSelf: 'center',
    marginTop: -SPACING.small,
    height: windowHeight * 0.18,
    width: windowWidth * 1.1,
  },
  container: {
    paddingTop: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.white,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btnContainerWrapper: {
    flex: 1,
    width: '100%',
  },
  iconStyle: {
    color: COLORS.subTextColor1,
  },
  btnStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.subTextColor1,
    borderRadius: BORDER.roundedCornerInput,
    borderWidth: 0.3,
  },
  btnText: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginLeft: SPACING.x_small,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._18px,
    color: COLORS.darkGreen,
    marginVertical: SPACING.medium,
  },
  line: {
    borderBottomColor: COLORS.subTextColor1,
    borderWidth: 0.2,
    width: '100%',
    marginVertical: SPACING.medium,
  },
});

export default Wallet;
