import * as React from 'react';
import {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import MainStack from './app/routes/MainStack';
import {UserProvider} from './app/provider/UserProvider';
import {DeviceLocationProvider} from './app/provider/LocationProvider';
import {AddressProvider} from './app/provider/AddressProvider';
import {ChatProvider} from './app/provider/ChatProvider';
import {StoreProvider} from './app/provider/StoreProvider';
import FlashMessage from 'react-native-flash-message';
import {OtpProvider} from './app/provider/OtpProvider';
import {CartProvider} from './app/provider/CartProvider';
import {ProductProvider} from './app/provider/ProductProvider';
import {OrderProvider} from './app/provider/OrderProvider';
import PushService from './app/services/PushService';
import SplashScreen from 'react-native-splash-screen';
import {RateReviewProvider} from './app/provider/RateReviewProvider';
import {DynamicContentProvider} from './app/provider/DynamicContentProvider';
import Maintenance from './app/screens/maintenance/Maintenance';
import {COLLECTION} from './app/constants/Collections';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import {Alert, Platform} from 'react-native';
import {Linking} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from './app/screens/maintenance/NoInternetConnection';

export default function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [newAppVersion, setNewAppVersion] = useState(null);
  const [isNetConnected, setIsNetConnected] = useState(false);
  const appSettings = firestore().collection(COLLECTION.SETTINGS);

  const getAppMaintenance = () => {
    appSettings.doc('appMaintenance').onSnapshot(snapshot => {
      setIsMaintenance(snapshot.data()?.isMaintenance);
    });
  };

  const getNewVersion = () => {
    appSettings.doc('versions').onSnapshot(querySnapshot => {
      let version;
      if (Platform.OS === 'ios') {
        version = querySnapshot.data()?.iosBuyerVersion;
      } else {
        version = querySnapshot.data()?.buyerVersion;
      }
      setNewAppVersion(version);
      if (DeviceInfo.getVersion() !== version) {
        if (Platform.OS === 'ios') {
          SplashScreen.hide();
        }
        Alert.alert(
          'We have an update!',
          'Your current app version of Retriever is now out of date. Update to the latest version now.',
          [
            {
              text: 'Update now',
              onPress: () =>
                Platform.OS === 'ios'
                  ? Linking.openURL(
                      'https://apps.apple.com/us/app/retriever-ph-food-delivery/id1671266564',
                    )
                  : Linking.openURL(
                      'http://play.google.com/store/apps/details?id=com.retrieverbuyer',
                    ),
            },
          ],
          {cancelable: false},
        );
      } else {
        SplashScreen.hide();
      }
    });
  };

  const checkConnectivity = () => {
    // For Android devices
    if (Platform.OS === 'android') {
      NetInfo.fetch().then(isConnected => {
        setIsNetConnected(isConnected.isConnected);
      });
    } else {
      // For iOS devices
      NetInfo.addEventListener(isConnected => {
        setIsNetConnected(isConnected.isConnected);
      });
    }
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  useEffect(() => {
    navigator.geolocation = require('react-native-geolocation-service');
    getAppMaintenance();
    getNewVersion();
  }, []);

  return !isNetConnected ? (
    <NoInternetConnection />
  ) : isMaintenance ? (
    <Maintenance />
  ) : newAppVersion !== DeviceInfo.getVersion() ? null : (
    <NavigationContainer>
      <PaperProvider>
        <DynamicContentProvider>
          <RateReviewProvider>
            <OrderProvider>
              <CartProvider>
                <ProductProvider>
                  <StoreProvider>
                    <ChatProvider>
                      <DeviceLocationProvider>
                        <AddressProvider>
                          <UserProvider>
                            <PushService />
                            <FlashMessage position="top" />
                            <MainStack />
                          </UserProvider>
                        </AddressProvider>
                      </DeviceLocationProvider>
                    </ChatProvider>
                  </StoreProvider>
                </ProductProvider>
              </CartProvider>
            </OrderProvider>
          </RateReviewProvider>
        </DynamicContentProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}
