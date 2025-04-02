import React from 'react';
import {StyleSheet} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {windowHeight} from '../../utils/Dimensions';
import {COLORS, FONTS, SPACING} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RadioButton = props => {
  return (
    <RadioButtonRN
      data={props.data}
      box={false}
      // icon={
      //   <Icon
      //     name="check-circle"
      //     size={windowHeight * 0.027}
      //     color={COLORS.orange}
      //   />
      // }
      circleSize={windowHeight * 0.018}
      activeColor={COLORS.orange}
      textStyle={styles.textStyle}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  textStyle: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginLeft: SPACING.x_small,
  },
});

export default RadioButton;
