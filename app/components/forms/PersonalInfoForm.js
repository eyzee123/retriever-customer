import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RoundedInput from '../cores/RoundedInput';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RoundedButton from '../cores/RoundedButton';
import useDateFormat from '../../hooks/useDateFormat';
import useInput from '../../hooks/useInput';
import {UserContext} from '../../provider/UserProvider';
import {ROUTES} from '../../constants/Routes';
import {useNavigation} from '@react-navigation/native';

const PersonalInfoForm = props => {
  const navigation = useNavigation();
  const userCtx = useContext(UserContext);

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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const {formattedDate: dateString} = useDateFormat(selectedDate);

  const [referral, setReferral] = useState('');
  const [show, setShow] = useState(false);

  const formIsValid = firstNameIsValid && lastNameIsValid;
  const referralHandler = text => {
    setReferral(text);
  };

  const onChange = (event, date) => {
    setSelectedDate(date);
    setShow(false);
  };

  const showDatepicker = () => {
    setShow(!show ? true : false);
  };

  const handleSubmit = async () => {
    if (!formIsValid) {
      return;
    }

    userCtx.user = {
      ...userCtx.user,
      firstName,
      lastName,
      referral,
      birthDate: dateString,
      type: 'Customer',
    };

    const saveResponse = await userCtx.addUser(userCtx.user);

    //if reponse error
    if (!saveResponse.success) {
      alert(saveResponse.error);
      return;
    }

    props.onSubmit();
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SPACING.xxx_large,
        }}>
        <Text style={styles.createText}>Create an account.</Text>
        <Text style={styles.basicText}>Personal Information</Text>
        <Text style={styles.formSub}>
          Enter your information below to get started.
        </Text>
        <View style={styles.fieldContainer}>
          <Text style={[styles.sectionLabel, {marginTop: SPACING.small}]}>
            First Name
          </Text>
          <RoundedInput
            value={firstName}
            onBlur={firstNameBlurHandler}
            onChangeText={firstNameChangeHandler}
            placeholder="First Name"
            maxLength={20}
            validateError={{
              hasError: firstNameHasError,
              errorText: 'This field is required',
            }}
          />

          <Text style={styles.sectionLabel}>Last Name</Text>
          <RoundedInput
            value={lastName}
            onBlur={lastNameBlurHandler}
            onChangeText={lastNameChangeHandler}
            placeholder="Last Name"
            maxLength={20}
            validateError={{
              hasError: lastNameHasError,
              errorText: 'This field is required',
            }}
          />
          <Text style={[styles.sectionLabel, {marginBottom: SPACING.x_small}]}>
            Date of Birth
          </Text>
          <View style={styles.dateContainer}>
            <RoundedInput
              editable={false}
              placeholder="DD/MM/YYYY"
              value={dateString}
              inputStyle={styles.inputStyle}
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

          <View style={styles.referralContainer}>
            <Text style={[styles.sectionLabel, {color: COLORS.orange}]}>
              Got a referral code?
            </Text>
            <RoundedInput
              // placeholder="e.g. REF564"
              onChangeText={referralHandler}
              editable={false}
              inputStyle={{backgroundColor: COLORS.subTextColor}}
            />
            <Text style={styles.sectionSub}>
              Enter referral code to get a treat.
            </Text>
          </View>
          <View style={styles.byContinuingContainer}>
            <Text style={styles.byContinue}>
              By continuing, you are agreeing to our
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate(ROUTES.TERMS_AND_CONDITIONS)}>
              <Text style={styles.termsandpolicy}>
                Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <RoundedButton
          disabled={!formIsValid}
          text="Register"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  createText: {
    ...FONTS.bold,
    fontSize: SIZES._32px,
    color: COLORS.darkGreen,
    marginBottom: SPACING.small,
  },
  basicText: {
    ...FONTS.bold,
    fontSize: SIZES._18px,
    color: COLORS.darkGreen,
  },
  formSub: {
    ...GlobalStyle.sectionSubLabel,
  },
  fieldContainer: {
    marginVertical: SPACING.x_small,
  },
  inputContainer: {
    // marginTop: SPACING.small,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: '#7D7E82',
    marginTop: SPACING.x_small,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.4,
    borderRadius: BORDER.roundedCornerInput,
  },
  inputStyle: {
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.medium,
    marginVertical: 0,
  },
  icon: {
    marginHorizontal: SPACING.small,
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
  },
  referralContainer: {
    marginVertical: SPACING.xx_large,
  },
  byContinuingContainer: {
    alignItems: 'center',
  },
  byContinue: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  termsandpolicy: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  btnContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default PersonalInfoForm;
