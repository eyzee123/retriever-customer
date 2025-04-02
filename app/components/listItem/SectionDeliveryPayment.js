import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
const SectionDeliveryPayment = props => {
  return (
    <TouchableOpacity
      style={styles(props).container}
      onPress={props.onPress}
      disabled={props.disabled ? true : false}>
      {props.icon ? (
        <Icon
          name={props.icon}
          size={SIZES.iconSize.small}
          color={COLORS.orange}
          style={{marginLeft: windowHeight * 0.004}}
        />
      ) : (
        <View style={[styles(props).viewLeft, props.imageStyle]}>
          <Image
            resizeMode="stretch"
            source={props.image}
            style={{height: '100%', width: '100%'}}
          />
        </View>
      )}
      <View style={{flex: 1}}>
        <Text style={[styles(props).sectionLabel, props.titleStyle]}>
          {props.title}
        </Text>
        {props.subTitle && (
          <Text style={[styles(props).sectionLabel, styles(props).subTitle]}>
            {props.subTitle}
          </Text>
        )}
      </View>
      <View style={styles(props).viewCenter}>
        {props.children}
        <Text style={styles(props).time}>{props.status}</Text>
        {props.chevron && (
          <Icon
            name="chevron-right"
            color={COLORS.darkGreen}
            size={SIZES.iconSize.medium}
          />
        )}
      </View>
      {props.hasCancel && (
        <TouchableOpacity onPress={props.onCancel}>
          <Text style={[styles(props).time, {color: COLORS.orange}]}>
            Remove
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.small,
      borderRadius: BORDER.roundedCornerInput,
      borderColor: COLORS.subTextColor,
      borderWidth: 1,
    },
    viewLeft: {
      height: windowHeight * 0.02,
      width: windowHeight * 0.02,
      marginHorizontal: windowHeight * 0.004,
    },
    viewCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionLabel: {
      ...GlobalStyle.sectionLabel,
      flex: 1,
      paddingLeft: windowHeight * 0.011,
      marginRight: SPACING.small,
      fontSize: SIZES._14px,
      color: COLORS.darkGreen,
    },
    subTitle: {
      fontSize: SIZES._12px,
      color: COLORS.subTextColor1,
    },
    time: {
      ...FONTS.regular,
      alignSelf: 'flex-start',
      color: COLORS.darkGreen,
      fontSize: SIZES._12px,
      marginTop: props.chevron
        ? Platform.OS === 'ios'
          ? windowHeight * 0.007
          : windowHeight * 0.0028
        : 0,
    },
  });

export default SectionDeliveryPayment;
