import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import WalletHeader from '../../components/headers/WalletHeader';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WalletReviewForm from '../../components/forms/WalletReviewForm';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import {IMAGES} from '../../constants/Images';

const WalletReview = ({navigation}) => {
  return (
    <MainScreen>
      <SafeAreaView>
        <ImageBackground
          resizeMode="cover"
          source={IMAGES.WALLET_BACKGROUD}
          style={styles.imageBackground}>
          <WalletHeader
            title="Transfer"
            onBackButtonPressed={() => navigation.goBack()}>
            <View style={styles.subContainer}>
              <Icon
                name="account-circle"
                size={windowHeight * 0.12}
                color={'#D9D9D9'}
              />
              <Text style={styles.contactNo}>0915 123 2341</Text>
              <Text style={styles.contactName}>Kadin Philips</Text>
            </View>
          </WalletHeader>
          <MainFrame fullscreen>
            <View style={styles.container}>
              <WalletReviewForm wallet_balance="100" amount_sent="100" />
            </View>
          </MainFrame>
        </ImageBackground>
      </SafeAreaView>
      <View style={styles.btnContainer}>
        <RoundedButton
          text="Send ₱100"
          onPress={() =>
            navigation.navigate(ROUTES.WALLET_SUCCESS, {
              transactionType: 'Amount',
              modeOfTransaction: 'Amount',
            })
          }
        />
      </View>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    height: windowHeight,
    paddingTop: Platform.OS == 'ios' ? windowHeight * 0.07 : 0,
    marginTop: Platform.OS == 'ios' ? -windowHeight * 0.07 : 0,
  },
  subContainer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  contactNo: {
    ...FONTS.regular,
    fontSize: SIZES._16px,
    color: COLORS.white,
    marginTop: SPACING.x_small,
  },
  contactName: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.white,
  },
  image: {
    alignSelf: 'center',
    marginTop: -SPACING.small,
    height: windowHeight * 0.285,
    width: windowWidth * 1.1,
  },
  container: {
    flex: 1,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.white,
  },
  btnContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SPACING.medium,
    bottom: SPACING.small,
  },
});
export default WalletReview;
