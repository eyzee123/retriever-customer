import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import CustomDrawer from '../components/navigations/CustomDrawer';
import Address from '../screens/address/Address';
import History from '../screens/history/History';
import Home from '../screens/home/Home';
import About from '../screens/about/About';
import Settings from '../screens/settings/Settings';
import Support from '../screens/support/Support';

const Drawer = createDrawerNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};

export default AppStack;
