import React from 'react';
import {StyleSheet} from 'react-native';
import {Rating} from 'react-native-ratings';
import {COLORS, SIZES} from '../../styles/theme';
const Ratings = props => {
  return (
    <Rating
      type="custom"
      ratingCount={5}
      imageSize={SIZES.iconSize.x_small}
      ratingColor={COLORS.orange}
      ratingBackgroundColor={'#E0E0E0'}
      showRating={false}
      tintColor={COLORS.white}
      readonly
      {...props}
    />
  );
};

const styles = StyleSheet.create({});

export default Ratings;
