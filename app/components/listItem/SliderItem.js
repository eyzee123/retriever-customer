import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BORDER, COLORS, SPACING} from '../../styles/theme';
import ImageModal from 'react-native-image-modal';

const SliderItem = props => {
  return (
    <View style={styles(props).container} {...props}>
      <FastImage
        resizeMode="cover"
        source={{uri: props.image}}
        style={styles(props).image}>
        {props.cover ? <View style={styles(props).coverWrapper}></View> : null}
      </FastImage>
      {props.children}
    </View>
  );
};
const styles = props =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    image: {
      flex: props.width ? 0 : 1,
      height: props.height,
      width: props.width,
      borderRadius: props.cover ? 0 : BORDER.roundedCornerBox,
    },
    coverWrapper: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  });

export default SliderItem;
