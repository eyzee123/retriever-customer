import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Image} from 'react-native';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RoundedButton = props => {
  const disbaledButton = props.disabled && {
    backgroundColor: COLORS.disabled,
  };
  return (
    <TouchableOpacity
      {...props}
      style={[styles(props).btnStyle, props.btnStyle, disbaledButton]}>
      <View style={[styles(props).btnTextContainer, props.btnTextContainer]}>
        {props.image ? (
          <View style={styles(props).viewLeft}>
            <Image
              source={props.image}
              resizeMode="stretch"
              style={{width: '100%', height: '100%'}}
            />
          </View>
        ) : props.icon ? (
          <Icon
            name={props.icon}
            color={COLORS.white}
            size={windowHeight * 0.022}
            style={[styles(props).icon, props.iconStyle]}
          />
        ) : null}
        {props.children}
        <Text style={[styles(props).btnText, props.btnText]}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = props =>
  StyleSheet.create({
    btnStyle: {
      backgroundColor: props.outline ? COLORS.transparent : COLORS.orange,
      borderWidth: props.outline ? 0.3 : 0,
      borderColor: props.outline ? COLORS.subTextColor1 : COLORS.transparent,
      borderRadius: BORDER.circle,
      padding: SPACING.small,
      marginVertical: SPACING.x_small,
      width: props.width ? props.width : '100%',
    },
    btnTextContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewLeft: {
      height: windowHeight * 0.016,
      width: windowHeight * 0.016,
      marginRight: SPACING.x_small,
    },
    btnText: {
      ...FONTS.bold,
      color: props.outline ? COLORS.darkGreen : COLORS.white,
    },
    icon: {
      marginRight: SPACING.x_small,
    },
  });

export default RoundedButton;
