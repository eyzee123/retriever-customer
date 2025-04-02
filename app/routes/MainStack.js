import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../styles/theme';
import Home from '../screens/home/Home';
import Login from '../screens/auth/Login';
import Food from '../screens/home/Food';
import RestaurantProfile from '../screens/restaurant/RestaurantProfile';
import Register from '../screens/auth/Register';
import Register2 from '../screens/auth/Register2';
import Profile from '../screens/account/Profile';
import GetStarted from '../screens/splash/GetStarted';
import About from '../screens/about/About';
import Settings from '../screens/settings/Settings';
import OrderProcess from '../screens/orders/OrderProcess';
import OTP from '../screens/auth/OTP';
import AddressDetails from '../screens/address/AddressDetails';
import Address from '../screens/address/Address';
import ChooseLocation from '../screens/address/ChooseLocation';
import EditAddress from '../screens/address/EditAddress';
import SearchProduct from '../screens/search/SearchProduct';
import RestaurantInfo from '../screens/restaurant/RestaurantInfo';
import AddToCart from '../screens/order/AddtoCart';
import CartDetails from '../screens/order/CartDetails';
import AddPromo from '../screens/order/AddPromo';
import AddCard from '../screens/order/AddCard';
import TrackOrder from '../screens/order/TrackOrder';
import CurrentOrders from '../screens/order/CurrentOrders';
import FeedBack from '../screens/support/FeedBack';
import Congrats from '../screens/splash/Congrats';
import OrderReview from '../screens/order/OrderReview';
import History from '../screens/history/History';
import Call from '../screens/call/Call';
import Message from '../screens/call/Messaging';
import Wallet from '../screens/wallet/Wallet';
import WalletTransfer from '../screens/wallet/WalletTransfer';
import WalletContactList from '../screens/wallet/WalletContactList';
import WalletReview from '../screens/wallet/WalletReview';
import WalletSuccess from '../screens/wallet/WalletSuccess';
import WalletTopUp from '../screens/wallet/WalletTopUp';
import ChangePassword from '../screens/account/ChangePassword';
import Status from '../screens/stories/Status';
import {ROUTES} from '../constants/Routes';
import ChangePhoneNumber from '../screens/account/ChangePhoneNumber';
import Cart from '../screens/order/Cart';
import OrderDetails from '../screens/history/OrderDetails';
import ForgotPassword from '../screens/account/ForgotPassword';
import EmailSent from '../screens/account/EmailSent';
import ResetPassword from '../screens/account/ResetPassword';
import TermsAndConditions from '../screens/support/TermsAndConditions';
import {getLocalDataObject} from '../services/Storage/LocalStorageService';
import {LOCAL_STORAGE} from '../constants/ProjectConstants';
import DeleteAccount from '../screens/account/DeleteAccount';
import Request from '../screens/account/Request';
import ChangePhoneOTP from '../screens/auth/ChangePhoneOTP';
import LocalBests from '../screens/restaurant/LocalBests';
import NoStoresNearby from '../screens/maintenance/NoStoresNearby';
import {AddressContext} from '../provider/AddressProvider';
import {StoreContext} from '../provider/StoreProvider';
import {useContext} from 'react';
import {getSpecificDistance} from '../utils/HelperFunctions';

