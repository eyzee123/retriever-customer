import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../styles/theme';

const MainScreen = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default MainScreen;
