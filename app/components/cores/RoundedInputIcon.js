import React from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
const RoundedInputIcon = props => {
  return (
    <View style={[styles(props).container, props.inputContainerStyle]}>
      {props.image ? (
        <View style={styles(props).viewRight}>
          <Image
            resizeMode="stretch"
            source={props.image}
            style={{height: '100%', width: '100%'}}
          />
        </View>
      ) : null}
      <TextInput
        style={[styles(props).roundedInput, props.inputStyle]}
        placeholderTextColor={COLORS.subTextColor1}
        placeholder={props.placeholder}
      />
      {props.children}
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderRadius: BORDER.roundedCornerInput,
      marginVertical: SPACING.x_small,
      borderColor: COLORS.inputBorderColor,
      backgroundColor: COLORS.white,
      paddingLeft: SPACING.small,
      borderWidth: 1,
    },
    viewRight: {
      height: windowHeight * 0.027,
      width: windowHeight * 0.027,
      // marginRight: SPACING.small,
    },
    roundedInput: {
      ...FONTS.regular,
      flex: 1,
      paddingVertical: SPACING.x_small,
      paddingHorizontal: SPACING.x_small,
      color: COLORS.darkGreen,
    },
  });

export default RoundedInputIcon;
