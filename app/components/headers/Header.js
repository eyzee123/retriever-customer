import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const Header = props => {
  const navigation = useNavigation();
  const goBack = () => {
    if (props.onBackPressed) {
      props.onBackPressed();
    } else {
      navigation.goBack();
    }
  };
  return (
    <SafeAreaView style={[styles(props).container, props.containerStyle]}>
      <View style={styles(props).contentContainer}>
        <View style={styles(props).viewLeft}>
          <TouchableOpacity
            onPress={goBack}
            style={[
              styles(props).backPressContainer,
              props.backPressContainer,
            ]}>
            <Icon
              style={styles(props).icon}
              name="chevron-left"
              size={SIZES.iconSize.medium}
              color={props.transparent ? COLORS.orange : COLORS.white}
              // onPress={goBack}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles(props).txtHeader, props.txtHeader]}>
          {props.title}
        </Text>
        {props.children}
      </View>
    </SafeAreaView>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      width: windowWidth,
      backgroundColor: props.transparent ? COLORS.white : COLORS.tertiary,
      // elevation: 3,
      // zIndex: 1,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: SPACING.small,
      marginBottom: SPACING.small,
      marginTop: Platform.OS === 'ios' ? SPACING.x_small : SPACING.small,
    },
    backPressContainer: {
      padding: SPACING.x_small,
      borderRadius: BORDER.circle,
    },
    txtHeader: {
      ...FONTS.bold,
      flex: 1,
      fontSize: SIZES._16px,
      color: COLORS.white,
      marginLeft: SPACING.x_small,
      marginTop: -windowWidth * 0.006,
    },
  });

export default Header;
