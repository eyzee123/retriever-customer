import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {AddressContext} from '../../provider/AddressProvider';
import CartIconHeader from './CartIconHeader';
import {LOCATION} from '../../constants/ProjectConstants';

const AddressHeader = props => {
  const navigation = useNavigation();
  const addressContext = useContext(AddressContext);

  const backPress = () => {
    if (props.onBackPress) {
      navigation.navigate(props.onBackPress, {toast: false});
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles(props).container, props.conatinerStyle]}>
      <View style={styles(props).contentContainer}>
        <View style={styles(props).viewLeft}>
          {props.leftBack && (
            <TouchableOpacity
              onPress={backPress}
              style={styles(props).backPressContainer}>
              <Icon
                style={styles.icon}
                name={'chevron-left'}
                size={SIZES.iconSize.medium}
                color={COLORS.white}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles(props).viewCenter}>
          <>
            <View style={styles(props).viewCenterWrapper}>
              <TouchableOpacity
                onPress={props.onPress}
                style={[
                  styles(props).viewCenterWrapper,
                  styles(props).viewCenterTextWrapper,
                ]}>
                <Text style={styles(props).deliverText} numberOfLines={1}>
                  {props.locationPermission === LOCATION.GRANTED_PERMISSION
                    ? addressContext.primaryAddress.addressName
                    : 'No Location Provided'}
                </Text>
                <Icon
                  name={props.icon}
                  size={SIZES.iconSize.x_small}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles(props).addressText} numberOfLines={1}>
              {props.locationPermission === LOCATION.GRANTED_PERMISSION
                ? addressContext.primaryAddress.addressName !=
                  'Current Location'
                  ? addressContext.primaryAddress.addressDetails
                  : addressContext.primaryAddress.address
                : 'No Location Provided'}
            </Text>
          </>
        </View>
        {!props.noCart && <CartIconHeader />}
      </View>
      {props.children}
    </SafeAreaView>
  );
};
const styles = props =>
  StyleSheet.create({
    container: {
      width: windowWidth,
      backgroundColor: COLORS.tertiary,
      elevation: 3,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: SPACING.medium,
      marginTop: Platform.OS === 'ios' ? SPACING.x_small : SPACING.medium,
    },
    viewLeft: {
      marginLeft: -SPACING.x_small,
      marginRight: SPACING.x_small,
    },
    backPressContainer: {
      padding: SPACING.x_small,
      borderRadius: BORDER.circle,
    },
    viewCenter: {
      flex: 1,
      marginRight: windowWidth * 0.04,
    },
    viewRight: {
      height: windowHeight * 0.025,
      width: windowHeight * 0.025,
    },
    viewCenterWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewCenterTextWrapper: {
      width:
        props.locationPermission === LOCATION.GRANTED_PERMISSION
          ? windowWidth * 0.45
          : '100%',
    },
    deliverText: {
      ...FONTS.bold,
      fontSize: SIZES._16px,
      color: COLORS.white,
    },
    addressText: {
      ...FONTS.regular,
      textAlign: 'justify',
      fontSize: SIZES._12px,
      color: COLORS.subTextColor,
    },
  });
export default AddressHeader;
