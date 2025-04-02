import React, {useContext} from 'react';
import {View} from 'react-native';
import SendOtp from '../../components/auth/SendOtp';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import BackHeader from '../../components/headers/BackHeader';
import {STRING_FORMAT} from '../../constants/ProjectConstants';
import {ROUTES} from '../../constants/Routes';
import {UserContext} from '../../provider/UserProvider';

const ChangePhoneNumber = ({navigation, route}) => {
  const userCtx = useContext(UserContext);

  const {phoneNumber} = route.params;

  const sendOtpSuccessHandler = async phoneNumber => {
    const contactNumber = `${STRING_FORMAT.COUNRTY_CODE}${phoneNumber}`;
    const saveReponse = await userCtx.updateUserContactNumber(contactNumber);

    console.log(saveReponse);
    if (!saveReponse.success) {
      console.log(saveReponse.error);

      return;
    }
    navigation.goBack();
  };
  const sendOtpErrorHandler = error => {
    console.log(error);
  };

  return (
    <MainScreen>
      <BackHeader
        pageTitle="Change Phone Number"
        onBackButtonPressed={() => navigation.goBack()}
      />
      <MainFrame>
        <SendOtp
          contactNumber={phoneNumber}
          onSuccess={sendOtpSuccessHandler}
          onError={sendOtpErrorHandler}
        />
      </MainFrame>
    </MainScreen>
  );
};

export default ChangePhoneNumber;
