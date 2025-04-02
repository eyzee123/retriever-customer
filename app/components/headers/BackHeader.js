import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';

const BackHeader = props => {
  return (
    <SafeAreaView style={[styles(props).header, props.style]}>
      <View style={styles(props).container}>
        <View style={styles(props).viewLeft}>
          <TouchableOpacity
            style={styles(props).viewLeftWrapper}
            onPress={props.onBackButtonPressed}>
            <Icon
              style={styles(props).icon}
              name="chevron-left"
              size={SIZES.iconSize.medium}
              color={props.iconColor ? props.iconColor : COLORS.orange}
            />
          </TouchableOpacity>
          <Text style={[styles(props).pageTitle, props.titleStyle]}>
            {props.pageTitle || ''}
          </Text>
        </View>
        {props.children}
      </View>
    </SafeAreaView>
  );
};

const styles = props =>
  StyleSheet.create({
    header: {
      // paddingVertical: SPACING.medium,
      // paddingHorizontal: SPACING.small,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: SPACING.small,
      marginBottom: SPACING.medium,
      marginTop: Platform.OS === 'ios' ? SPACING.x_small : SPACING.small,
    },
    pageTitle: {
      marginLeft: SPACING.small,
      ...FONTS.pageTitle,
      color: COLORS.tertiary,
    },
    viewLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewLeftWrapper: {
      padding: SPACING.x_small,
      borderRadius: BORDER.circle,
      marginLeft: -windowWidth * 0.02,
    },
  });

export default BackHeader;
