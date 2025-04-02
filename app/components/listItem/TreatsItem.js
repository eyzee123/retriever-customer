import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {BORDER, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const TreatsItem = props => {
  return (
    <View style={styles(props).container}>
      <Image source={props.icon} style={styles(props).image} />
      <Text style={[styles(props).text, props.textStyle]}>{props.text}</Text>
    </View>
  );
};
const styles = props =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: props.backgroundColor,
      height: windowHeight * 0.06,
      // width: windowWidth * 0.41,
      width: windowWidth * 0.435,
      marginLeft: windowWidth * 0.025,
      marginRight: props.text === 'Some New Treats' ? windowWidth * 0.025 : 0,
      borderRadius: BORDER.roundedCornerBox,
    },
    image: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: windowHeight * 0.05,
      width: windowHeight * 0.06,
      resizeMode: 'stretch',
      borderBottomLeftRadius: BORDER.roundedCornerBox,
    },
    text: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      marginRight: SPACING.medium,
    },
  });
export default TreatsItem;
