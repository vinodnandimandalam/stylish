import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../modules/login/Login';
import Register from '../modules/register/Register';
import ForgetPwd from '../modules/forget-pwd/ForgetPwd';
import Dashboard from '../modules/dashboard/Dashboard';
import OnBoarding from '../modules/onboarding/OnBoarding';
import {PublicRouteName, SCREENS} from './Screens';

export type PublicStackParamList = {
  [SCREENS.PUBLIC.ONBOARDING]: undefined;
  [SCREENS.PUBLIC.LOGIN]: undefined;
  [SCREENS.PUBLIC.REGISTER]: undefined;
  [SCREENS.PUBLIC.FORGOT_PASSWORD]: undefined;
};

export type PrivateStackParamList = {
  [SCREENS.PRIVATE.DASHBOARD]: undefined;
};

const PublicStack = createNativeStackNavigator<PublicStackParamList>();
const PrivateStack = createNativeStackNavigator<PrivateStackParamList>();

type PublicNavigatorProps = {
  initialRouteName?: PublicRouteName;
};

export function PublicNavigator({
  initialRouteName = SCREENS.PUBLIC.ONBOARDING,
}: PublicNavigatorProps) {
  return (
    <PublicStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{headerShown: false}}>
      <PublicStack.Screen name={SCREENS.PUBLIC.ONBOARDING} component={OnBoarding} />
      <PublicStack.Screen name={SCREENS.PUBLIC.LOGIN} component={Login} />
      <PublicStack.Screen name={SCREENS.PUBLIC.REGISTER} component={Register} />
      <PublicStack.Screen
        name={SCREENS.PUBLIC.FORGOT_PASSWORD}
        component={ForgetPwd}
      />
    </PublicStack.Navigator>
  );
}

export function PrivateNavigator() {
  return (
    <PrivateStack.Navigator
      initialRouteName={SCREENS.PRIVATE.DASHBOARD}
      screenOptions={{headerShown: false}}>
      <PrivateStack.Screen name={SCREENS.PRIVATE.DASHBOARD} component={Dashboard} />
    </PrivateStack.Navigator>
  );
}

export default PublicNavigator;
