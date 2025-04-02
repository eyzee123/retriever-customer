import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';

const ServiceItem = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled ? true : false}>
      <View style={styles(props).container}>
        <Text style={styles(props).serviceName}>{props.serviceTitle}</Text>
        <Image source={props.serviceImage} style={styles(props).image} />
        {props.disabled && <View style={styles(props).coverBackground} />}
      </View>
    </TouchableOpacity>
  );
};
const styles = props =>
  StyleSheet.create({
    container: {
      padding: SPACING.small,
      backgroundColor: props.color,
      height: windowHeight * 0.2,
      width: windowHeight * 0.2,
      borderRadius: BORDER.roundedCornerBox,
      marginLeft: props.index == 0 ? SPACING.medium : SPACING.small,
      marginRight: props.index == props.servicesLength - 1 ? SPACING.medium : 0,
    },
    serviceName: {
      ...FONTS.bold,
      color: COLORS.white,
    },
    image: {
      flex: 1,
      position: 'absolute',
      right: 0,
      bottom: 0,
      height: '85%',
      width: '88%',
      borderBottomRightRadius: BORDER.roundedCornerBox,
    },
    coverBackground: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      height: windowHeight * 0.2,
      width: windowHeight * 0.2,
      borderRadius: BORDER.roundedCornerBox,
    },
  });
export default ServiceItem;
