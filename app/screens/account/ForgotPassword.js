import React, {useState} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import Header from '../../components/headers/Header';
import {COLORS, FONTS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import RoundedInput from '../../components/cores/RoundedInput';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import {ERROR} from '../../constants/Status';
import {showErrorMessage} from '../../utils/FlashMessage';
import auth from '@react-native-firebase/auth';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');

  const submitResetEmailHandler = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      navigation.navigate(ROUTES.EMAIL_SENT, {email});
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        showErrorMessage(ERROR.USER_NO_RECORD);
      } else {
        showErrorMessage(ERROR.DEFAULT_ERROR);
      }
    }
  };

  return (
    <MainScreen>
      <Header transparent />
      <MainFrame>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subTitle}>Enter your account email</Text>
          <Text style={styles.sectionSub}>
            You will receive verification in your email after this.
          </Text>
          <Text style={[styles.sectionLabel, {marginTop: SPACING.medium}]}>
            Email
          </Text>
          <RoundedInput
            placeholder="Enter your email"
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={styles.btnContainer}>
          <RoundedButton
            text="Submit"
            onPress={submitResetEmailHandler}
            disabled={email ? false : true}
          />
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES._32px,
    color: COLORS.darkGreen,
    marginBottom: SPACING.small,
  },
  subTitle: {
    ...FONTS.bold,
    marginTop: SPACING.x_small,
    color: COLORS.darkGreen,
    fontSize: SIZES._18px,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: '#7D7E82',
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
  },
  btnContainer: {
    marginBottom: Platform.OS == 'ios' ? 0 : SPACING.small,
  },
});

export default ForgotPassword;
