import React from 'react';
import {StyleSheet, View, Text, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';

const ListContacts = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Icon
        name="account-circle"
        size={windowHeight * 0.055}
        color={COLORS.subTextColor1}
      />
      <View style={styles.viewCenter}>
        <Text style={styles.contactName}>{props.name}</Text>
        <Text style={styles.contactNo}>+63 {props.contact}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCenter: {
    flex: 1,
    marginLeft: SPACING.small,
  },
  contactName: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  contactNo: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
});

export default ListContacts;
