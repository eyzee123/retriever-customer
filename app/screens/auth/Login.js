import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import RoundedInput from '../../components/cores/RoundedInput';
import RoundedButton from '../../components/cores/RoundedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CircleView from '../../components/general/CircleView';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import RetrieverLogo from '../../assets/icons/retriever-logo.svg';
import GmailIcon from '../../assets/icons/gmail-icon.svg';
import {UserContext} from '../../provider/UserProvider';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import {ROUTES} from '../../constants/Routes';
import {ERROR} from '../../constants/Status';
import {IMAGES} from '../../constants/Images';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {COLLECTION} from '../../constants/Collections';
import LinearGradient from 'react-native-linear-gradient';

const Login = ({navigation}) => {
  const userCtx = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [icon, setIcon] = useState('eye-off');
  const [showPass, setShowPass] = useState(true);

  const showPassword = () => {
    if (icon === 'eye-off') {
      setIcon('eye');
      setShowPass(false);
    } else {
      setIcon('eye-off');
      setShowPass(true);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);
  const checkAuthentication = async () => {
    if (!userCtx.isLoggedIn) {
      return;
    }
    await sendFcmToken();
    navigation.replace(ROUTES.HOME, {toast: true});
  };

  const signIn = async () => {
    if (email.trim() === '' || password.trim() === '') {
      alert(ERROR.ENTER_EMAIL_PASSWORD);
      return;
    }
    const response = await userCtx.signin(email.trim(), password);
    if (!response.success) {
      alert(response.error);
      return;
    }
    await sendFcmToken();
    navigation.replace(ROUTES.HOME, {toast: true});
  };

  const gotoSignup = () => {
    navigation.navigate(ROUTES.REGISTER);
  };

  const sendFcmToken = async () => {
    const currentUSer = auth().currentUser;
    if (!currentUSer) {
      return;
    }
    const tokensCollection = firestore().collection(COLLECTION.FCM_TOKEN);
    const date = firestore.FieldValue.serverTimestamp();

    try {
      const token = await messaging().getToken();
      console.log('register token success', token);
      const data = {
        token,
        createdAt: date,
        updatedAt: date,
      };
      const response = await tokensCollection.doc(currentUSer.uid).set(data);
      return {result: response};
    } catch (err) {
      //Do nothing
      console.log('register token error', err);
      return {result: err};
    }
  };

  return (
    <MainScreen>
      <LoadingOverlay visible={userCtx.isLoading} textContent="LOADING..." />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={IMAGES.RETRIEVER_LOGO} style={styles.logoImage} />
          <LinearGradient
            angle={45}
            useAngle
            colors={COLORS.gradientColorOrange}
            style={styles.gradientStyle}
          />
        </View>
        <MainFrame fullscreen>
          <View style={styles.container}>
            <Text style={styles.welcomeText}>Hey there! 👋</Text>
            <Text style={styles.sectionSub}>
              Enter your details below to enter the app.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.sectionLabel}>Email</Text>
              <RoundedInput
                placeholder="Enter your email here"
                value={email}
                onChangeText={text => setEmail(text)}
              />
              <Text style={styles.sectionLabel}>Password</Text>

              <View style={styles.passwordContainer}>
                <RoundedInput
                  placeholder="Enter your password here"
                  secureTextEntry={showPass}
                  value={password}
                  onChangeText={text => setPassword(text)}
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
              <TouchableOpacity
                style={{marginTop: SPACING.x_small}}
                onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <RoundedButton
              text="Log in"
              onPress={signIn}
              btnStyle={styles.btnStyle}
            />
            <View style={styles.signUpContainer}>
              <Text style={styles.createAcc}>Don’t have an account? </Text>
              <TouchableOpacity onPress={gotoSignup}>
                <Text style={[styles.createAcc, {color: COLORS.orange}]}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.lineContainer}>
              <View style={styles.line} />
              <View>
                <Text style={styles.continueWith}>or continue with</Text>
              </View>
              <View style={styles.line} />
            </View>

            <View style={styles.socmedContainer}>
              <CircleView
                containerStyle={{
                  padding: 0,
                }}>
                <Icon
                  name="facebook"
                  size={windowHeight * 0.08}
                  color={'#4267B2'}
                />
              </CircleView>
              <CircleView
                size={windowHeight * 0.07}
                containerStyle={{elevation: 3}}>
                <GmailIcon
                  height={windowHeight * 0.06}
                  width={windowWidth * 0.2}
                />
              </CircleView>
            </View> */}
          </View>
        </MainFrame>
      </ScrollView>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    height: windowHeight * 0.28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientStyle: {
    height: '100%',
    width: '100%',
  },
  logoImage: {
    position: 'absolute',
    height: windowHeight * 0.13,
    width: windowHeight * 0.21,
    zIndex: 1,
  },
  container: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
  },
  welcomeText: {
    ...FONTS.bold,
    fontSize: SIZES._32px,
    color: COLORS.darkGreen,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: '#7D7E82',
    marginTop: SPACING.x_small,
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
  },
  inputContainer: {
    marginTop: SPACING.small,
    marginBottom: SPACING.large,
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
  forgot: {
    ...FONTS.bold,
    textAlign: 'right',
    color: COLORS.orange,
    fontSize: SIZES._12px,
  },
  btnStyle: {
    marginVertical: SPACING.medium,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  createAcc: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.large,
  },
  line: {
    flex: 1,
    borderWidth: 0.2,
    opacity: 0.2,
    borderBottomColor: COLORS.subTextColor1,
  },
  continueWith: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    marginHorizontal: SPACING.small,
    opacity: 0.3,
  },
  socmedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around',
    width: '50%',
    marginVertical: SPACING.small,
    padding: SPACING.x_small,
  },
});

export default Login;
