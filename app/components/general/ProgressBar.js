import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import * as Progress from 'react-native-progress';
import {COLORS} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const ProgressBar = props => {
  return (
    <Progress.Bar
      borderWidth={0}
      color={COLORS.orange}
      unfilledColor={COLORS.serviceBackground}
      height={windowHeight * 0.009}
      width={windowWidth * 0.462}
      {...props}
    />
  );
};

export default ProgressBar;
