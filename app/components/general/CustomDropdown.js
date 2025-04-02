import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const CustomDropdown = props => {
  return (
    <View style={[styles(props).dropdownStyle, props.dropdownStyle]}>
      <Dropdown
        {...props}
        labelField="label"
        valueField="value"
        data={props.data}
        renderRightIcon={() =>
          props.icon ? (
            <Icon
              name={props.icon}
              size={windowHeight * 0.04}
              color={props.color ? props.color : COLORS.tertiary}
            />
          ) : null
        }
        itemTextStyle={[styles(props).textStyle, props.itemTextStyle]}
        containerStyle={[styles(props).contStyle, props.containerStyle]}
        placeholderStyle={[styles(props).pholderStyle, props.placeholderStyle]}
        selectedTextStyle={[styles(props).selectStyle, props.selectStyle]}
      />
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    dropdownStyle: {
      width: props.width ? props.width : '100%',
      paddingHorizontal: SPACING.small,
      paddingVertical: windowHeight * 0.0065,
      // marginVertical: SPACING.x_small,
      borderRadius: 10,
      borderColor: COLORS.subTextColor1,
      borderWidth: 0.3,
    },
    textStyle: {
      ...FONTS.bold,
      fontSize: SIZES._14px,
    },
    pholderStyle: {
      ...FONTS.bold,
      fontSize: SIZES._14px,
      color: COLORS.darkGreen,
    },
    selectStyle: {
      ...FONTS.bold,
      fontSize: SIZES._14px,
      marginVertical: -SPACING.small,
    },
  });

export default CustomDropdown;
