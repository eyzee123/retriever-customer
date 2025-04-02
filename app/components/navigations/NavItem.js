import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import Labels from '../../constants/Labels';

const NavItem = props => {
  return (
    <View style={styles(props).container}>
      <TouchableOpacity
        onPress={props.onPress}
        style={[styles(props).btnContainer, props.btnContainerStyle]}>
        <Image source={props.icon} style={styles(props).image} />
        <Text style={styles(props).title}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = props =>
  StyleSheet.create({
    container: {
      marginLeft:
        props.title == Labels.login || props.title == Labels.profile
          ? SPACING.medium
          : SPACING.small,
      marginRight: props.title == Labels.support ? SPACING.medium : 0,
      backgroundColor: COLORS.cardBackground,
      borderRadius: BORDER.roundedCornerButton,
      borderColor: COLORS.orange,
      borderWidth: 1,
    },
    btnContainer: {
      flexDirection: 'row',
      paddingVertical: SPACING.small,
      paddingHorizontal: SPACING.large,
    },
    btnStyle: {
      position: 'absolute',
      top: -1,
      left: -1,
      alignItems: 'center',
      justifyContent: 'center',
      width: windowHeight * 0.05,
      height: windowHeight * 0.054,
      backgroundColor: COLORS.orange,
      borderTopLeftRadius: BORDER.circle,
      borderBottomLeftRadius: BORDER.circle,
      borderTopRightRadius: BORDER.roundedCornerInput,
      borderBottomRightRadius: BORDER.roundedCornerInput,
    },
    image: {
      position: 'absolute',
      left: 0,
      height: windowHeight * 0.052,
      width: windowHeight * 0.05,
      borderTopLeftRadius: BORDER.roundedCornerButton,
      borderBottomLeftRadius: BORDER.roundedCornerButton,
    },
    title: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.orange,
    },
  });
export default NavItem;
