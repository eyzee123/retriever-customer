import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import EmptyCart from '../../components/empty/EmptyCart';
import Header from '../../components/headers/Header';
import ListofCurrentOrders1 from '../../components/listItem/ListofCurrentOrders1';
import {ROUTES} from '../../constants/Routes';
import {CartContext} from '../../provider/CartProvider';
import {COLORS, SPACING} from '../../styles/theme';
import {OrderContext} from '../../provider/OrderProvider';
import {UserContext} from '../../provider/UserProvider';
import CartIconHeader from '../../components/headers/CartIconHeader';

const Cart = ({navigation}) => {
  const userCtx = useContext(UserContext);
  const cartContext = useContext(CartContext);
  const orderContext = useContext(OrderContext);

  const orderCount = index => {
    const orderCount = cartContext.items[index].product.reduce(
      (prev, current) => {
        return prev + +current.amount;
      },
      0,
    );
    return orderCount;
  };

  const gotoCartDetails = item => {
    orderContext.addOrderItem(item);
    navigation.navigate(ROUTES.CART_DETAILS);
  };

  const deleteItemHandler = id => {
    cartContext.removeItem(id);
  };

  let cartContent = (
    <EmptyCart
      label="Your bag is empty."
      sub_label={`Empty bag equals empty stomach, let’s${'\n'}fill your stomach up.`}
      tap_here="Tap here."
      onPress={() => navigation.navigate(ROUTES.FOOD)}
    />
  );

  if (cartContext.items.length > 0) {
    cartContent = (
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={cartContext.items.sort((a, b) => b.createdAt - a.createdAt)}
          renderItem={({item, index}) => (
            <View style={styles.listWrapper}>
              <ListofCurrentOrders1
                id={item.id}
                avatar={item.storeProfilePhoto}
                storeName={item.storeName}
                total_price={item.totalAmount}
                order_count={orderCount(index)}
                order_status={'N/A'}
                onPressDetails={gotoCartDetails.bind(this, item)}
                onItemDelete={deleteItemHandler}
                store={item}
              />
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <MainScreen containerStyle={styles.contentContainer}>
      <Header title="Cart List">
        {userCtx.isLoggedIn && <CartIconHeader />}
      </Header>
      <MainFrame fullscreen>{cartContent}</MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.whiteFA,
  },
  container: {
    flex: 1,
    marginHorizontal: SPACING.medium,
  },
  listWrapper: {
    marginTop: SPACING.medium,
  },
});
export default Cart;
