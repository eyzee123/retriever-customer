import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMAGES} from '../../constants/Images';
import LinearGradient from 'react-native-linear-gradient';

const WalletHeader = props => {
  return (
    <SafeAreaView style={styles.contentContainer}>
      <View style={styles.container}>
        <View style={styles.backPressContainer}>
          <TouchableOpacity
            onPress={props.onBackButtonPressed}
            style={styles.backPressWrapper}>
            <Icon
              name="chevron-left"
              size={SIZES.iconSize.medium}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.txtHeader}>{props.title}</Text>
        </View>
        <Image source={IMAGES.RETRIEVER_LOGO} style={styles.logoImage} />
        <LinearGradient
          angle={45}
          useAngle
          colors={COLORS.gradientColorOrange}
          style={styles.gradientStyle}
        />
        {props.children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: windowWidth,
  },
  container: {
    height: windowHeight * 0.28,
    justifyContent: 'center',
  },
  gradientStyle: {
    height: '100%',
    width: '100%',
  },
  logoImage: {
    position: 'absolute',
    alignSelf: 'center',
    height: windowHeight * 0.13,
    width: windowHeight * 0.21,
    bottom: windowHeight * 0.065,
    zIndex: 1,
  },
  backPressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    marginHorizontal: SPACING.small,
    top: SPACING.small,
  },
  backPressWrapper: {
    padding: SPACING.x_small,
    borderRadius: BORDER.circle,
  },
  txtHeader: {
    ...FONTS.bold,
    flex: 1,
    fontSize: SIZES._16px,
    color: COLORS.white,
    marginLeft: SPACING.x_small,
    marginTop: -windowWidth * 0.006,
  },
});

export default WalletHeader;
