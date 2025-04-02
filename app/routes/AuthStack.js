import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {COLORS} from '../styles/theme';
import GetStarted from '../screens/GetStarted';
import Home from '../screens/home/Home';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import Register2 from '../screens/auth/Register2';
import AppStack from './AppStack';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      style={{color: COLORS.tertiary}}
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Register2" component={Register2} />
    </Stack.Navigator>
  );
};

export default AuthStack;
