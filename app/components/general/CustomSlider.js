import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import {COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Star from '../../assets/icons/star.svg';

const CustomSlider = props => {
  const [value, setValue] = useState(1);
  const [reviewColor, setReviewColor] = useState([
    COLORS.slider.red,
    COLORS.slider.orange,
    COLORS.slider.yellow,
    COLORS.slider.yellow_green,
    COLORS.slider.green,
  ]);

  const dragReview = index => {
    setValue(index);
  };

  const customThumb = () => (
    <View
      style={[styles.thumbStyle, {backgroundColor: reviewColor[value - 1]}]}>
      <Star
        height={'35%'}
        style={{
          marginLeft: windowWidth * -0.02,
          marginRight: windowWidth * -0.01,
        }}
      />
      <Text style={styles.thumbText}>{value} Star</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Slider
        bubbleColor={COLORS.orange}
        maximumValue={5}
        minimumValue={1}
        step={1}
        value={value}
        onValueChange={dragReview}
        renderThumbComponent={customThumb}
        trackStyle={styles.trackStyle}
        minimumTrackTintColor={reviewColor[value - 1]}
        maximumTrackTintColor={'#E3E5E8'}
        trackClickable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.small,
    borderRadius: 40,
  },

  thumbStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth * 0.23, //30,
    height: windowHeight * 0.06, //40
    borderRadius: 40,
  },
  trackStyle: {
    width: '100%',
    height: windowHeight * 0.06, //40
    borderRadius: 40,
  },
  thumbText: {
    ...FONTS.bold,
    fontSize: windowHeight * 0.022, //15
    color: COLORS.white,
  },
});

export default CustomSlider;
