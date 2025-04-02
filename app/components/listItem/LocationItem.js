import React, {memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, SIZES, SPACING, BORDER} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Edit from '../../assets/icons/edit.svg';

const LocationItem = props => {
  return (
    <Pressable onPress={props.setPrimaryAddress}>
      <View
        style={[
          styles.addressContainer,
          {borderWidth: props.checked == props.index ? 1 : 0},
        ]}
        key={props.index}>
        <Icon
          name={
            props.checked == props.index
              ? 'checkbox-marked-circle'
              : 'checkbox-blank-circle-outline'
          }
          color={props.checked == props.index ? COLORS.orange : COLORS.grayText}
          size={SIZES.medium}
        />
        <View style={styles.viewCenter}>
          <Text style={styles.txtSectionTitle} numberOfLines={1}>
            {props.item.addressName}
          </Text>
          <Text style={styles.txtAddress} numberOfLines={1}>
            {props.item.addressName != 'Current Location'
              ? props.item.addressDetails
              : props.item.address}
          </Text>
        </View>
        {props.item.addressName != 'Current Location' ? (
          <TouchableOpacity onPress={props.goToEditAddress}>
            <Edit />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    borderRadius: BORDER.roundedCornerPopupCard,
    marginTop: SPACING.x_small,
    borderColor: COLORS.subTextColor,
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  txtSectionTitle: {
    ...FONTS.bold,
    flexWrap: 'wrap',
    fontSize: SIZES._14px,
    color: COLORS.red,
    paddingHorizontal: SPACING.small,
  },
  txtAddress: {
    ...FONTS.regular,
    flexWrap: 'wrap',
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
    paddingHorizontal: SPACING.small,
  },
});
export default memo(LocationItem);
