import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet} from 'react-native';
import Login from '../modules/login/Login';
import Register from '../modules/register/Register';
import ForgetPwd from '../modules/forget-pwd/ForgetPwd';
import Dashboard from '../modules/dashboard/Dashboard';
import TabPlaceholder from '../modules/dashboard/TabPlaceholder';
import OnBoarding from '../modules/onboarding/OnBoarding';
import Settings from '../modules/settings/Settings';
import {
  PrivateTabName,
  PrivateTabParamList,
  PublicRouteName,
  SCREENS,
} from './Screens';
import {colors} from '../theme/colors';

export type PublicStackParamList = {
  [SCREENS.PUBLIC.ONBOARDING]: undefined;
  [SCREENS.PUBLIC.LOGIN]: undefined;
  [SCREENS.PUBLIC.REGISTER]: undefined;
  [SCREENS.PUBLIC.FORGOT_PASSWORD]: undefined;
};

const PublicStack = createNativeStackNavigator<PublicStackParamList>();
const PrivateTabs = createBottomTabNavigator<PrivateTabParamList>();

const tabIcons = {
  [SCREENS.PRIVATE.HOME]: require('../assets/images/home-icon.png'),
  [SCREENS.PRIVATE.WISHLIST]: require('../assets/images/heart-icon.png'),
  [SCREENS.PRIVATE.CART]: require('../assets/images/cart-icon.png'),
  [SCREENS.PRIVATE.SEARCH]: require('../assets/images/search-icon.png'),
  [SCREENS.PRIVATE.SETTINGS]: require('../assets/images/settings.png'),
};

const WishlistTab = () => (
  <TabPlaceholder title={SCREENS.PRIVATE.WISHLIST} />
);
const CartTab = () => <TabPlaceholder title={SCREENS.PRIVATE.CART} />;
const SearchTab = () => <TabPlaceholder title={SCREENS.PRIVATE.SEARCH} />;

const renderTabIcon = (routeName: PrivateTabName, color: string) => {
  return (
    <Image
      source={tabIcons[routeName]}
      style={[styles.tabIcon, {tintColor: color}]}
      resizeMode="contain"
    />
  );
};

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
    <PrivateTabs.Navigator
      initialRouteName={SCREENS.PRIVATE.HOME}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accentRed,
        tabBarInactiveTintColor: colors.textPrimary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({color}) => renderTabIcon(route.name, color),
      })}>
      <PrivateTabs.Screen
        name={SCREENS.PRIVATE.HOME}
        component={Dashboard}
      />
      <PrivateTabs.Screen
        name={SCREENS.PRIVATE.WISHLIST}
        component={WishlistTab}
      />
      <PrivateTabs.Screen name={SCREENS.PRIVATE.CART} component={CartTab} />
      <PrivateTabs.Screen name={SCREENS.PRIVATE.SEARCH} component={SearchTab} />
      <PrivateTabs.Screen
        name={SCREENS.PRIVATE.SETTINGS}
        component={Settings}
      />
    </PrivateTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.inputBackground,
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIcon: {
    width: 28,
    height: 28,
  },
});

export default PublicNavigator;
