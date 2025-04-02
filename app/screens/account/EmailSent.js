import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import Header from '../../components/headers/Header';
import {COLORS, FONTS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import Lottie from 'lottie-react-native';
import {windowHeight} from '../../utils/Dimensions';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import useCountDown from '../../hooks/useCountDown';
import auth from '@react-native-firebase/auth';
import {showErrorMessage} from '../../utils/FlashMessage';
import {ERROR} from '../../constants/Status';

const EmailSent = ({navigation, route}) => {
  const {counter, setCounter, isCounting, setIsCounting} = useCountDown(120);

  const {email} = route.params;

  const resendPasswordRestEmail = async () => {
    setCounter(counter => counter - 1);
    setIsCounting(true);
  };

  useEffect(() => {
    resendPasswordRestEmail();
  }, []);

  return (
    <MainScreen>
      <Header transparent />
      <MainFrame>
        <View style={styles.container}>
          <Text style={styles.title}>Email Sent</Text>
          <Text style={styles.subTitle}>
            An email has been sent to you. Kindly check your inbox and click the
            link in your email.
          </Text>
          <View style={styles.lottieContainer}>
            <Lottie
              resizeMode="cover"
              source={require('./../../assets/animations/email.json')}
              style={{height: windowHeight * 0.35}}
              autoPlay
              loop
            />
          </View>
        </View>
        <View style={{marginBottom: SPACING.medium}}>
          <Text style={styles.footerText}>
            Didn’t get any email?
            <Text style={{color: COLORS.orange}}> {counter}</Text>
          </Text>
          <RoundedButton
            disabled={isCounting}
            text="Resend Email Confirmation"
            onPress={resendPasswordRestEmail}
          />
          <RoundedButton
            text="Login"
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
          />
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES._32px,
    color: COLORS.darkGreen,
    marginBottom: SPACING.small,
  },
  subTitle: {
    ...FONTS.regular,
    fontSize: SIZES._16px,
    marginTop: SPACING.small,
    color: '#7D7E82',
    textAlign: 'center',
  },
  lottieContainer: {
    marginTop: Platform.OS == 'ios' ? SPACING.xx_large : SPACING.xxx_large,
  },
  footerText: {
    ...FONTS.regular,
    color: '#7D7E82',
    alignSelf: 'center',
    marginBottom: SPACING.small,
  },
});

export default EmailSent;
