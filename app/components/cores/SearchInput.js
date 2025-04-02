import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import ReactNativeInputSearchBar from 'react-native-input-search-bar';

const SearchInput = props => {
  return props.outline ? (
    <>
      <ReactNativeInputSearchBar
        onSubmitSearch={props.onSubmitSearch}
        onActiveSearch={props.onActiveSearch}
        inputTextStyle={styles(props).inputStyle1}
        customIcon={
          <Icon
            name="magnify"
            size={SIZES.iconSize.medium}
            style={styles(props).icon}
            color={COLORS.subTextColor1}
          />
        }
        buttonStyle={{
          display: 'none',
        }}
        inputContainerStyle={[
          styles(props).inputContainer,
          {height: windowHeight * 0.057},
        ]}
        inputProps={{
          placeholder: props.placeholder,
          placeholderTextColor: COLORS.subTextColor1,
          onChangeText: props.onChangeText,
        }}
        clearButton={false}
      />
    </>
  ) : (
    <View
      style={[styles(props).inputContainer, props.searchInputContainerStyle]}>
      {props.icon && (
        <Icon
          style={styles(props).icon}
          name={props.icon}
          size={SIZES.iconSize.medium}
          color={COLORS.white}
        />
      )}
      <TextInput
        style={[styles(props).inputStyle, props.inputStyles]}
        {...props}
        placeholderTextColor={COLORS.white}
      />
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: windowHeight * 0.055,
      width: '100%',
      paddingHorizontal: SPACING.small,
      borderRadius: BORDER.roundedCornerBox,
      backgroundColor: '#F0F0F0B2',
      borderWidth: 0,
    },
    icon: {
      marginRight: SPACING.x_small,
    },
    inputStyle: {
      ...FONTS.regular,
      flex: 1,
      color: COLORS.white,
      marginBottom: -windowHeight * 0.002,
    },
    inputStyle1: {
      ...FONTS.bold,
      flex: 1,
      color: COLORS.darkGreen,
      marginBottom: -windowHeight * 0.002,
    },
  });

export default SearchInput;
