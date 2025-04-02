import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';
import MainScreen from '../../components/containers/MainScreen';
import MainFrame from '../../components/containers/MainFrame';
import Header from '../../components/headers/Header';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import CustomDropdown from '../../components/general/CustomDropdown';
import RoundedInput from '../../components/cores/RoundedInput';
import RoundedButton from '../../components/cores/RoundedButton';
import SuccessDialogue from '../../components/modals/SuccessDialogue';
import {UserContext} from '../../provider/UserProvider';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import {ROUTES} from '../../constants/Routes';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import ConfirmationRequest from '../../components/modals/ConfirmationRequest';
import {LOCAL_STORAGE} from '../../constants/ProjectConstants';
import {clearLocalData} from '../../services/Storage/LocalStorageService';
import {COLLECTION} from '../../constants/Collections';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import useInput from '../../hooks/useInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useDateFormat from '../../hooks/useDateFormat';
import DateTimePicker from '@react-native-community/datetimepicker';

const Request = ({navigation, route}) => {
  const userCtx = useContext(UserContext);
  const [reason, setReason] = useState(0);
  const [moreDetails, setMoreDetails] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {formattedDate: dateString} = useDateFormat(selectedDate);
  const [show, setShow] = useState(false);
  const data = route.params;

  const {
    value: firstName,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueInputChangeHandler: firstNameChangeHandler,
    valueInputBlurHandler: firstNameBlurHandler,
    reset: resetFirstName,
  } = useInput(value => value.trim() !== '');

  const {
    value: lastName,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueInputChangeHandler: lastNameChangeHandler,
    valueInputBlurHandler: lastNameBlurHandler,
    reset: resetLastName,
  } = useInput(value => value.trim() !== '');

  const usersCollection = firestore().collection(COLLECTION.USERS);

  const showDatepicker = () => {
    setShow(!show ? true : false);
  };

  const onChange = (event, date) => {
    setSelectedDate(date);
    setShow(false);
  };

  const requestDataReason = [
    {
      label: 'Full Name',
      value: 1,
    },
    {
      label: 'Date of Birth',
      value: 2,
    },
  ];

  const deleteDataReason = [
    {
      label: 'Too Many Notifications',
      value: 1,
    },
    {
      label: 'Lack of Interest or Relevance',
      value: 2,
    },
    {
      label: 'Switching to Alternatives',
      value: 3,
    },
    {
      label: 'Overwhelmed by Content',
      value: 4,
    },
    {
      label: 'Too Many Ads',
      value: 5,
    },
    {
      label: 'Unsatisfactory Customer Support',
      value: 6,
    },
    {
      label: 'Not Mentioned Above',
      value: 7,
    },
  ];

  const submitHandler = async password => {
    console.log(password);
    let requestType;
    if (data.index == 1) {
      requestType = 'personalInfoRequest';
    } else {
      requestType = 'deletionRequest';
    }

    if (data.index == 1) {
      const userInfo = {
        firstName: firstName,
        lastName: lastName,
      };
      if (reason.label == 'Full Name') {
        await userCtx.usersRequest(
          requestType,
          reason.label,
          userInfo,
          password,
        );
      } else if (reason.label == 'Date of Birth') {
        await userCtx.usersRequest(
          requestType,
          reason.label,
          dateString,
          password,
        );
      }
    }
    if (data.index == 2) {
      await userCtx.usersRequest(
        requestType,
        reason.label,
        moreDetails,
        password,
      );
    }
    setConfirmModal(false);
    setShowSuccess(true);
  };

  const onConfirmHandler = () => {
    setShowSuccess(false);
    navigation.navigate(ROUTES.PROFILE);
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

  const onSubmit = async () => {
    const user = auth().currentUser;
    const response = await usersCollection.doc(user.uid).get();
    let data = response.data();
    if (!data.password) {
      setErrorModal(true);
      return;
    }
    setConfirmModal(true);
  };

  return (
    <MainScreen>
      <Header title={data.index == 1 ? 'Request' : 'Delete Account'} />
      <LoadingOverlay visible={userCtx.isLoading} />
      <MainFrame fullscreen>
        {showConfirmModal && (
          <ConfirmationRequest
            onConfirmPassword={submitHandler}
            showModal={showConfirmModal}
            closeModal={() => setConfirmModal(false)}
          />
        )}
        {showErrorModal && (
          <SuccessDialogue
            noBackdropPress
            showModal={showErrorModal}
            title="Oops! There’s something wrong. 😭"
            body={
              "No worries, we've got you covered! For your account's security and the best experience, please log in again."
            }
            confirmButtonText="Login Now"
            onConfirm={signOut}
          />
        )}
        {showSuccess && (
          <SuccessDialogue
            // noBackdropPress
            showModal={showSuccess}
            title="Request Submitted ✅"
            body={
              'Please give us time to look further into your request. We’ll email/sms you an update.'
            }
            confirmButtonText="Okay"
            onConfirm={onConfirmHandler}
          />
        )}
        <View style={styles.container}>
          <Text style={styles.title}>
            {data.index == 1 ? 'Personal Info Request' : 'Reason for delete '}
          </Text>
          <Text style={styles.subTitle}>
            {data.index == 1
              ? 'Which information of you do you want to modify?'
              : 'Care to tell us the reason of your account deletion?'}
          </Text>
          <Text style={styles.sectionLabel}>Reason</Text>
          <CustomDropdown
            placeholder={
              data.index == 1 ? 'Select which data' : 'Tell us the reason'
            }
            data={data.index == 1 ? requestDataReason : deleteDataReason}
            value={reason.value}
            onChange={item => {
              setReason(item);
            }}
            itemTextStyle={{
              marginVertical: data.index == 1 ? 0 : -windowWidth * 0.01,
            }}
            placeholderStyle={styles.placeholderStyle}
          />
          {data.index == 1 ? (
            reason.label == 'Full Name' ? (
              <>
                <Text style={styles.sectionLabel1}>First Name</Text>
                <RoundedInput
                  value={firstName}
                  onBlur={firstNameBlurHandler}
                  onChangeText={firstNameChangeHandler}
                  placeholder="Enter your first name"
                  maxLength={20}
                  validateError={{
                    hasError: firstNameHasError,
                    errorText: 'This field is required',
                  }}
                />
                <Text
                  style={[styles.sectionLabel1, {marginTop: SPACING.x_small}]}>
                  Last Name
                </Text>
                <RoundedInput
                  value={lastName}
                  onBlur={lastNameBlurHandler}
                  onChangeText={lastNameChangeHandler}
                  placeholder="Enter your last name"
                  maxLength={20}
                  validateError={{
                    hasError: lastNameHasError,
                    errorText: 'This field is required',
                  }}
                />
              </>
            ) : reason.label == 'Date of Birth' ? (
              <>
                <Text
                  style={[
                    styles.sectionLabel1,
                    {marginBottom: SPACING.x_small},
                  ]}>
                  Date of Birth
                </Text>
                <View style={styles.dateContainer}>
                  <RoundedInput
                    editable={false}
                    placeholder="DD/MM/YYYY"
                    value={dateString}
                    inputStyle={styles.inputDateStyle}
                  />
                  <TouchableOpacity onPress={showDatepicker}>
                    <Icon
                      name="calendar-range"
                      size={SIZES.iconSize.small}
                      color={COLORS.darkgray}
                      style={styles.icon}
                    />
                  </TouchableOpacity>

                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={selectedDate}
                      mode={'date'}
                      is24Hour={true}
                      onChange={onChange}
                    />
                  )}
                </View>
              </>
            ) : null
          ) : (
            <>
              <Text style={[styles.sectionLabel, {marginBottom: 0}]}>
                More Details
              </Text>
              <RoundedInput
                multiline={true}
                numberOfLines={4}
                minHeight={Platform.OS === 'ios' ? 20 * 4 : null}
                textAlignVertical="top"
                placeholder={
                  data.index == 1
                    ? 'Kindly add more details of why you want to change this data...'
                    : 'Kindly add more details of your reason of deletion...'
                }
                inputStyle={styles.inputStyle}
                value={moreDetails}
                onChangeText={value => setMoreDetails(value)}
              />
            </>
          )}
          <View style={{marginTop: SPACING.x_small}}>
            {data.index == 1 ? (
              reason.label == 'Full Name' ? (
                <RoundedButton
                  disabled={
                    reason == 0 || firstName == '' || lastName == ''
                      ? true
                      : false
                  }
                  text="Submit"
                  onPress={onSubmit}
                />
              ) : (
                <RoundedButton
                  disabled={reason == 0 || !dateString ? true : false}
                  text="Submit"
                  onPress={onSubmit}
                />
              )
            ) : (
              <RoundedButton
                disabled={reason == 0 || moreDetails == '' ? true : false}
                text="Submit"
                onPress={onSubmit}
              />
            )}
          </View>
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.medium,
  },
  title: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    fontSize: SIZES._18px,
  },
  subTitle: {
    ...FONTS.regular,
    color: COLORS.darkGreen,
    fontSize: SIZES._14px,
  },
  listContainer: {
    marginTop: SPACING.small,
  },
  sectionLabel: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginTop: SPACING.medium,
    marginBottom: SPACING.x_small,
  },
  placeholderStyle: {
    ...FONTS.regular,
    color: COLORS.lightGray1,
  },
  sectionLabel1: {
    ...FONTS.bold,
    color: COLORS.subTextColor1,
    marginTop: SPACING.small,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.4,
    borderRadius: BORDER.roundedCornerInput,
    marginBottom: SPACING.x_small,
  },
  inputDateStyle: {
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.medium,
    marginVertical: 0,
  },
  icon: {
    marginHorizontal: SPACING.small,
  },
  inputStyle: {
    paddingVertical: SPACING.small,
  },
});

export default Request;
