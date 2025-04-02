import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {Icon} from 'react-native-elements';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {COLORS, FONTS, SIZES} from '../../styles/theme';

const ProgressStepper = props => {
  const labels = [
    'On process',
    `We’re preparing, wait for ${props.preparationTime} mins.`,
    'On the way',
  ];
  const icons = [
    {
      name: 'clock-time-three',
      type: 'material-community',
      color: 'white',
    },
    {name: 'chef-hat', type: 'material-community', color: 'white'},
    {name: 'motorcycle', type: 'font-awesome', color: 'white'},
    {name: 'home', type: 'font-awesome', color: 'white'},
  ];

  return (
    <View style={styles.container}>
      <StepIndicator
        customStyles={styles.customStyles}
        currentPosition={props.steps}
        // labels={labels}
        renderLabel={stepsLabel => (
          <Text
            style={[
              styles.stepsLabelStyle,
              {
                width:
                  stepsLabel.stepStatus == 'current' ? windowWidth * 0.7 : 0,
              },
            ]}>
            {stepsLabel.stepStatus == 'current' && stepsLabel.label}
          </Text>
        )}
        stepCount={4}
        renderStepIndicator={({position, stepStatus}) => {
          return (
            <View>
              <Icon
                name={icons[position].name}
                type={icons[position].type}
                color={
                  stepStatus === 'current' || stepStatus === 'finished'
                    ? COLORS.orange
                    : COLORS.subTextColor1
                }
                size={
                  icons[position].name == 'motorcycle'
                    ? windowHeight * 0.023
                    : windowHeight * 0.028
                }
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '115%',
    alignSelf: 'center',
  },
  customStyles: {
    stepIndicatorSize: windowHeight * 0.05,
    stepIndicatorCurrentColor: COLORS.white,
    stepIndicatorFinishedColor: COLORS.white,
    stepIndicatorUnFinishedColor: COLORS.white,
    stepStrokeWidth: 0,
    separatorStrokeFinishedWidth: 3,
    separatorStrokeUnfinishedWidth: 2,
    separatorUnFinishedColor: COLORS.iconSearchColor,
    separatorFinishedColor: COLORS.orange,
    currentStepStrokeWidth: 0,
    // labelFontFamily: 'HKGrotesk-Bold',
    // labelSize: SIZES._12px,
    // labelColor: COLORS.transparent,
    // stepStrokeUnFinishedColor: COLORS.white,
    // stepStrokeFinishedColor: COLORS.white,
    // currentStepLabelColor: COLORS.orange,
  },
  stepsLabelStyle: {
    ...FONTS.bold,
    color: COLORS.orange,
    fontSize: SIZES._12px,
    textAlign: 'center',
  },
});

export default ProgressStepper;
