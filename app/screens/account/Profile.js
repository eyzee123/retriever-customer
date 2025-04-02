import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import RoundedInput from '../../components/cores/RoundedInput';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChangeEmail from '../../components/modals/ChangeEmail';
import ChangePhone from '../../components/modals/ChangePhone';
import {
  clearLocalData,
  getLocalDataObject,
  storeLocalDataObject,
} from '../../services/Storage/LocalStorageService';
import {LOCAL_STORAGE} from '../../constants/ProjectConstants';
import {ROUTES} from '../../constants/Routes';
import Header from '../../components/headers/Header';
import UserAvatar from 'react-native-user-avatar';
import SuccessDialogue from '../../components/modals/SuccessDialogue';
import {UserContext} from '../../provider/UserProvider';
import ConfirmationDialogue from '../../components/modals/ConfirmationDialogue';
import auth from '@react-native-firebase/auth';
import RNExitApp from 'react-native-exit-app';
import NetInfo from '@react-native-community/netinfo';

const Profile = ({navigation}) => {
  const userCtx = useContext(UserContext);
  const [openModalChangeEmail, setOpenModalChangeEmail] = useState(false);
  const [openModalChangePass, setOpenModalChangePass] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalLogout, setModalLogout] = useState(false);

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModalSuccessEmail, setModalSuccessEmail] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [showModalNoInternet, setModalNoInternet] = useState(false);

  useEffect(() => {
    getUserFromLocationStorage();
    userCtx.getUsersRequest().then(res => {
      methods(res);
    });
  }, []);

  const methods = async response => {
    try {
      await auth().currentUser.reload();
    } catch (error) {
      const localUser = await getLocalDataObject(LOCAL_STORAGE.USER);
      if (localUser) {
        if (!response.success) {
          if (Platform.OS === 'android') {
            NetInfo.fetch().then(isConnected => {
              if (isConnected.isConnected) {
                setModalSuccessEmail(true);
              }
              if (!isConnected.isConnected) {
                setModalNoInternet(true);
              }
            });
          } else {
            // For iOS devices
            NetInfo.addEventListener(isConnected => {
              if (isConnected.isConnected) {
                setModalSuccessEmail(true);
              }
              if (!isConnected.isConnected) {
                setModalNoInternet(true);
              }
            });
          }
        }
      }
      console.log(error);
    }
  };

  const getUserFromLocationStorage = async () => {
    try {
      await userCtx.getUser();
      const localUser = await getLocalDataObject(LOCAL_STORAGE.USER);
      setUser(localUser);
      //re-construct user object
      const fullname = `${localUser.firstName} ${localUser.lastName}`;

      let temp_contact = localUser.contactNumber;
      const contactNumber = temp_contact.substring(3, 13);
      //

      const userInfo = {
        fullname,
        contactNumber,
        email: localUser.email,
        birthDate: localUser.birthDate,
      };
      setCurrentUser(userInfo);
    } catch (e) {
      console.log(e);
    }
  };

  const updateEmailHandler = async newEmail => {
    await storeLocalDataObject(LOCAL_STORAGE.USER, {
      ...user,
      email: newEmail,
    });
    setCurrentUser(prevState => {
      return {
        ...prevState,
        email: newEmail,
      };
    });
    setOpenModalSuccess(true);
  };

  const errorResponse = error => {
    console.log(error);
    if (!error) {
      return;
    }
    if (Platform.OS == 'ios') {
      Alert.alert(
        'Oops! There’s something wrong. 😭',
        "No worries, we've got you covered! For your account's security and the best experience, please log in again.",
        [
          {
            text: 'Login now',
            onPress: () => signOut1(),
          },
        ],
        {cancelable: false},
      );
    } else {
      setErrorModal(true);
    }
  };

  const updatePhoneHandler = async newContact => {
    navigation.navigate(ROUTES.CHANGE_PHONE_OTP, {phoneNumber: newContact});
  };

  const signOut = async () => {
    userCtx.signout().then(res => {
      if (!res.success) {
        console.log(res.error);
        return;
      }
      userCtx.setCurrentUser(null);
      userCtx.dispatchUser({
        type: 'AUTH',
        payload: {user: null, isLoggedIn: false},
      });
      clearLocalData(LOCAL_STORAGE.USER);
      console.log('logout success');
      navigation.replace(ROUTES.LOGIN);

      setModalLogout(false);
    });
    userCtx.setIsAccountDeleted(false);
  };

  const signOut1 = () => {
    userCtx.setCurrentUser(null);
    userCtx.dispatchUser({
      type: 'AUTH',
      payload: {user: null, isLoggedIn: false},
    });
    setModalSuccessEmail(false);
    setErrorModal(false);
    clearLocalData(LOCAL_STORAGE.USER);
    console.log('logout success');
    navigation.replace(ROUTES.LOGIN);
    userCtx.setIsAccountDeleted(false);
  };

  const exitApp = () => {
    Platform.OS === 'ios' ? RNExitApp.exitApp() : BackHandler.exitApp();
  };

  return (
    <MainScreen>
      <Header title="My Profile" />
      <ConfirmationDialogue
        title="Logging out? 🙁"
        body="Feel free to come back again soon. We are always ready to serve you."
        onCancelButtonText="Cancel"
        confirmButtonText="Logout"
        showModal={openModalLogout}
        onConfirm={signOut}
        onCancel={() => setModalLogout(false)}
        logout
      />
      <SuccessDialogue
        noBackdropPress
        showModal={showModalSuccessEmail}
        title="Email Successfully Updated 👌"
        body={
          'Your email is now updated. Login your new email after this text.'
        }
        confirmButtonText="Login now"
        onConfirm={signOut1}
      />
      <SuccessDialogue
        noBackdropPress
        showModal={showErrorModal}
        title="Oops! There’s something wrong. 😭"
        body={
          "No worries, we've got you covered! For your account's security and the best experience, please log in again."
        }
        confirmButtonText="Login Now"
        onConfirm={signOut1}
      />
      <SuccessDialogue
        noBackdropPress
        showModal={showModalNoInternet}
        title="No Internet Connection 📶"
        body={
          'Please check your connection and try again. App will automatically load with good connection.'
        }
        confirmButtonText="Exit Application"
        onConfirm={exitApp}
      />
      <ChangeEmail
        onErrorResponse={errorResponse}
        // onEmailUpdate={() => setOpenModalSuccess(true)}
        showModal={openModalChangeEmail}
        closeModal={() => setOpenModalChangeEmail(false)}
      />
      <ChangePhone
        onPhoneNumberUpdate={updatePhoneHandler}
        showModal={openModalChangePass}
        closeModal={() => setOpenModalChangePass(false)}
      />
      <MainFrame fullscreen>
        <ScrollView>
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              <UserAvatar
                size={windowHeight * 0.12}
                name={currentUser?.fullname}
                textColor={COLORS.black}
                bgColor={COLORS.lightGray1}
              />
            </View>
            <Text style={[styles.sectionLabel, {marginTop: 0}]}>Name</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputContainerWrapper}>
                <RoundedInput
                  value={currentUser?.fullname}
                  placeholder="Full Name"
                  inputStyle={styles.inputStyle}
                  editable={false}
                />
              </View>
            </View>
            <Text style={styles.sectionLabel}>E-mail</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputContainerWrapper}>
                <RoundedInput
                  value={currentUser?.email}
                  placeholder="Email"
                  inputStyle={styles.inputStyle}
                  editable={false}
                />
              </View>
              <Icon
                name="pencil-box-outline"
                size={SIZES.iconSize.medium}
                color={COLORS.grayText}
                style={{marginRight: SPACING.small}}
                onPress={() => setOpenModalChangeEmail(true)}
              />
            </View>
            <Text style={styles.sectionLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.countryCode}>+ 63</Text>
              </View>
              <View style={styles.inputContainerWrapper}>
                <RoundedInput
                  value={currentUser?.contactNumber}
                  placeholder="Phone number"
                  inputStyle={styles.inputStyle}
                  editable={false}
                />
              </View>
              <Icon
                name="pencil-box-outline"
                size={SIZES.iconSize.medium}
                color={COLORS.grayText}
                style={{marginRight: SPACING.small}}
                onPress={() => setOpenModalChangePass(true)}
              />
            </View>
            <Text style={styles.sectionLabel}>Date of Birth</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputContainerWrapper}>
                <RoundedInput
                  placeholder="DD/MM/YYYY"
                  value={currentUser?.birthDate}
                  inputStyle={styles.inputStyle}
                  editable={false}
                />
              </View>
            </View>
            <Text style={[styles.sectionLabel, {marginBottom: 0}]}>
              Referral
            </Text>
            <Text style={styles.refer}>
              Want some treats? Let your friends use this refferal code when
              they register.
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputContainerWrapper}>
                <RoundedInput
                  value="N/A"
                  inputStyle={styles.inputStyle}
                  editable={false}
                />
              </View>
              <Icon
                name="card-multiple"
                size={SIZES.iconSize.small}
                color={COLORS.grayText}
                style={styles.iconCard}
              />
            </View>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <RoundedButton
              icon="lock"
              text="Reset Password"
              outline
              btnStyle={styles.btnStyle}
              iconStyle={styles.iconStyle}
              btnTextContainer={{justifyContent: 'flex-start'}}
              btnText={{...FONTS.regular}}
              onPress={() => navigation.navigate(ROUTES.CHANGE_PASSWORD)}
            />
            <RoundedButton
              icon="trash-can"
              text="Delete Account"
              outline
              btnStyle={styles.btnStyle}
              iconStyle={styles.iconStyle}
              btnTextContainer={{justifyContent: 'flex-start'}}
              btnText={{...FONTS.regular}}
              onPress={() => navigation.navigate(ROUTES.DELETE_ACCOUNT)}
            />
            <RoundedButton
              icon="logout"
              text="Logout"
              outline
              btnStyle={[styles.btnStyle, {marginBottom: SPACING.medium}]}
              iconStyle={[styles.iconStyle, {transform: [{rotate: '180deg'}]}]}
              btnTextContainer={{justifyContent: 'flex-start'}}
              btnText={{...FONTS.regular}}
              onPress={() => setModalLogout(true)}
            />
          </View>
        </ScrollView>
      </MainFrame>
    </MainScreen>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
  },
  sectionLabel: {
    ...FONTS.bold,
    color: COLORS.subTextColor1,
    marginTop: SPACING.small,
    marginBottom: SPACING.x_small,
  },
  inputStyle: {
    borderColor: 'transparent',
    borderWidth: 0,
    marginVertical: 0,
  },
  sectionTitle: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    fontSize: SIZES._16px,
    marginTop: SPACING.x_large,
    marginBottom: SPACING.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray1,
    borderRadius: BORDER.roundedCornerInput,
  },
  countryCodeContainer: {
    borderRightColor: COLORS.subTextColor1,
    borderRightWidth: 1,
  },
  countryCode: {
    ...FONTS.regular,
    color: COLORS.subTextColor1,
    marginHorizontal: SPACING.small,
  },
  inputContainerWrapper: {
    flex: 1,
  },
  refer: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    marginBottom: SPACING.x_small,
  },
  iconCard: {
    marginRight: SPACING.small,
    transform: [{rotate: '180deg'}],
  },
  btnStyle: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 0.3,
    paddingHorizontal: 0,
    paddingTop: SPACING.x_small,
  },
  iconStyle: {
    color: COLORS.darkGreen,
    marginRight: SPACING.small,
  },
});

export default Profile;
