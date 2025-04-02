import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BORDER, COLORS, SPACING} from '../../styles/theme';

const CircleView = props => {
  return (
    <View style={[styles(props).container, props.containerStyle]}>
      {props.children}
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      padding: SPACING.x_small,
      backgroundColor: COLORS.white,
      height: props.size,
      width: props.size,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default CircleView;
