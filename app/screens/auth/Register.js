import React from 'react';
import {View, StyleSheet} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import BasicInfoForm from '../../components/forms/BasicInfoForm';
import {SPACING} from '../../styles/theme';
import Header from '../../components/headers/Header';
import {ROUTES} from '../../constants/Routes';
import {windowWidth} from '../../utils/Dimensions';

const Register = ({navigation}) => {
  const gotoRegister2 = () => {
    navigation.navigate(ROUTES.REGISTER_2);
  };

  return (
    <MainScreen>
      <Header transparent />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <BasicInfoForm onSubmit={gotoRegister2} />
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

export default Register;
