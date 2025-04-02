import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES, SPACING, BORDER} from '../../styles/theme';
import Edit from '../../assets/icons/edit.svg';
import {ROUTES} from '../../constants/Routes';

const ListSavedLocations = props => {
  const [checked, setChecked] = React.useState('');

  useEffect(() => {
    console.log('use effect ' + JSON.stringify(props.list[0]));
  }, []);

  const setPrimaryAddress = (item, index) => {
    setChecked(index);
    console.log(JSON.stringify(item));
  };

  const goToEditAddress = item => {
    console.log('item ' + JSON.stringify(item));
    props.navigation.navigate(ROUTES.EDIT_ADDRESS, {address: item});
  };

  return (
    <View>
      {props.list.map((item, index) => {
        return (
          <View style={styles.container}>
            <Pressable onPress={() => setPrimaryAddress(item, index)}>
              <Icon
                name={
                  checked == index
                    ? 'checkbox-marked-circle'
                    : 'checkbox-blank-circle-outline'
                }
                color={checked == index ? COLORS.orange : COLORS.grayText}
                size={SIZES.medium}
              />
            </Pressable>

            <View style={styles.viewCenter}>
              <Text style={styles.txtSectionTitle}>{item.addressName}</Text>
              <Text style={styles.txtAddress} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
            {item.addressName != 'Current Location' ? (
              <TouchableOpacity
                onPress={() => {
                  goToEditAddress(item);
                }}>
                <Edit />
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    borderRadius: BORDER.roundedCornerPopupCard,
    marginTop: SPACING.x_small,
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  txtSectionTitle: {
    ...FONTS.bold,
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

export default ListSavedLocations;
