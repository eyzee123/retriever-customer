import React from 'react';
import {StyleSheet, View, TextInput, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const AddressInput = props => {
  return (
    <View style={[styles(props).inputContainer, props.InputContainerStyle]}>
      <Icon
        style={styles(props).icon}
        name="map-marker"
        size={SIZES.iconSize.medium}
        color={COLORS.orange}
      />
      <TextInput
        style={[styles(props).inputStyle, props.inputStyles]}
        {...props}
        placeholderTextColor={COLORS.iconSearchColor}
      />
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: windowHeight * 0.05,
      width: '100%',
      paddingHorizontal: SPACING.small,
      borderRadius: BORDER.roundedCornerSearch,
      backgroundColor: COLORS.white,
    },
    icon: {
      marginRight: SPACING.small,
    },
    inputStyle: {
      flex: 1,
      ...FONTS.regular,
      color: COLORS.darkGreen,
    },
  });

export default AddressInput;
