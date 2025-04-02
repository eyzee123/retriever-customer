import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../styles/theme';
import ToggleSwitch from 'toggle-switch-react-native';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const CustomSwitch = props => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <ToggleSwitch
        onColor={COLORS.orange}
        offColor={'#EAECF0'}
        circleColor={COLORS.white}
        trackOnStyle={styles.switchStyleOn}
        trackOffStyle={styles.switchStyleOff}
        isOn={isEnabled}
        onToggle={toggleSwitch}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    transform: [
      {scaleX: windowWidth * 0.0025}, //1
      {scaleY: windowHeight * 0.0013}, //0.9
    ],
  },
});

export default CustomSwitch;
