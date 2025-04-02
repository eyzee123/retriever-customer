import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ListDeleteReason = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.containerWrapper}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.body}>{props.body}</Text>
      </View>
      <Icon
        name="chevron-right"
        color={COLORS.darkGreen}
        size={SIZES.iconSize.medium}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    borderRadius: BORDER.roundedCornerInput,
    borderColor: COLORS.subTextColor,
    borderWidth: 1,
  },
  containerWrapper: {
    flex: 1,
  },
  title: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginTop: -windowWidth * 0.006,
  },
  body: {
    ...FONTS.regular,
    color: COLORS.subTextColor1,
  },
});

export default ListDeleteReason;
