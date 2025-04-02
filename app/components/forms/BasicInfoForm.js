import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import RoundedInput from '../cores/RoundedInput';
import RoundedButton from '../cores/RoundedButton';
import useInput from '../../hooks/useInput';
import {UserContext} from '../../provider/UserProvider';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from '../../constants/Collections';

const BasicInfoForm = props => {
  const userCtx = useContext(UserContext);
  const usersCollection = firestore().collection(COLLECTION.USERS);
  const [icon, setIcon] = useState('eye-off');
  const [icon1, setIcon1] = useState('eye-off');
  const [showPass, setShowPass] = useState(true);
  const [showPass1, setShowPass1] = useState(true);
  const [existEmail, setExistEmail] = useState(false);

  const showPassword = () => {
    if (icon === 'eye-off') {
      setIcon('eye');
      setShowPass(false);
    } else {
      setIcon('eye-off');
      setShowPass(true);
    }
  };

  const showPassword1 = () => {
    if (icon1 === 'eye-off') {
      setIcon1('eye');
      setShowPass1(false);
    } else {
      setIcon1('eye-off');
      setShowPass1(true);
    }
  };

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueInputChangeHandler: emailChangeHandler,
    valueInputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(value => value.includes('@'));

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueInputChangeHandler: passwordChangeHandler,
    valueInputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(value => value.trim().length >= 8);

  const {
    value: confirmPassword,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueInputChangeHandler: confirmPasswordChangeHandler,
    valueInputBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPassword,
  } = useInput(value => value.trim() === password && value.trim() !== '');

  const formIsValid = emailIsValid && passwordIsValid && confirmPasswordIsValid;

  const handleSubmit = async () => {
    const existEmail = await usersCollection.where('email', '==', email).get();
    if (!formIsValid) {
      return;
    }
    if (!existEmail.empty) {
      setExistEmail(true);
      return;
    }
    userCtx.user = {
      email,
      password,
    };
    props.onSubmit();
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SPACING.xxx_large,
        }}>
        <Text style={styles.createText}>Create an account.</Text>
        <Text style={styles.basicText}>Basic Information</Text>
        <Text style={styles.formSub}>
          Enter your information below to get started.
        </Text>
        <View style={styles.fieldContainer}>
          <View
            style={[styles.inputContainer, {marginBottom: -SPACING.x_small}]}>
            <Text style={styles.sectionLabel}>E-mail</Text>
            <RoundedInput
              value={email}
              onBlur={emailBlurHandler}
              onChangeText={val => {
                setExistEmail(false);
                emailChangeHandler(val);
              }}
              placeholder="Enter e-mail address"
              // validateError={{
              //   hasError: emailHasError,
              //   errorText: 'Invalid email.',
              // }}
            />
          </View>
          {emailHasError && (
            <Text style={styles.errorText}>Invalid email.</Text>
          )}
          {existEmail && (
            <Text style={styles.errorText}>Email already exist.</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.sectionLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <RoundedInput
                value={password}
                onBlur={passwordBlurHandler}
                onChangeText={passwordChangeHandler}
                placeholder="Password"
                secureTextEntry={showPass}
                // validateError={{
                //   hasError: passwordHasError,
                //   errorText: 'Must be atleast 8 characters.',
                // }}
                style={styles.inputStyle}
              />
              <TouchableOpacity onPress={() => showPassword()}>
                <Icon
                  name={icon}
                  size={SIZES.iconSize.small}
                  color={COLORS.darkgray}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {passwordHasError && (
              <Text style={styles.errorText}>
                Must be atleast 8 characters.
              </Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.sectionLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <RoundedInput
                value={confirmPassword}
                onBlur={confirmPasswordBlurHandler}
                onChangeText={confirmPasswordChangeHandler}
                placeholder="Confirm password"
                secureTextEntry={showPass1}
                // validateError={{
                //   hasError: confirmPasswordHasError,
                //   errorText: 'Password did not match.',
                // }}
                style={styles.inputStyle}
              />
              <TouchableOpacity onPress={() => showPassword1()}>
                <Icon
                  name={icon1}
                  size={SIZES.iconSize.small}
                  color={COLORS.darkgray}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordHasError && (
              <Text style={styles.errorText}>Password did not match.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <RoundedButton
          text="Next"
          disabled={!formIsValid}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  createText: {
    ...FONTS.bold,
    fontSize: SIZES._32px,
    color: COLORS.darkGreen,
    marginBottom: SPACING.small,
  },
  basicText: {
    ...FONTS.bold,
    fontSize: SIZES._18px,
    color: COLORS.darkGreen,
  },
  formSub: {
    ...GlobalStyle.sectionSubLabel,
  },
  fieldContainer: {
    marginVertical: SPACING.x_small,
  },
  inputContainer: {
    marginTop: SPACING.small,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.4,
    borderRadius: BORDER.roundedCornerInput,
    marginTop: SPACING.x_small,
    paddingVertical: Platform.OS == 'ios' ? SPACING.small : 0,
  },
  inputStyle: {
    ...FONTS.regular,
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.medium,
    marginVertical: -windowHeight * 0.003,
  },
  icon: {
    marginRight: SPACING.small,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: '#7D7E82',
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
  },
  btnContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  invalid: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...GlobalStyle.errorText,
    marginTop: windowWidth * 0.005,
  },
});

export default BasicInfoForm;
