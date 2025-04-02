import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const SectionStatus = props => {
  return (
    <View style={styles(props).contentContainer}>
      <View style={styles(props).contentWrapper}>
        <View style={styles(props).headerContainer}>
          <Image source={props.icon} style={styles(props).iconStyle} />
          <Text style={styles(props).txtHeader}>{props.header}</Text>
          <Text style={styles(props).txtKm}>{props.km}</Text>
        </View>
      </View>
      {props.desc ? (
        <>
          <View style={styles(props).line} />
          <View style={styles(props).contentWrapper}>
            <View style={styles(props).subContainer}>
              <Text numberOfLines={1} style={styles(props).txtDesc}>
                {props.description}
              </Text>
              <Text style={styles(props).txtSub}>{props.sub_description}</Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    contentContainer: {
      width: '100%',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.tertiary,
      backgroundColor: COLORS.progressColor,
      marginTop: windowHeight * 0.01, //7
    },
    contentWrapper: {
      paddingVertical: windowHeight * 0.0118, //8,
      paddingHorizontal: windowWidth * 0.037, //15
    },
    headerContainer: {
      flexDirection: 'row',
    },
    iconStyle: {
      marginTop: props.marginTop,
      marginRight: windowHeight * 0.015, //10
      width: props.width,
      height: props.height,
    },
    txtHeader: {
      ...FONTS.bold,
      color: COLORS.tertiary,
      fontSize: windowHeight * 0.017, //10
      flex: 1,
    },
    txtKm: {
      ...FONTS.regular,
      color: COLORS.tertiary,
      fontSize: windowHeight * 0.017, //10
    },
    line: {
      width: '100%',
      borderStyle: 'dotted',
      borderBottomColor: 'black',
      borderBottomWidth: 0.7,
    },
    txtDesc: {
      //   width: 100,
      ...FONTS.regular,
      flexWrap: 'wrap',
      fontSize: windowHeight * 0.016, //9
      color: COLORS.tertiary,
    },
    txtSub: {
      ...FONTS.regular,
      fontSize: windowHeight * 0.016, //9
      color: COLORS.grayText,
    },
  });

export default SectionStatus;
