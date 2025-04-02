import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {windowWidth} from '../../utils/Dimensions';

const MainFrame = props => {
  return (
    <SafeAreaView style={[styles(props).contentContainer, props.contentStyle]}>
      {props.children}
    </SafeAreaView>
  );
};

const styles = props =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      width: props.fullscreen ? windowWidth : '90%',
      alignSelf: 'center',
      // marginTop: props.belowHeader ? windowHeight * 0.12 : 0,
    },
  });

export default MainFrame;
