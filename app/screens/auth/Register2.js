import React from 'react';
import {View, StyleSheet} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import PersonalInfoForm from '../../components/forms/PersonalInfoForm';
import Header from '../../components/headers/Header';
import {ROUTES} from '../../constants/Routes';
import {SPACING} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';

const Register2 = ({navigation}) => {
  const gotoOTP = () => {
    navigation.navigate(ROUTES.OTP);
  };

  return (
    <MainScreen>
      <Header transparent />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <PersonalInfoForm onSubmit={gotoOTP} />
        </View>
      </MainFrame>
    </MainScreen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
});

export default Register2;
