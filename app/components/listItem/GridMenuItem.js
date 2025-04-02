import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IMAGES} from '../../constants/Images';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const GridMenuItem = props => {
  return (
    <View style={styles(props).container}>
      <TouchableOpacity
        onPress={props.onPress}
        disabled={
          props.storeStatus === 'close' || props.storeStatus === 'closed'
            ? true
            : false
        }>
        <View style={styles(props).imageContainer}>
          <FastImage
            source={props.image}
            style={styles(props).image}
            onPress={props.onPress}>
            <View style={styles(props).coverWrapper} />
          </FastImage>
          {props.promo ? (
            <View style={styles(props).promoContainer}>
              <Text style={styles(props).promo}>5% OFF</Text>
            </View>
          ) : null}
          <View style={styles(props).bottomRightContainer}>
            {props.original_price ? (
              <View style={styles(props).originalPriceContainer}>
                <Text style={styles(props).originalPriceText}>
                  {props.original_price}
                </Text>
              </View>
            ) : null}
            <View style={styles(props).actualPriceContainer}>
              <Text style={styles(props).priceText}>{props.actual_price}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles(props).foodText}>{props.name}</Text>
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: windowHeight * 0.015,
    },
    imageContainer: {
      borderRadius: BORDER.roundedCornerBox,
    },
    image: {
      borderRadius: BORDER.roundedCornerBox,
      height: windowHeight * 0.2,
      width: windowWidth * 0.435,
    },
    coverWrapper: {
      flex: 1,
      backgroundColor:
        props.storeStatus == 'close' || props.storeStatus == 'closed'
          ? 'rgba(0, 0, 0, 0.5)'
          : null,
    },
    promoContainer: {
      position: 'absolute',
      right: windowWidth * 0.066,
      top: windowWidth * 0.025,
      paddingHorizontal: SPACING.x_small,
      paddingVertical: windowHeight * 0.0045,
      backgroundColor: COLORS.orange,
      borderRadius: BORDER.roundedCornerCard,
    },
    promo: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.white,
    },
    icon: {
      height: windowHeight * 0.018,
      width: windowHeight * 0.018,
    },
    bottomRightContainer: {
      position: 'absolute',
      right: windowWidth * 0.066,
      bottom: windowWidth * 0.025,
    },
    originalPriceContainer: {
      backgroundColor: COLORS.white,
      paddingHorizontal: SPACING.x_small,
      paddingVertical: windowHeight * 0.0045,
      borderRadius: BORDER.roundedCornerButton,
      alignSelf: 'flex-end',
      opacity: 0.75,
    },
    originalPriceText: {
      ...FONTS.bold,
      fontSize: windowHeight * 0.011,
      color: COLORS.grayText,
    },
    actualPriceContainer: {
      marginTop: windowHeight * 0.0045,
      backgroundColor: COLORS.grayEC80,
      paddingHorizontal: SPACING.x_small,
      paddingVertical: windowHeight * 0.0045,
      borderRadius: BORDER.roundedCornerCard,
    },
    priceText: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.tertiary,
    },
    foodText: {
      ...FONTS.regular,
      flex: 1,
      fontSize: SIZES._12px,
      color: COLORS.tertiary,
      marginTop: SPACING.x_small,
    },
  });
export default GridMenuItem;
