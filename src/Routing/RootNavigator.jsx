import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import SplashScreen from "../Splash/SplashScreen";
import LoginScreen from "../authentication/Login/LoginScreen";
import Colors from "../utils/Colors";
import OtpVerification from "../authentication/Verification/OtpVerification";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SF, SW, SH } from "../utils/Dimensions";
import CustomDrawer from "../DrawerSection/CustomDrawer";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Notification from "../StackScreens/Notification/Notification";
import Hr from "../Tabs/HRMS/Hr";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import getleavescreen from "../StackScreens/HrActionFiles.jsx/getleavescreen";
import salaryscreen from "../StackScreens/HrActionFiles.jsx/salaryscreen";
import companyprofilescreen from "../StackScreens/HrActionFiles.jsx/companyprofilescreen";
import userprofilescreen from "../StackScreens/HrActionFiles.jsx/userprofilescreen";
import attendanceScreen from "../StackScreens/HrActionFiles.jsx/attendanceScreen";
import Profile from "../StackScreens/Profile/Profile";
import Settings from "../DrawerSection/Settings";
import ContactSupport from "../DrawerSection/ContactSupport";
import ChangePassword from "../DrawerSection/ChangePassword";
import ForgotPassword from "../authentication/ForgotPassword/ForgotPassword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import Loading from "../Splash/Loading";
import { useSelector } from "react-redux";
import policies from "../StackScreens/Policies/PolicyDetail1";
import PolicyDetail1 from "../StackScreens/Policies/PolicyDetail1";
import PolicyDetail2 from "../StackScreens/Policies/PolicyDetail2";
import HelpCenterScreen from "../DrawerSection/HelpCenterScreen";
import TermsAndConditionsScreen from "../DrawerSection/TermsAndConditionsScreen";
import AnnouncementScreen from "../StackScreens/HrActionFiles.jsx/announcementScreen";
import CreateNewPassword from "../authentication/NewPassword/CreateNewPassword";
import CreateLeaveScreen from "../StackScreens/HrActionFiles.jsx/CreateLeaveScreen";
import ViewReceiptScreen from "../StackScreens/HrActionFiles.jsx/ViewReceiptScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = ({ navigation, route }) => {
  const initialRoute = route?.params?.initialTab;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Hr" component={Hr} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        width: SW(240)
      },
    }}>
    <Drawer.Screen name="Tabs" component={TabNavigator} />
  </Drawer.Navigator>
);

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="App">
      <Stack.Screen name="App" component={DrawerNavigator} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="getleavescreen" component={getleavescreen} />
      <Stack.Screen name="AnnouncementScreen" component={AnnouncementScreen} />
      <Stack.Screen name="salaryscreen" component={salaryscreen} />
      <Stack.Screen name="ViewReceiptScreen" component={ViewReceiptScreen} />
      <Stack.Screen name="CreateLeaveScreen" component={CreateLeaveScreen} />
      <Stack.Screen name="userprofilescreen" component={userprofilescreen} />
      <Stack.Screen name="companyprofilescreen" component={companyprofilescreen} />
      <Stack.Screen name="attendanceScreen" component={attendanceScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ContactSupport" component={ContactSupport} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="PolicyDetail1" component={PolicyDetail1} />
      <Stack.Screen name="PolicyDetail2" component={PolicyDetail2} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
      <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUserToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token in root file:", token);

      setInitialRoute(token ? "AppStack" : "AuthStack");
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

    checkUserToken();
  }, []);



  if (isLoading) {
    return <Loading />;
  }

  // initialRouteName={initialRoute}
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="AppStack" component={AppStack} />
    </Stack.Navigator>

  );
};

export default RootNavigator;
