import React from 'react';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../styles/theme';

const BackButton = props => {
  return (
    <TouchableOpacity onPress={props.onBackButtonPressed}>
      {Platform.OS === 'ios' ? (
        <Icon
          style={styles.icon}
          name="chevron-back-outline"
          size={25}
          color={COLORS.orange}
        />
      ) : (
        <Icon
          style={styles.icon}
          name="md-arrow-back"
          size={25}
          color={COLORS.orange}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default BackButton;
