import React from 'react';
import {Text, StyleSheet} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {COLORS, FONTS} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import RetrieverLogo from '../../assets/icons/logo1.svg';
import SplashBackground from '../../assets/images/splashbackground.svg';

const Splash = props => {
  return (
    <MainScreen containerStyle={styles.container}>
      <MainFrame contentStyle={styles.contentContainer}>
        <SplashBackground style={styles.splashStyle} />
        <Text style={styles.txtLabel}>Welcome to Retriever</Text>
        <RetrieverLogo
          height={windowHeight * 0.22}
          width={windowHeight * 0.22}
        />
        <Text style={styles.txtLabel1}>We’re glad you’re here.</Text>
        <Text style={styles.txtLabel2}>Are you ready for some treats?</Text>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.orange,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashStyle: {
    position: 'absolute',
    backgroundColor: 'red',
  },
  txtLabel: {
    ...FONTS.bold,
    fontSize: windowHeight * 0.04,
    color: COLORS.white,
    paddingBottom: windowHeight * 0.2,
  },
  txtLabel1: {
    ...FONTS.regular,
    fontSize: windowHeight * 0.019,
    color: COLORS.white,
    paddingTop: windowHeight * 0.22,
  },
  txtLabel2: {
    ...FONTS.regular,
    fontSize: windowHeight * 0.019,
    color: COLORS.white,
  },
});

export default Splash;
