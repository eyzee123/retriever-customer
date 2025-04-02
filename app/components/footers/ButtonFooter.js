import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BORDER, COLORS, FONTS, GlobalStyle, SPACING} from '../../styles/theme';
import CartIcon from '../../assets/icons/cart.svg';
import CheckIcon from '../../assets/icons/check.svg';
const ButtonFooter = ({children, page}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn}>
        <View style={styles.btnView}>
          <View style={{flexDirection: 'row'}}>
            {page === 'restaurantProfile' ? (
              <CartIcon height={15} width={15} style={styles.icon} />
            ) : (
              <CheckIcon height={15} width={15} style={styles.icon} />
            )}
            <Text style={styles.leftTextL}>1 Item</Text>
          </View>
          <Text style={styles.priceText}>₱ 230</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  btn: {
    backgroundColor: COLORS.orange,
    borderRadius: BORDER.roundedCornerButton,
  },
  btnView: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 5,
    flex: 1,
  },
  leftTextL: {
    ...FONTS.regular,
    color: COLORS.white,
  },
  priceText: {
    ...FONTS.bold,
    color: COLORS.white,
  },
});

export default ButtonFooter;
