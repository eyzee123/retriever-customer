import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {COLORS, FONTS, SIZES, SPACING, BORDER} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
const AddressAddHeader = props => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={[styles.container, props.conatinerStyle]}>
      <View style={styles.contentContainer}>
        <View style={styles.viewLeft}>
          <TouchableOpacity onPress={goBack}>
            <Icon
              style={styles.icon}
              name="chevron-left"
              size={SIZES.iconSize.medium}
              color={COLORS.white}
              {...props}
              // onPress={goBack}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.addAddressContainer}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    backgroundColor: COLORS.tertiary,
    paddingVertical: SPACING.medium,
    paddingRight: SPACING.medium,
    paddingLeft: SPACING.x_small,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAddressContainer: {
    flex: 1,
    marginLeft: SPACING.small,
  },
  txtHeader: {
    ...FONTS.bold,
    color: COLORS.white,
  },
});

export default AddressAddHeader;
