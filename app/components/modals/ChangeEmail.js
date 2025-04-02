import React, {useContext, useEffect, useState} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import TrophyIllustration from '../../assets/images/svg/computer.svg';
import RoundedInput from '../cores/RoundedInput';
import RoundedButton from '../cores/RoundedButton';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import useInput from '../../hooks/useInput';
import {
  getLocalDataObject,
  storeLocalDataObject,
} from '../../services/Storage/LocalStorageService';
import {LOCAL_STORAGE} from '../../constants/ProjectConstants';
import {UserContext} from '../../provider/UserProvider';
import {LoadingOverlay} from '../general/LoadingIndicator';
import {showErrorMessage} from '../../utils/FlashMessage';

const ChangeEmail = ({
  onEmailUpdate,
  showModal,
  closeModal,
  onModalHide,
  onErrorResponse,
}) => {
  const userCtx = useContext(UserContext);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueInputChangeHandler: emailChangeHandler,
    valueInputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(value => value.includes('@'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    getLocalUser();
  }, []);

  const getLocalUser = async () => {
    const localData = await getLocalDataObject(LOCAL_STORAGE.USER);
    setUser(localData);
  };

  const submitHandler = () => {
    if (!emailIsValid) {
      return;
    }
    if (email.toLowerCase() == user?.email.toLowerCase()) {
      console.log('email exist', user?.email);
      return;
    }

    userCtx.updateUserEmail(email).then(res => {
      if (!res) {
        console.log('update email error ', res.error);
        return;
      }
      resetEmail();
      onErrorResponse(res.error);
      // onEmailUpdate(email);
      closeModal();
    });

    const emailLink = email.split('@')[1];

    Linking.openURL(
      emailLink == 'yahoo.com'
        ? 'https://www.yahoomail.com/'
        : 'https://www.gmail.com/',
    );
  };

  const cancelHandler = () => {
    resetEmail();
    closeModal();
  };

  return (
    <Modal
      isVisible={showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      onBackdropPress={closeModal}
      onModalHide={onModalHide}>
      <LoadingOverlay visible={userCtx.isLoading} />

      <View style={styles.container}>
        <Text style={styles.sectionLabel}>Change Email Address</Text>
        <Text style={styles.sectionSub}>
          {
            'Enter your new email address below. You will be redirected to email verification after this.'
          }
        </Text>
        <View style={styles.buttonContainer}>
          <RoundedInput
            value={email}
            onBlur={emailBlurHandler}
            onChangeText={emailChangeHandler}
            placeholder="Enter New Email Here"
            // validateError={{
            //   hasError: emailHasError,
            //   errorText: 'Invalid email.',
            // }}
          />
          {!emailIsValid && email != '' && (
            <Text style={styles.errorText}>Invalid email.</Text>
          )}
          {email.toLowerCase() == user?.email.toLowerCase() && (
            <Text style={styles.errorText}>Email already exists.</Text>
          )}
          <View style={styles.btnContainer}>
            <View style={styles.btnContainerWrapper}>
              <RoundedButton
                onPress={cancelHandler}
                // disabled={!emailIsValid}
                text="Cancel"
                btnStyle={[
                  styles.btnStyle,
                  {backgroundColor: COLORS.subTextColor},
                ]}
                btnText={{color: COLORS.subTextColor1}}
              />
            </View>
            <View
              style={[
                styles.btnContainerWrapper,
                {marginLeft: SPACING.x_small},
              ]}>
              <RoundedButton
                text="Send Email"
                onPress={submitHandler}
                btnStyle={styles.btnStyle}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    padding: SPACING.medium,
    borderRadius: BORDER.roundedCornerPopupCard,
    backgroundColor: COLORS.white,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._14px,
    color: '#2F2F2F',
  },
  sectionSub: {
    ...FONTS.regular,
    textAlign: 'center',
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    marginTop: SPACING.medium,
    marginBottom: SPACING.x_small,
  },
  buttonContainer: {
    marginTop: SPACING.x_small,
    width: '100%',
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: SPACING.small,
  },
  btnStyle: {
    borderRadius: BORDER.roundedCornerInput,
    backgroundColor: COLORS.orange,
  },
  btnContainerWrapper: {
    flex: 1,
  },
  errorText: {
    ...GlobalStyle.errorText,
    marginTop: windowWidth * 0.005,
  },
});
export default ChangeEmail;
