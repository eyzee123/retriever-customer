import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {ROUTES} from '../../constants/Routes';
import {useNavigation} from '@react-navigation/native';
import {CartContext} from '../../provider/CartProvider';

const FloatingCart = props => {
  const navigation = useNavigation();
  const cartContext = useContext(CartContext);

  const {items} = cartContext;
  let numberofCartitems = 0;

  items.forEach(item => {
    item.product.forEach(product => {
      numberofCartitems += +product.amount;
    });
  });
  return (
    <>
      {numberofCartitems > 0 && (
        <TouchableOpacity
          style={styles.container}
          onPress={() => navigation.navigate(ROUTES.CART)}>
          <View style={styles.badge}>
            <Text style={styles.quantity}>{numberofCartitems}</Text>
          </View>
          <Icon
            name="shopping"
            size={windowHeight * 0.038}
            color={COLORS.white}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    right: 0,
    height: windowHeight * 0.08,
    width: windowHeight * 0.08,
    borderRadius: BORDER.circle,
    backgroundColor: COLORS.darkGreen,
    borderColor: COLORS.lightGray,
    margin: SPACING.medium,
    elevation: 20,
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange,
    // width: windowHeight * 0.021,
    // height: windowHeight * 0.021,
    paddingHorizontal: windowWidth * 0.01,
    borderRadius: BORDER.circle,
    top: windowHeight * 0.017,
    right: windowWidth * 0.02,
    zIndex: 1,
    elevation: 20,
  },
  quantity: {
    ...FONTS.bold,
    fontSize: windowHeight * 0.0132,
    color: COLORS.white,
  },
});
export default FloatingCart;
