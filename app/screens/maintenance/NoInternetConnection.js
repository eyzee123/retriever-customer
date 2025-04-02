import React from 'react';
import {View, StyleSheet, Text, Image, BackHandler} from 'react-native';
import MainScreen from '../../components/containers/MainScreen';
import {IMAGES} from '../../constants/Images';
import MainFrame from '../../components/containers/MainFrame';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import RoundedButton from '../../components/cores/RoundedButton';
import RNExitApp from 'react-native-exit-app';

const NoInternetConnection = ({navigation}) => {
  return (
    <MainScreen>
      <MainFrame fullscreen>
        <View style={styles.container}>
          <Image source={IMAGES.APP_MAINTENANCE} style={styles.image} />
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.body}>
            Please check your connection and try again. App will automatically
            load with good connection.
          </Text>
          <View style={styles.btnContainer}>
            <RoundedButton
              text="Exit Application"
              onPress={() =>
                Platform.OS === 'ios'
                  ? RNExitApp.exitApp()
                  : BackHandler.exitApp()
              }
            />
          </View>
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: windowHeight * 0.19,
    height: windowHeight * 0.21,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES._20px,
    marginTop: SPACING.x_large,
  },
  body: {
    ...FONTS.regular,
    fontSize: SIZES._14px,
    color: COLORS.subTextColor2,
    textAlign: 'center',
    marginTop: SPACING.medium,
    marginHorizontal: SPACING.large,
  },
  btnContainer: {
    width: '92%',
    position: 'absolute',
    bottom: SPACING.medium,
  },
});

export default NoInternetConnection;
