import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const GridStoreItem = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles(props).container}>
        <FastImage source={props.storeImage} style={styles(props).image}>
          {props.promo && (
            <View style={styles(props).topRightContainer}>
              <View style={styles(props).promoContainer}>
                <Text style={styles(props).promo}>₱200 off: FP200</Text>
              </View>
            </View>
          )}
          <LinearGradient
            colors={COLORS.gradientColorBlack}
            style={styles(props).gradientStyle}
          />
          <View style={styles(props).storeNameContainer}>
            <Text style={styles(props).storeName}>{props.storeName}</Text>
          </View>
        </FastImage>
      </View>
    </TouchableOpacity>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      height: windowHeight * 0.2,
      width: windowHeight * 0.216,
      borderRadius: BORDER.roundedCornerBox,
      marginLeft: props.storeIndex == 0 ? SPACING.medium : SPACING.small,
      marginRight:
        props.storeIndex == props.storeLength - 1 ? SPACING.medium : 0,
    },
    image: {
      height: '100%',
      width: '100%',
      borderRadius: 6,
    },
    topRightContainer: {
      position: 'absolute',
      top: windowWidth * 0.01,
      right: windowWidth * 0.02,
    },
    promoContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: windowHeight * 0.013,
      paddingVertical: windowHeight * 0.0045,
      backgroundColor: COLORS.orange,
      borderRadius: BORDER.roundedCornerCard,
      marginTop: SPACING.x_small,
    },
    promo: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.white,
    },
    gradientStyle: {
      height: '100%',
      width: '100%',
      borderRadius: 6,
    },
    storeNameContainer: {
      position: 'absolute',
      bottom: windowHeight * 0.01,
      paddingHorizontal: SIZES.x_small,
    },
    storeName: {
      ...FONTS.bold,
      flex: 1,
      fontSize: SIZES._12px,
      color: COLORS.white,
    },
  });
export default GridStoreItem;
