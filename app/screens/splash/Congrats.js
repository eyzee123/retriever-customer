import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import CongratsIllustration from '../../assets/images/congrats.svg';
import RoundedButton from '../../components/cores/RoundedButton';

const Congrats = ({navigation}) => {
  return (
    <MainScreen>
      <MainFrame fullscreen>
        <View style={styles.contenContainer}>
          <CongratsIllustration height="33%" style={styles.svgStyle} />
          <Text style={styles.sectionTitle}>Welcome Aboard!</Text>
          <Text style={styles.sectionSub}>
            Your Retriever account is now verified, and you’re ready to get some
            treats quick and easy.
          </Text>
          <Text style={[styles.sectionSub, {marginVertical: SPACING.medium}]}>
            You’ve also unlocked the following features:
          </Text>
          <Text style={styles.features}>{'\u25CF'} Retriever Wallet</Text>
          <Text style={styles.features}>{'\u25CF'} Saved Adresses</Text>
          <Text style={styles.features}>{'\u25CF'} Favorites</Text>
          <Text style={styles.features}>{'\u25CF'} Order History</Text>
          <View style={styles.buttonContainer}>
            <RoundedButton
              icon="check-bold"
              text="Proceed to Order Overview"
              onPress={() => navigation.navigate('OrderReview')}
            />
          </View>
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  contenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.medium,
  },
  svgStyle: {
    marginBottom: SPACING.x_large,
  },
  sectionTitle: {
    ...FONTS.bold,
  },
  sectionSub: {
    ...FONTS.regular,
    textAlign: 'center',
    color: COLORS.darkGreen,
  },
  features: {
    ...FONTS.bold,
    fontSize: SIZES.x_small,
    textAlign: 'center',
    color: COLORS.orange,
    marginVertical: SPACING.x_small,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: SPACING.xx_large,
  },
});

export default Congrats;
