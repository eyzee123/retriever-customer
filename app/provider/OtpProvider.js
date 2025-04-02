import React, {createContext, useCallback, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {STRING_FORMAT} from '../constants/ProjectConstants';

const OtpContext = createContext();

const OtpProvider = props => {
  const [isLoading, setIsloading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const sendOTP = useCallback(async contactNumber => {
    setIsloading(true);
    const phoneNumber = `${STRING_FORMAT.COUNRTY_CODE}${contactNumber}`;
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);
      setIsloading(false);
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      setIsloading(false);
      setError(error);
      console.log('sendOTP error', error);
    }
  }, []);

  const confirmOTP = useCallback(async code => {
    setIsloading(true);
    try {
      const codeConfirm = await confirmation.confirm(code);
      console.log(codeConfirm);
      setSuccess(true);
      setIsloading(false);
    } catch (error) {
      setSuccess(false);
      setIsloading(false);
      setError(error);
      console.log('confirmOTP error', error);
    }
  }, []);

  const otpContext = {
    isLoading,
    confirmation,
    success,
    error,
    sendOTP,
    confirmOTP,
  };

  return (
    <OtpContext.Provider value={otpContext}>
      {props.children}
    </OtpContext.Provider>
  );
};
export {OtpProvider, OtpContext};
