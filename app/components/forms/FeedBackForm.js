import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, Platform} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import CustomDropDown from '../../components/general/CustomDropdown';
import RoundedInput from '../cores/RoundedInput';
import RoundedButton from '../cores/RoundedButton';

const FeedBackForm = props => {
  const [value, setValue] = useState(0);
  const data = [
    {
      label: 'Sample',
      value: 1,
    },
    {
      label: 'Sample2',
      value: 2,
    },
  ];
  return (
    <View style={{flex: 1}}>
      <Text style={styles.sectionLabel}>Where can we improve?</Text>
      <CustomDropDown
        placeholder="Browsing Items"
        data={data}
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
      />
      <Text style={[styles.sectionLabel, {marginTop: SPACING.x_large}]}>
        Extra Details
      </Text>
      <Text style={styles.sectionSub}>
        If you have extra comments for how we can improve, kindly input it
        below.
      </Text>
      <RoundedInput
        multiline={true}
        numberOfLines={4}
        minHeight={Platform.OS === 'ios' ? 20 * 4 : null}
        textAlignVertical="top"
        placeholder="Enter extra details here..."
      />
      <View style={styles.btnContainer}>
        <RoundedButton text="Submit Feedback" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginBottom: SPACING.x_small,
  },
  sectionSub: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
    marginBottom: SPACING.x_small,
  },
  btnContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default FeedBackForm;
