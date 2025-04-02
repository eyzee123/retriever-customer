import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {RoundedCheckbox} from 'react-native-rounded-checkbox';
import {windowHeight} from '../../utils/Dimensions';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ListPaymentMethod = props => {
  const [checkText, setCheckText] = useState('');
  const [checkTextType, setCheckTextType] = useState(['', '✓']);
  const isChecked = () => {
    if (checkText == checkTextType[0]) {
      setCheckText('✓');
    } else {
      setCheckText('');
    }
  };
  return (
    <TouchableOpacity style={styles.paymentContainer} onPress={props.onPress}>
      <Image resizeMode="stretch" source={props.image} style={styles.image} />
      <View style={styles.viewCenter}>
        <Text style={styles.txtSectionTitle}>{props.title}</Text>
        {props.description && (
          <Text style={styles.txtType}>{props.description}</Text>
        )}
      </View>
      {/* <RoundedCheckbox
        text={checkText}
        textStyle={{fontSize: SIZES.x_small}}
        innerStyle={styles.innerStyle}
        outerStyle={styles.outerStyle}
        uncheckedColor={COLORS.white}
        checkedColor={COLORS.orange}
        onPress={isChecked}
      /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    borderColor: COLORS.subTextColor,
    borderWidth: 1,
    borderRadius: BORDER.roundedCornerPopupCard,
    marginTop: SPACING.x_small,
  },
  image: {
    marginRight: SPACING.small,
    width: windowHeight * 0.035,
    height: windowHeight * 0.025,
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  txtSectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES._14px,
    color: COLORS.darkGreen,
    paddingHorizontal: SPACING.small,
  },
  txtType: {
    ...FONTS.regular,
    flexWrap: 'wrap',
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
    paddingHorizontal: SPACING.small,
  },
  innerStyle: {
    height: SIZES.iconSize.small,
    width: SIZES.iconSize.small,
    borderWidth: 1.5,
    borderColor: COLORS.subTextColor,
  },
  outerStyle: {
    height: SIZES.iconSize.small,
    width: SIZES.iconSize.small,
  },
});
export default ListPaymentMethod;
