import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import Header from '../../components/headers/Header';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import RoundedInput from '../../components/cores/RoundedInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SuccessDialogue from '../../components/modals/SuccessDialogue';
import {ROUTES} from '../../constants/Routes';
import {IMAGES} from '../../constants/Images';

const ResetPassword = ({navigation}) => {
  const [icon, setIcon] = useState('eye');
  const [icon1, setIcon1] = useState('eye');
  const [showPass, setShowPass] = useState(true);
  const [showPass1, setShowPass1] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const showPassword = () => {
    if (icon === 'eye-off') {
      setIcon('eye');
      setShowPass(true);
    } else {
      setIcon('eye-off');
      setShowPass(false);
    }
  };
  const showPassword1 = () => {
    if (icon1 === 'eye-off') {
      setIcon1('eye');
      setShowPass1(true);
    } else {
      setIcon1('eye-off');
      setShowPass1(false);
    }
  };

  const confirmApproved = () => {
    navigation.navigate(ROUTES.LOGIN);
    setShowToast(false);
  };

  return (
    <MainScreen>
      <Header transparent />
      <SuccessDialogue
        image={IMAGES.APPROVE}
        title="Great! Your Password has been changed."
        body="Make sure to remember or note your password to avoid forgetting it next time."
        confirmButtonText="Login Again"
        showModal={showToast}
        onConfirm={confirmApproved}
      />
      <MainFrame>
        <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subTitle}>Create new password</Text>
          <Text style={styles.sectionSub}>
            Make sure to provide a strong password.
          </Text>
          <Text style={[styles.sectionLabel, {marginTop: SPACING.medium}]}>
            Password
          </Text>
          <View style={styles.passwordContainer}>
            <RoundedInput
              placeholder="Enter your password"
              secureTextEntry={showPass}
              maxLength={20}
              inputStyle={styles.inputStyle}
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
          <Text style={[styles.sectionLabel, {marginTop: SPACING.medium}]}>
            Confirm Password
          </Text>
          <View style={styles.passwordContainer}>
            <RoundedInput
              placeholder="Enter your password"
              secureTextEntry={showPass1}
              maxLength={20}
              inputStyle={styles.inputStyle}
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
        </View>
        <View style={styles.btnContainer}>
          <RoundedButton
            text="Reset Password"
            onPress={() => setShowToast(true)}
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
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: '#7D7E82',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.4,
    borderRadius: BORDER.roundedCornerInput,
    marginTop: SPACING.x_small,
  },
  inputStyle: {
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.medium,
    marginVertical: 0,
  },
  icon: {
    marginRight: SPACING.small,
  },
  btnContainer: {
    marginBottom: Platform.OS == 'ios' ? 0 : SPACING.small,
  },
});

export default ResetPassword;
