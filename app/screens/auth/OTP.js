import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {COLORS, SPACING} from '../../styles/theme';
import Header from '../../components/headers/Header';
import {UserContext} from '../../provider/UserProvider';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import SendOtp from '../../components/auth/SendOtp';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {COLLECTION} from '../../constants/Collections';
import {showErrorMessage} from '../../utils/FlashMessage';

const OTP = ({navigation}) => {
  const userCtx = useContext(UserContext);

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

  const sendOtpSuccessHandler = async phoneNumber => {
    const saveResponse = await userCtx.updateUserContactNumber(phoneNumber);

    //if reponse error
    if (!saveResponse.success) {
      alert(saveResponse.error);
      return;
    }

    //generate FCM token
    await sendFcmToken();

    //if response successfull
    navigation.popToTop();
  };
  const sendOtpErrorHandler = errorMsg => {
    // alert(errorMsg);
    showErrorMessage('Invalid code.');
  };

  return (
    <MainScreen containerStyle={{backgroundColor: COLORS.white}}>
      <Header transparent />
      <LoadingOverlay visible={userCtx.isLoading} textContent="LOADING..." />
      <MainFrame fullscreen>
        <View style={styles.contentContainer}>
          <SendOtp
            onSuccess={sendOtpSuccessHandler}
            onError={sendOtpErrorHandler}
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
export default OTP;
