import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
  Platform,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import {IMAGES} from '../../constants/Images';

const WalletSuccess = ({route, navigation}) => {
  const {transactionType} = route.params;
  const {modeOfTransaction} = route.params;
  return (
    <MainScreen>
      <SafeAreaView style={{backgroundColor: COLORS.orange}}>
        <ImageBackground
          resizeMode="cover"
          source={IMAGES.WALLET_BACKGROUD}
          style={styles.imageBackground}>
          <MainFrame contentStyle={styles.container}>
            <Image
              resizeMode="stretch"
              source={IMAGES.WALLET_RECEIPT}
              style={styles.walletReceipt}
            />
            <View style={styles.containerWrapper}>
              <View style={styles.imageIcon}>
                <Image
                  resizeMode="stretch"
                  source={IMAGES.SUCCESS}
                  style={{height: '100%', width: '100%'}}
                />
              </View>

              {transactionType == 'Amount' ? (
                <>
                  <Text
                    style={[styles.sectionLabel, {marginTop: SPACING.small}]}>
                    Successfully Sent
                  </Text>
                  <View style={styles.contactContainer}>
                    <Text style={styles.contactName}>Kadin Philips</Text>
                    <Text style={styles.contactNo}> 0915 123 2341</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.sectionLabel}>Top Up Success</Text>
                  <View style={{marginBottom: SPACING.x_large}} />
                </>
              )}
              <View style={styles.walletContainer}>
                <Text style={styles.txtAmount}>{modeOfTransaction}</Text>
                <Text style={styles.amount}>₱100</Text>
              </View>
              <View style={styles.walletContainer}>
                <Text style={styles.txtTotal}>Total</Text>
                <Text style={styles.total}>₱100</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.referenceDateType}>Ref No. 100102341</Text>
                <Text style={styles.referenceDateType}>
                  Aug 14, 2022 12:31 AM
                </Text>
                <Text style={styles.referenceDateType}>Retriever Top up</Text>
              </View>
              <Image
                resizeMode="stretch"
                source={IMAGES.ADS}
                style={styles.image}
              />
              <View style={styles.btnContainer}>
                <RoundedButton
                  text="Done"
                  onPress={() => navigation.navigate(ROUTES.FOOD)}
                />
              </View>
            </View>
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
    marginTop: Platform.OS == 'ios' ? -windowHeight * 0.07 : 0,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletReceipt: {
    position: 'absolute',
    height: '80%',
    width: '100%',
  },
  imageIcon: {
    height: windowHeight * 0.065,
    width: windowHeight * 0.08,
  },
  image: {
    height: windowHeight * 0.085,
    width: windowWidth * 0.7,
    marginVertical: SPACING.medium,
  },
  containerWrapper: {
    alignItems: 'center',
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._24px,
    color: COLORS.darkGreen,
  },
  contactContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.small,
  },
  contactName: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  contactNo: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  walletContainer: {
    width: windowWidth * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.3,
    borderRadius: BORDER.roundedCornerInput,
    marginTop: SPACING.small,
  },
  txtAmount: {
    ...FONTS.regular,
    flex: 1,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  amount: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  txtTotal: {
    ...FONTS.bold,
    flex: 1,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  total: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  details: {
    alignItems: 'center',
    marginTop: SPACING.xxx_large,
  },
  referenceDateType: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
    marginTop: SPACING.x_small,
  },
  btnContainer: {
    width: windowWidth * 0.8,
  },
});

export default WalletSuccess;
