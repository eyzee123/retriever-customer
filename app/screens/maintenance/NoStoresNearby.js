import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import MainScreen from '../../components/containers/MainScreen';
import {IMAGES} from '../../constants/Images';
import MainFrame from '../../components/containers/MainFrame';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import RoundedButton from '../../components/cores/RoundedButton';

const NoStoresNearby = ({navigation}) => {
  return (
    <MainScreen>
      <MainFrame fullscreen>
        <View style={styles.container}>
          <Image source={IMAGES.EMPTY_STORES} style={styles.image} />
          <Text style={styles.title}>No stores nearby</Text>
          <Text style={styles.body}>
            No stores within your vicinity. Make sure that your location is
            accessible to our services.
          </Text>
          <View style={styles.btnContainer}>
            <RoundedButton text="Go Back" onPress={() => navigation.goBack()} />
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
    width: windowHeight * 0.375,
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

export default NoStoresNearby;
