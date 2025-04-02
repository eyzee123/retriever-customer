import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../styles/theme';

const ListTransactionHistory = props => {
  return (
    <View style={styles.container}>
      <View style={styles.viewLeft}>
        <Text style={styles.transaction}>{props.transaction}</Text>
        <Text style={styles.type}>{props.type}</Text>
      </View>
      <View style={styles.viewRight}>
        <Text style={styles.money}>{props.money}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLeft: {
    flex: 1,
  },
  transaction: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  type: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  viewRight: {
    alignItems: 'flex-end',
  },
  money: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  date: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
});
export default ListTransactionHistory;
