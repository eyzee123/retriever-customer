import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS, FONTS, GlobalStyle, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const CustomCheckbox = props => {
  const item = props.item;
  const selected = props.selected;

  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  useEffect(() => {
    if (selected) {
      setToggleCheckBox(true);
    }
  }, [selected]);
  // useEffect(() => {
  //   if (selected) {
  //     setToggleCheckBox(true);
  //   }
  // }, [toggleCheckBox]);

  const checkHandler = () => {
    setToggleCheckBox(!toggleCheckBox);
    props.onItemSelect({...item, selected: !toggleCheckBox});
  };
  const valueChangeHandler = value => {
    setToggleCheckBox(value);
    props.onItemSelect({...item, selected: value});
  };

  return (
    <View style={styles.container}>
      <CheckBox
        disabled={false}
        value={toggleCheckBox}
        style={styles.style}
        onValueChange={valueChangeHandler}
        tintColors={{true: COLORS.orange, false: COLORS.orange}}
        onCheckColor={COLORS.orange}
        onTintColor={COLORS.orange}
      />
      <TouchableWithoutFeedback onPress={checkHandler}>
        <View style={[styles.addonCotainer, props.addOnStyle]}>
          <Text style={styles.sectionLabel}>{item.name}</Text>
          <Text style={styles.currentPrice}>+ ₱{item.price}</Text>
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
  currentPrice: {
    ...FONTS.regular,
    color: COLORS.brown332,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.brown332,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? -windowHeight * 0.005 : null,
    marginLeft: Platform.OS === 'ios' ? windowWidth * 0.0055 : SPACING.x_small,
  },
  addonCotainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomCheckbox;
