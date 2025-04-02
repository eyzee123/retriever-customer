import React, {forwardRef} from 'react';
import {StyleSheet, TextInput, Text, Platform} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
const RoundedInput = (props, ref) => {
  const errorStyle = props.validateError?.hasError && {
    borderColor: COLORS.error,
  };
  return (
    <>
      <TextInput
        ref={ref}
        style={[styles(props).roundedInput, props.inputStyle, errorStyle]}
        placeholderTextColor={COLORS.lightGray1}
        //onChangeText={text => props.onChangeText({text})}
        {...props}
      />
      {props.validateError?.hasError && (
        <Text style={GlobalStyle.errorText}>
          {props.validateError?.errorText}
        </Text>
      )}
    </>
  );
};

const styles = props =>
  StyleSheet.create({
    roundedInput: {
      ...FONTS.regular,
      width: '100%',
      // flex: 1,
      borderRadius: BORDER.roundedCornerInput,
      paddingVertical:
        Platform.OS == 'ios' ? SPACING.small : windowHeight * 0.01,
      paddingHorizontal: SPACING.medium,
      backgroundColor: COLORS.white,
      color: COLORS.darkGreen,
      marginVertical: SPACING.x_small,
      borderColor: COLORS.iconSearchColor,
      borderWidth: 1,
    },
    error: {
      borderColor: COLORS.error,
      borderWidth: props.noBorder ? 0 : 1,
    },
  });

const forwardedRef = forwardRef(RoundedInput);

export default forwardedRef;
