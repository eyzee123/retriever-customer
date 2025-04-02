import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {windowHeight} from '../../utils/Dimensions';
import {COLORS, GlobalStyle, SPACING} from '../../styles/theme';

const CustomCheckbox1 = props => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const valueChangeHandler = value => {
    props.onSelect(value);
    setToggleCheckBox(value);
  };

  const checkHandler = () => {
    props.onSelect(!toggleCheckBox);
    setToggleCheckBox(!toggleCheckBox);
  };

  return (
    <View style={styles.container}>
      <CheckBox
        value={toggleCheckBox}
        style={styles.style}
        onValueChange={valueChangeHandler}
        tintColors={{true: COLORS.orange, false: COLORS.orange}}
        onCheckColor={COLORS.orange}
        onTintColor={COLORS.orange}
      />
      <TouchableWithoutFeedback onPress={checkHandler}>
        <View style={[styles.addonCotainer, props.addOnStyle]}>
          <Text style={styles.sectionLabel}>{props.text}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  style: {
    marginLeft: Platform.OS === 'ios' ? windowHeight * 0.004 : 0,
    transform:
      Platform.OS === 'ios'
        ? [{scaleX: 0.7}, {scaleY: 0.7}]
        : [{scaleX: 0.9}, {scaleY: 0.9}],
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? -windowHeight * 0.005 : null,
    marginLeft: SPACING.x_small,
  },
  addonCotainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomCheckbox1;
