import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomCheckbox from '../general/CustomCheckBox';
import {windowHeight} from '../../utils/Dimensions';

const LinearFilters = props => {
  return (
    <View style={styles.rowContainer}>
      {/* <Icon
        name={props.icon}
        size={SIZES.iconSize.small}
        color={COLORS.orange}
        style={props.iconStyle}
      /> */}
      <View style={[styles.imageContainer, props.imageStyle]}>
        <Image
          resizeMode="stretch"
          source={props.image}
          style={{height: '100%', width: '100%'}}
        />
      </View>
      <Text style={styles.sectionText}>
        {props.text} <Text style={styles.count}>({props.count}+)</Text>
      </Text>
      <CustomCheckbox />
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.small,
    borderColor: 'transparent',
    borderBottomColor: COLORS.subTextColor1,
    borderWidth: 0.2,
    paddingBottom: SPACING.x_small,
  },
  imageContainer: {
    height: windowHeight * 0.02,
    width: windowHeight * 0.02,
  },
  sectionText: {
    ...FONTS.bold,
    flex: 1,
    marginLeft: SPACING.small,
  },
  count: {
    color: COLORS.subTextColor1,
    fontSize: SIZES._12px,
  },
});

export default LinearFilters;
