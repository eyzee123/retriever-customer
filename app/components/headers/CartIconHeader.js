import {useNavigation} from '@react-navigation/core';
import React, {useContext, useState, useEffect} from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IMAGES} from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {CartContext} from '../../provider/CartProvider';
import {UserContext} from '../../provider/UserProvider';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const CartIconHeader = props => {
  const userCtx = useContext(UserContext);
  const navigation = useNavigation();
  const cartContext = useContext(CartContext);
  const [iconIsHiglighted, setIconIsHiglighted] = useState(false);

  const {items} = cartContext;
  let numberofCartitems = 0;

  const initialValue = new Animated.Value(1);
  const AnimatedIcon = Animated.createAnimatedComponent(TouchableOpacity);

  items.forEach(item => {
    item.product.forEach(product => {
      numberofCartitems += +product.amount;
    });
  });

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    Animated.spring(initialValue, {
      toValue: 2,
      speed: 50,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(initialValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  }, [items]);
  return (
    <>
      {userCtx.isLoggedIn && (
        <AnimatedIcon
          style={[
            styles.viewRight,
            // {transform: [{scale: initialValue}]}
          ]}
          onPress={() => navigation.navigate(ROUTES.CURRENT_ORDERS)}>
          <Image
            resizeMode="stretch"
            source={IMAGES.LIST_ORDERS}
            style={{
              height: windowHeight * 0.025,
              width: windowHeight * 0.018,
            }}
          />
          {/* {cartContext.items.length > 0 && (
            <View style={styles.cartQuantityContainer}>
              <Text style={styles.cartQuantity}>{numberofCartitems}</Text>
            </View>
          )} */}
        </AnimatedIcon>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  viewRight: {
    paddingVertical: windowWidth * 0.02,
    paddingHorizontal: windowWidth * 0.03,
    borderRadius: BORDER.circle,
  },
  cartQuantityContainer: {
    position: 'absolute',
    backgroundColor: COLORS.orange,
    borderRadius: BORDER.circle,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowHeight * 0.018,
    height: windowHeight * 0.018,
    right: -windowHeight * 0.012,
    top: -windowHeight * 0.007,
  },
  cartQuantity: {
    ...FONTS.bold,
    fontSize: SIZES._8px,
    color: COLORS.white,
  },
});
export default CartIconHeader;
