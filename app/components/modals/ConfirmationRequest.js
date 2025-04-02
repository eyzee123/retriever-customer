import React, {useContext, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Base64} from 'js-base64';
import {getLocalDataObject} from '../../services/Storage/LocalStorageService';

const ConfirmationRequest = ({showModal, closeModal, onConfirmPassword}) => {
  const userCtx = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [icon, setIcon] = useState('eye-off');
  const [showPass, setShowPass] = useState(true);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const usersCollection = firestore().collection(COLLECTION.USERS);

  const showPassword = () => {
    if (icon === 'eye-off') {
      setIcon('eye');
      setShowPass(false);
    } else {
      setIcon('eye-off');
      setShowPass(true);
    }
  };

  const resetPassword = () => {
    setPassword(null);
    setError(null);
  };

  const submitHandler = async () => {
    console.log('submit');
    let user = auth().currentUser;
    const response = await usersCollection.doc(user.uid).get();
    let data = response.data();

    var decryptPassword = Base64.decode(data.password);
    if (decryptPassword != password) {
      console.log('incorrect password', decryptPassword);
      setError('Incorrect Password');
      return;
    }
    await onConfirmPassword(password);
  };

  const cancelHandler = () => {
    resetPassword();
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
      onBackdropPress={closeModal}>
      <LoadingOverlay visible={isLoading} />
      <View style={styles.container}>
        <Text style={styles.sectionLabel}>Password Confirmation</Text>
        <Text style={styles.sectionSub}>
          Enter your password below to confirm your delete request.
        </Text>
        <View style={styles.containerWrapper}>
          <View
            style={[
              styles.inputContainer,
              {
                marginBottom: error ? 0 : SPACING.small,
              },
            ]}>
            <View style={styles.inputContainerWrapper}>
              <RoundedInput
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  if (value != '') {
                    setError(null);
                  }
                }}
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
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {error && <Text style={styles.errorText}>Incorrect password.</Text>}
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
  containerWrapper: {
    width: '100%',
    marginTop: SPACING.x_small,
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
  icon: {
    marginRight: SPACING.small,
  },
  errorText: {
    ...GlobalStyle.errorText,
    marginTop: SPACING.x_small,
  },
  btnStyle: {
    borderRadius: BORDER.roundedCornerInput,
    backgroundColor: COLORS.orange,
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: SPACING.x_small,
  },
  btnContainerWrapper: {
    flex: 1,
  },
});
export default ConfirmationRequest;
