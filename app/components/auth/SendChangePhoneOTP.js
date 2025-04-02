import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RoundedInput from '../../components/cores/RoundedInput';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import useInput from '../../hooks/useInput';
import useCountDown from '../../hooks/useCountDown';
import {BUTTON} from '../../constants/ProjectConstants';
import RoundedButton from '../cores/RoundedButton';
import {LoadingOverlay} from '../general/LoadingIndicator';
import auth from '@react-native-firebase/auth';

const SendChangePhoneOTP = props => {
  const {counter, setCounter, isCounting, setIsCounting} = useCountDown(30);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  let phoneNumber = props.phoneNumber;

  const otp_1 = useRef();
  const otp_2 = useRef();
  const otp_3 = useRef();
  const otp_4 = useRef();
  const otp_5 = useRef();
  const otp_6 = useRef();

  const {value: codeInput_1, valueInputChangeHandler: codeInput_1Handler} =
    useInput(value => value.trim() !== '');
  const {value: codeInput_2, valueInputChangeHandler: codeInput_2Handler} =
    useInput(value => value.trim() !== '');
  const {value: codeInput_3, valueInputChangeHandler: codeInput_3Handler} =
    useInput(value => value.trim() !== '');
  const {value: codeInput_4, valueInputChangeHandler: codeInput_4Handler} =
    useInput(value => value.trim() !== '');
  const {value: codeInput_5, valueInputChangeHandler: codeInput_5Handler} =
    useInput(value => value.trim() !== '');
  const {value: codeInput_6, valueInputChangeHandler: codeInput_6Handler} =
    useInput(value => value.trim() !== '');

  const sendOtp = async (resend = false) => {
    setIsLoading(true);
    console.log(phoneNumber, resend);
    try {
      const confirm = await auth()
        .verifyPhoneNumber(phoneNumber)
        .catch(error => props.onError(error.code));

      setIsLoading(false);
      setConfirmation(confirm);
      countDown();
    } catch (error) {
      setIsLoading(false);
      console.log('sendOTP error', error);
    }
  };

  const confirmOtp = async () => {
    setIsLoading(true);
    const code = `${codeInput_1}${codeInput_2}${codeInput_3}${codeInput_4}${codeInput_5}${codeInput_6}`;
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirmation.verificationId,
        code,
      );
      await auth().currentUser.updatePhoneNumber(credential);
      setIsLoading(false);
      props.onSuccess(phoneNumber);
    } catch (error) {
      setIsLoading(false);
      props.onError(error.code);
    }
  };

  const countDown = () => {
    setCounter(counter => counter - 1);
    setIsCounting(true);
  };

  const resendErrorStyle = isCounting && {color: COLORS.disabled};

  useEffect(() => {
    if (phoneNumber) {
      sendOtp(true);
    }
  }, []);

  return (
    <View style={styles.confirmOtp}>
      <LoadingOverlay visible={isLoading} textContent="LOADING..." />
      <Text style={styles.OTPText}>OTP Verification</Text>
      <Text style={styles.enterPhoneText}>Enter the OTP</Text>
      <Text style={styles.verifySub}>
        Code is Sent to
        <Text style={styles.contactNo}> {phoneNumber}</Text>
      </Text>
      <View style={styles.otpContainer}>
        <View style={styles.otpInput}>
          <RoundedInput
            keyboardType="numeric"
            value={codeInput_1}
            onChangeText={value => {
              if (value.length >= 1) {
                otp_2.current?.focus();
              } else {
                otp_1.current?.blur();
              }
              codeInput_1Handler(value);
            }}
            maxLength={1}
            height={windowHeight * 0.08}
            width={windowWidth * 0.13}
            inputStyle={styles.otpStyle}
            ref={otp_1}
          />
          <RoundedInput
            keyboardType="numeric"
            value={codeInput_2}
            onChangeText={value => {
              if (value.length >= 1) {
                otp_3.current?.focus();
              } else {
                otp_1.current?.focus();
              }
              codeInput_2Handler(value);
            }}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace') {
                otp_1.current?.focus();
              }
            }}
            maxLength={1}
            height={windowHeight * 0.08}
            width={windowWidth * 0.13}
            inputStyle={styles.otpStyle}
            ref={otp_2}
          />
          <RoundedInput
            keyboardType="numeric"
            value={codeInput_3}
            onChangeText={value => {
              if (value.length >= 1) {
                otp_4.current?.focus();
              } else {
                otp_2.current?.focus();
              }
              codeInput_3Handler(value);
            }}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace') {
                otp_2.current?.focus();
              }
            }}
            maxLength={1}
            height={windowHeight * 0.08}
            width={windowWidth * 0.13}
            inputStyle={styles.otpStyle}
            ref={otp_3}
          />
          <RoundedInput
            keyboardType="numeric"
            value={codeInput_4}
            onChangeText={value => {
              if (value.length >= 1) {
                otp_5.current?.focus();
              } else {
                otp_3.current?.focus();
              }
              codeInput_4Handler(value);
            }}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace') {
                otp_3.current?.focus();
              }
            }}
            maxLength={1}
            height={windowHeight * 0.08}
            width={windowWidth * 0.13}
            inputStyle={styles.otpStyle}
            ref={otp_4}
          />
          <RoundedInput
            keyboardType="numeric"
            value={codeInput_5}
            onChangeText={value => {
              if (value.length >= 1) {
                otp_6.current?.focus();
              } else {
                otp_4.current?.focus();
              }
              codeInput_5Handler(value);
            }}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace') {
                otp_4.current?.focus();
              }
            }}
            maxLength={1}
            height={windowHeight * 0.08}
            width={windowWidth * 0.13}
            inputStyle={styles.otpStyle}
            ref={otp_5}
          />
          <RoundedInput
            keyboardType="numeric"
            value={codeInput_6}
            onChangeText={value => {
              if (value.length >= 1) {
                otp_6.current?.blur();
              } else {
                otp_5.current?.focus();
              }
              codeInput_6Handler(value);
            }}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace') {
                otp_5.current?.focus();
              }
            }}
            maxLength={1}
            height={windowHeight * 0.08}
            width={windowWidth * 0.13}
            inputStyle={styles.otpStyle}
            ref={otp_6}
          />
        </View>
        <Text style={styles.didntText}>Didn’t recieve a code?</Text>
        <TouchableOpacity
          onPress={sendOtp.bind(this, true)}
          disabled={isCounting}>
          <Text style={[styles.resendText, resendErrorStyle]}>
            Resend Code ({counter})
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <RoundedButton text={BUTTON.BTN_CONFIRM_OTP} onPress={confirmOtp} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  OTPText: {
    ...FONTS.bold,
    fontSize: SIZES._32px,
    color: COLORS.darkGreen,
    marginBottom: SPACING.small,
  },
  enterPhoneText: {
    ...FONTS.bold,
    fontSize: SIZES._18px,
    color: COLORS.darkGreen,
  },
  verifySub: {
    ...GlobalStyle.sectionSubLabel,
  },
  contactNo: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.darkgray,
  },
  otpContainer: {
    paddingVertical: SPACING.xx_large,
  },
  otpInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: SPACING.x_large,
  },
  otpStyle: {
    fontSize: windowHeight * 0.03,
    textAlign: 'center',
    marginHorizontal: windowWidth * 0.012,
  },
  didntText: {
    ...GlobalStyle.sectionSubLabel,
    textAlign: 'center',
  },
  resendText: {
    ...FONTS.bold,
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  btnContainer: {
    // paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
});

export default SendChangePhoneOTP;
