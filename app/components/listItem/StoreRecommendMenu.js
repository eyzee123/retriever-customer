import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {IMAGES} from '../../constants/Images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StoreRecommendMenu = props => {
  return (
    <TouchableOpacity style={styles(props).container} onPress={props.onPress}>
      <FastImage
        source={props.image != '' ? {uri: props.image} : IMAGES.NO_IMAGE}
        style={styles(props).image}
      />
      <View style={styles(props).menuContainer}>
        <Text style={styles(props).menu} numberOfLines={1}>
          {props.menu}
        </Text>
        <View style={styles(props).rateContainer}>
          {props.store && (
            <Icon name="star" size={windowHeight * 0.017} color={COLORS.gold} />
          )}
          <Text style={styles(props).rate}>{props.rate}</Text>
        </View>
      </View>
      {props.store ? (
        <Text style={styles(props).store} numberOfLines={1}>
          {props.store}
        </Text>
      ) : (
        <Text style={styles(props).price}>₱{props.price}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      padding: SPACING.small,
      backgroundColor: COLORS.white,
      borderRadius: BORDER.roundedCornerBox,
      marginLeft: props.index == 0 ? SPACING.medium : SPACING.small,
      marginRight:
        props.index == props.recommendMenuLength - 1 ? SPACING.medium : 0,
    },
    image: {
      height: windowHeight * 0.2,
      width: windowHeight * 0.2,
      borderRadius: BORDER.roundedCornerBox,
    },
    menuContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: SPACING.x_small,
    },
    rateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    menu: {
      ...FONTS.bold,
      color: COLORS.brown332,
      width: windowWidth * 0.25,
    },
    rate: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.gold,
      marginLeft: windowHeight * 0.005,
      marginTop: -windowWidth * 0.006,
    },
    store: {
      ...FONTS.regular,
      fontSize: SIZES._12px,
      color: COLORS.subTextColor2,
      width: windowWidth * 0.28,
    },
    price: {
      ...FONTS.regular,
      fontSize: SIZES._12px,
      color: COLORS.subTextColor2,
    },
  });

export default StoreRecommendMenu;
