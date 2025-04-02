import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import RoundedInput from '../../components/cores/RoundedInput';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import Header from '../../components/headers/Header';
import useInput from '../../hooks/useInput';
import {UserContext} from '../../provider/UserProvider';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {showSuccessMessage} from '../../utils/FlashMessage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {windowWidth} from '../../utils/Dimensions';

const ChangePassword = ({navigation}) => {
  const userCtx = useContext(UserContext);
  const [icon, setIcon] = useState('eye-off');
  const [showPass, setShowPass] = useState(true);
  const [icon1, setIcon1] = useState('eye-off');
  const [showPass1, setShowPass1] = useState(true);

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

  const formIsValid = passwordIsValid && confirmPasswordIsValid;

  const submitHandler = () => {
    if (!formIsValid) {
      return;
    }
    userCtx.updateUserPassword(password).then(res => {
      if (!res) {
        console.log('update password error ', res.error);
        return;
      }
      resetPassword();
      resetConfirmPassword();
      showSuccessMessage('Password updated.');
      navigation.goBack();
    });
  };
  return (
    <MainScreen>
      <Header title="Reset Password" />
      <MainFrame fullscreen>
        <LoadingOverlay visible={userCtx.isLoading} />
        <View style={styles.container}>
          {/*  <Text style={styles.sectionLabel}>Old Password</Text>
          <RoundedInput
            value={password}
            onBlur={passwordBlurHandler}
            onChangeText={passwordChangeHandler}
            placeholder="Enter your old password."
            secureTextEntry={true}
            validateError={{
              hasError: passwordHasError,
              errorText: 'Must be atleast 8 characters.',
            }}
          /> */}
          <Text style={styles.subTitle}>Create new password</Text>
          <Text style={styles.sectionSub}>
            Make sure to provide a strong password.
          </Text>
          <Text style={styles.sectionLabel}>New password</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputContainerWrapper}>
              <RoundedInput
                value={password}
                onBlur={passwordBlurHandler}
                onChangeText={passwordChangeHandler}
                placeholder="Enter your new password"
                secureTextEntry={showPass}
                inputStyle={styles.inputStyle}
              />
            </View>
            <TouchableOpacity onPress={() => showPassword()}>
              <Icon
                name={icon}
                size={SIZES.iconSize.small}
                color={COLORS.grayText}
                style={styles.iconCard}
              />
            </TouchableOpacity>
          </View>
          {passwordHasError && (
            <Text style={styles.errorText}>Must be atleast 8 characters.</Text>
          )}
          <Text style={styles.sectionLabel}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <View style={styles.inputContainerWrapper}>
              <RoundedInput
                value={confirmPassword}
                onBlur={confirmPasswordBlurHandler}
                onChangeText={confirmPasswordChangeHandler}
                placeholder="Re-type new password"
                secureTextEntry={showPass1}
                inputStyle={styles.inputStyle}
              />
            </View>
            <TouchableOpacity onPress={() => showPassword1()}>
              <Icon
                name={icon1}
                size={SIZES.iconSize.small}
                color={COLORS.grayText}
                style={styles.iconCard}
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordHasError && (
            <Text style={styles.errorText}>Both passwords must match.</Text>
          )}
        </View>
      </MainFrame>
      <View style={styles.btnContainer}>
        <RoundedButton
          disabled={!formIsValid}
          text="Change Password"
          onPress={submitHandler}
        />
      </View>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.medium,
  },
  subTitle: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    fontSize: SIZES._18px,
  },
  sectionLabel: {
    ...FONTS.bold,
    color: COLORS.subTextColor1,
    marginTop: SPACING.small,
    marginBottom: SPACING.x_small,
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
    marginBottom: SPACING.small,
  },
  btnContainer: {
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray1,
    borderRadius: BORDER.roundedCornerInput,
  },
  inputContainerWrapper: {
    flex: 1,
  },
  inputStyle: {
    borderColor: 'transparent',
    borderWidth: 0,
    marginVertical: 0,
  },
  iconCard: {
    marginRight: SPACING.small,
    transform: [{rotate: '180deg'}],
  },
  errorText: {
    ...GlobalStyle.errorText,
    marginTop: windowWidth * 0.005,
  },
});

export default ChangePassword;