const Stack = createStackNavigator();
const MainStack = () => {
  const storeContext = useContext(StoreContext);
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;
  const [appOppenedState, setAppOpenedState] = useState('false');

  useEffect(() => {
    const isAppOpened = async () => {
      const appOpened = await getLocalDataObject(LOCAL_STORAGE.APP_OPENED);
      setAppOpenedState(appOpened?.appOpened);
    };

    isAppOpened();
  }, []);

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const filteredTopSellableProductsLength = () => {
    const filteredTopSellableProducts = storeContext.storeList?.filter(item =>
      origin.latitude !== undefined && origin.longitude !== undefined
        ? getSpecificDistance(origin, {
            latitude: item.latitude,
            longitude: item.longitude,
          }) <= 4
        : null,
    );
    return filteredTopSellableProducts?.length;
  };

  return (
    <Stack.Navigator
      style={{color: COLORS.tertiary}}
      initialRouteName={ROUTES.GET_STARTED}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={ROUTES.GET_STARTED}
        component={appOppenedState == 'true' ? Home : GetStarted}
      />
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} />
      <Stack.Screen name={ROUTES.REGISTER_2} component={Register2} />
      <Stack.Screen name={ROUTES.OTP} component={OTP} />
      <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen
        name={ROUTES.FOOD}
        component={
          filteredTopSellableProductsLength() > 0 ? Food : NoStoresNearby
        }
      />
      <Stack.Screen name={ROUTES.ABOUT} component={About} />
      <Stack.Screen name={ROUTES.CONGRATS} component={Congrats} />
      <Stack.Screen name={ROUTES.ORDER_PROCESS} component={OrderProcess} />
      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen
        name={ROUTES.RESTAURANT_PROFILE}
        component={RestaurantProfile}
      />
      <Stack.Screen name={ROUTES.ADDRESS} component={Address} />
      <Stack.Screen name={ROUTES.CHOOSE_LOCATION} component={ChooseLocation} />
      <Stack.Screen name={ROUTES.ADDRESS_DETAILS} component={AddressDetails} />
      <Stack.Screen name={ROUTES.EDIT_ADDRESS} component={EditAddress} />
      <Stack.Screen name={ROUTES.SEARCH_PRODUCT} component={SearchProduct} />
      <Stack.Screen name={ROUTES.RESTAURANT_INFO} component={RestaurantInfo} />
      <Stack.Screen name={ROUTES.ADD_TO_CART} component={AddToCart} />
      <Stack.Screen name={ROUTES.CART_DETAILS} component={CartDetails} />
      <Stack.Screen name={ROUTES.ORDER_REVIEW} component={OrderReview} />
      <Stack.Screen name={ROUTES.ADD_PROMO} component={AddPromo} />
      <Stack.Screen name={ROUTES.ADD_CARD} component={AddCard} />
      <Stack.Screen name={ROUTES.TRACK_ORDER} component={TrackOrder} />
      <Stack.Screen name={ROUTES.CURRENT_ORDERS} component={CurrentOrders} />
      <Stack.Screen name={ROUTES.CART} component={Cart} />
      <Stack.Screen name={ROUTES.FEEDBACK} component={FeedBack} />
      <Stack.Screen name={ROUTES.HISTORY} component={History} />
      <Stack.Screen name={ROUTES.CALL} component={Call} />
      <Stack.Screen name={ROUTES.MESSAGE} component={Message} />
      <Stack.Screen name={ROUTES.ORDER_DETAILS} component={OrderDetails} />
      <Stack.Screen name={ROUTES.WALLET} component={Wallet} />
      <Stack.Screen name={ROUTES.WALLET_TRANSFER} component={WalletTransfer} />
      <Stack.Screen
        name={ROUTES.WALLET_CONTACT_LIST}
        component={WalletContactList}
      />
      <Stack.Screen name={ROUTES.WALLET_REVIEW} component={WalletReview} />
      <Stack.Screen name={ROUTES.WALLET_SUCCESS} component={WalletSuccess} />
      <Stack.Screen name={ROUTES.WALLET_TOPUP} component={WalletTopUp} />
      <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePassword} />
      <Stack.Screen
        name={ROUTES.CHANGE_PHONE_NUMBER}
        component={ChangePhoneNumber}
      />
      <Stack.Screen name={ROUTES.STATUS} component={Status} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
      <Stack.Screen name={ROUTES.EMAIL_SENT} component={EmailSent} />
      <Stack.Screen name={ROUTES.RESET_PASSWORD} component={ResetPassword} />
      <Stack.Screen
        name={ROUTES.TERMS_AND_CONDITIONS}
        component={TermsAndConditions}
      />
      <Stack.Screen name={ROUTES.DELETE_ACCOUNT} component={DeleteAccount} />
      <Stack.Screen name={ROUTES.REQUEST} component={Request} />
      <Stack.Screen name={ROUTES.CHANGE_PHONE_OTP} component={ChangePhoneOTP} />
      <Stack.Screen name={ROUTES.LOCAL_BESTS} component={LocalBests} />
      <Stack.Screen name={ROUTES.NO_STORES_NEARBY} component={NoStoresNearby} />
    </Stack.Navigator>
  );
};

export default MainStack;
