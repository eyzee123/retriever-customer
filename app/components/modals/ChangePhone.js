import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
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
import {LOCAL_STORAGE, STRING_FORMAT} from '../../constants/ProjectConstants';
import {LoadingOverlay} from '../general/LoadingIndicator';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from '../../constants/Collections';
import auth from '@react-native-firebase/auth';
import {showErrorMessage} from '../../utils/FlashMessage';
import {getLocalDataObject} from '../../services/Storage/LocalStorageService';

const ChangePhone = ({
  onPhoneNumberUpdate,
  onPhoneNumberChange,
  showModal,
  closeModal,
  onModalHide,
}) => {
  const userCtx = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    value: contactNumber,
    isValid: contactNumberIsValid,
    hasError: contactNumberHasError,
    valueInputChangeHandler: contactNumberChangeHandler,
    valueInputBlurHandler: contactNumberBlurHandler,
    reset: resetPhoneNumber,
  } = useInput(value => value.trim().length === 10);
  const [user, setUser] = useState(null);
  const phoneNumber = `${STRING_FORMAT.COUNRTY_CODE}${contactNumber}`;

  useEffect(() => {
    getLocalUser();
  }, []);

  const getLocalUser = async () => {
    const localData = await getLocalDataObject(LOCAL_STORAGE.USER);
    setUser(localData);
  };

  const submitHandler = async () => {
    console.log('submit');
    if (!contactNumberIsValid) {
      return;
    }

    if (phoneNumber == user?.contactNumber) {
      console.log('contact number exist', user.contactNumber, phoneNumber);
      return;
    }

    setIsLoading(true);

    const response = await checkOngoingOrders();

    if (!response.response) {
      showErrorMessage(
        "There is an ongoing order, can't change contact at the moment.",
      );
      setIsLoading(false);
      resetPhoneNumber();
      closeModal();
      return;
    }

    await onPhoneNumberUpdate(phoneNumber);
    closeModal();
    setIsLoading(false);
  };

  const cancelHandler = () => {
    resetPhoneNumber();
    closeModal();
  };

  const checkOngoingOrders = async () => {
    const user = auth().currentUser;
    const response = await firestore()
      .collection(COLLECTION.CURRENT_ORDERS)
      .where('user.id', '==', user.uid)
      .where('status', 'not-in', [7, 99])
      .get();

    return {response: response.empty};
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
      <LoadingOverlay visible={isLoading} />
      <View style={styles.container}>
        <Text style={styles.sectionLabel}>Change Phone Number</Text>
        <Text style={styles.sectionSub}>
          {
            'Enter your new contact number below to change your current contact number.'
          }
        </Text>
        <View style={styles.buttonContainer}>
          <View
            style={[
              styles.phoneContainer,
              {
                marginBottom:
                  (!contactNumberIsValid && contactNumber != '') ||
                  phoneNumber == user?.contactNumber
                    ? 0
                    : SPACING.small,
              },
            ]}>
            <View style={styles.countryContainer}>
              <Text style={styles.countryCode}>
                {STRING_FORMAT.COUNRTY_CODE}{' '}
              </Text>
            </View>
            <RoundedInput
              keyboardType="numeric"
              maxLength={10}
              value={contactNumber}
              onBlur={contactNumberBlurHandler}
              onChangeText={contactNumberChangeHandler}
              placeholder="e.g. 9243465772"
              inputStyle={styles.inputStyle}
            />
          </View>
          {!contactNumberIsValid && contactNumber != '' && (
            <Text style={styles.errorText}>Invalid contact number.</Text>
          )}
          {phoneNumber == user?.contactNumber && (
            <Text style={styles.errorText}>Contact number already exists.</Text>
          )}
          <View style={styles.btnContainer}>
            <View style={styles.btnContainerWrapper}>
              <RoundedButton
                text="Cancel"
                onPress={cancelHandler}
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
                text="Confirm"
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
    marginBottom: SPACING.small,
  },
  countryContainer: {
    borderRightColor: COLORS.subTextColor1,
    borderRightWidth: 0.5,
  },
  countryCode: {
    ...FONTS.regular,
    color: COLORS.subTextColor1,
    paddingHorizontal: SPACING.x_small,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.x_small,
    borderColor: COLORS.lightGray1,
    borderWidth: 1,
    borderRadius: BORDER.roundedCornerInput,
    marginBottom: SPACING.small,
  },
  inputStyle: {
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    marginVertical: 0,
    paddingHorizontal: SPACING.small,
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.x_small,
  },
  btnStyle: {
    borderRadius: BORDER.roundedCornerInput,
    backgroundColor: COLORS.orange,
  },
  errorText: {
    ...GlobalStyle.errorText,
    marginTop: SPACING.x_small,
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: SPACING.x_small,
  },
  btnContainerWrapper: {
    flex: 1,
  },
});
export default ChangePhone;
