import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../modules/login/Login';
import Register from '../modules/register/Register';
import ForgetPwd from '../modules/forget-pwd/ForgetPwd';
import Dashboard from '../modules/dashboard/Dashboard';
import OnBoarding from '../modules/onboarding/OnBoarding';

export type PublicStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type PrivateStackParamList = {
  Dashboard: undefined;
};

const PublicStack = createNativeStackNavigator<PublicStackParamList>();
const PrivateStack = createNativeStackNavigator<PrivateStackParamList>();

export function PublicNavigator() {
  return (
    <PublicStack.Navigator initialRouteName="Onboarding" screenOptions={{headerShown: false}}>
      <PublicStack.Screen name="Onboarding" component={OnBoarding} />
      <PublicStack.Screen name="Login" component={Login} />
      <PublicStack.Screen name="Register" component={Register} />
      <PublicStack.Screen name="ForgotPassword" component={ForgetPwd} />
    </PublicStack.Navigator>
  );
}

export function PrivateNavigator() {
  return (
    <PrivateStack.Navigator initialRouteName="Dashboard" screenOptions={{headerShown: false}}>
      <PrivateStack.Screen name="Dashboard" component={Dashboard} />
    </PrivateStack.Navigator>
  );
}

export default PublicNavigator;
