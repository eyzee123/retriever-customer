import React, {useContext, useState} from 'react';
import MainScreen from '../../components/containers/MainScreen';
import MainFrame from '../../components/containers/MainFrame';
import {Alert, Platform, StyleSheet, View} from 'react-native';
import {SPACING} from '../../styles/theme';
import Header from '../../components/headers/Header';
import SendChangePhoneOTP from '../../components/auth/SendChangePhoneOTP';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import {UserContext} from '../../provider/UserProvider';
import {
  clearLocalData,
  getLocalDataObject,
  storeLocalDataObject,
} from '../../services/Storage/LocalStorageService';
import {LOCAL_STORAGE} from '../../constants/ProjectConstants';
import SuccessDialogue from '../../components/modals/SuccessDialogue';
import {showErrorMessage} from '../../utils/FlashMessage';
import {ROUTES} from '../../constants/Routes';

const ChangePhoneOTP = ({navigation, route}) => {
  const {phoneNumber} = route.params;
  const userCtx = useContext(UserContext);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);

  const sendOtpSuccessHandler = async newContact => {
    const saveResponse = await userCtx.updateUserContactNumber(newContact);

    //if response error
    if (!saveResponse.success) {
      alert(saveResponse.error);
      return;
    }

    setOpenModalSuccess(true);
  };

  const onConfirm = () => {
    //if response successfull
    setOpenModalSuccess(false);
    navigation.goBack();
  };

  const sendOtpErrorHandler = errorMsg => {
    console.log(errorMsg);
    if (errorMsg == 'auth/invalid-verification-code') {
      showErrorMessage('Invalid code.');
    } else if (errorMsg == 'auth/credential-already-in-use') {
      showErrorMessage('Contact number already in use.');
    } else {
      if (Platform.OS == 'ios') {
        Alert.alert(
          'Oops! There’s something wrong. 😭',
          "No worries, we've got you covered! For your account's security and the best experience, please log in again.",
          [
            {
              text: 'Login now',
              onPress: () => signOut(),
            },
          ],
          {cancelable: false},
        );
      } else {
        setErrorModal(true);
      }
    }
  };

  const signOut = () => {
    userCtx.setCurrentUser(null);
    userCtx.dispatchUser({
      type: 'AUTH',
      payload: {user: null, isLoggedIn: false},
    });
    setErrorModal(false);
    clearLocalData(LOCAL_STORAGE.USER);
    console.log('logout success');
    navigation.replace(ROUTES.LOGIN);
    userCtx.setIsAccountDeleted(false);
  };

  return (
    <MainScreen>
      <Header transparent />
      <LoadingOverlay visible={userCtx.isLoading} textContent="LOADING..." />

      <MainFrame fullscreen>
        <SuccessDialogue
          noBackdropPress
          showModal={showErrorModal}
          title="Oops! There’s something wrong. 😭"
          body={
            "No worries, we've got you covered! For your account's security and the best experience, please log in again."
          }
          confirmButtonText="Login Again"
          onConfirm={signOut}
        />
        <SuccessDialogue
          showModal={openModalSuccess}
          title="New Phone Number Confirmed! 📱"
          body={'You have successfully changed your contact number.'}
          confirmButtonText="Okay"
          onConfirm={onConfirm}
        />
        <View style={styles.contentContainer}>
          <SendChangePhoneOTP
            onSuccess={sendOtpSuccessHandler}
            onError={sendOtpErrorHandler}
            phoneNumber={phoneNumber}
          />
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
});

export default ChangePhoneOTP;
