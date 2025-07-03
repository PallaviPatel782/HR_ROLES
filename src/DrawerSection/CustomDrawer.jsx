import { Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../Styles/CustomerStyle';
import Colors from '../utils/Colors';
import { SH } from '../utils/Dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../Styles/ScreenContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

const CustomDrawer = ({ navigation }) => {

  const topMenuItems = [
    { label: 'Dashboard', icon: 'grid-outline', IconComponent: Ionicons, screen: 'Hr' },
    { label: 'Leave History', icon: 'calendar-outline', IconComponent: Ionicons, screen: 'getleavescreen' },
    { label: 'User Profile', icon: 'person-outline', IconComponent: Ionicons, screen: 'userprofilescreen' },
    { label: 'Company Profile', icon: 'business-outline', IconComponent: Ionicons, screen: 'companyprofilescreen' },
    { label: 'Salary History', icon: 'wallet-outline', IconComponent: Ionicons, screen: 'salaryscreen' },
    { label: 'Attendance', icon: 'time-outline', IconComponent: Ionicons, screen: 'attendanceScreen' },
  ];


  const bottomMenuItems = [
    { label: 'Settings', icon: 'settings-outline', IconComponent: Ionicons, screen: 'Settings' },
    { label: 'Notifications', icon: 'notifications-outline', IconComponent: Ionicons, screen: 'Notification' },
    { label: 'Contact Support', icon: 'call-outline', IconComponent: Ionicons, screen: 'ContactSupport' },
    { label: 'Log Out', icon: 'log-out-outline', IconComponent: Ionicons },
  ];

  const handleNavigation = (screen) => {
    if (!screen) return;

    const drawerScreens = ['Settings', 'ContactSupport'];
    const stackScreens = ['Notification', 'getleavescreen', 'salaryscreen', 'companyprofilescreen', 'userprofilescreen', 'attendanceScreen'];
    const tabScreens = ['Hr'];

    if (tabScreens.includes(screen)) {
      navigation.navigate('Tabs', { screen });
    } else if (drawerScreens.includes(screen)) {
      navigation.navigate(screen);
    } else if (stackScreens.includes(screen)) {
      navigation.navigate(screen);
    } else {
      console.warn(`Screen "${screen}" is not registered`);
    }
  };
  const handleLogout = async () => {
    // console.log("logout button is pressed");

    // try {
    //   await AsyncStorage.removeItem('authToken');
    //   await AsyncStorage.removeItem('userInfo');
    //   console.log("authToken & userInfo cleared");

    //   showMessage({
    //     message: 'Logout successful',
    //     description: 'You have been logged out.',
    //     type: 'success',
    //     icon: 'success',
    //     duration: 3000,
    //   });

    //   navigation.reset({
    //     index: 0,
    //     routes: [{ name: "AuthStack" }],
    //   });

    // } catch (error) {
    //   console.error('Logout error:', error);

    //   showMessage({
    //     message: 'Logout failed',
    //     description: 'Something went wrong while logging out.',
    //     type: 'danger',
    //     icon: 'danger',
    //     duration: 3000,
    //   });
    // }
  };

  return (
    <SafeAreaView style={[containerStyle.container, { paddingTop: SH(15) }]} edges={['top', 'bottom']}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assests/Images/dummyProfile.jpg')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.name}>Rubby Doe</Text>
          <Text style={styles.email}>rubbydoe@email.com</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top Menu */}
          {topMenuItems.map((item, index) => {
            const Icon = item.IconComponent;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.screen)}
              >
                <Icon name={item.icon} size={15} color={Colors.gradientBlue
                  
                } style={styles.icon} />
                <Text style={styles.menuText1}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}



        </ScrollView>

        {/* Bottom Logout Menu (sticky) */}
        <View style={styles.bottomMenu}>
          {bottomMenuItems.map((item, index) => {
            const Icon = item.IconComponent;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.label === 'Log Out') {
                    handleLogout();
                  } else if (item.screen) {
                    navigation.navigate(item.screen);
                  }
                }}
              >
                {item.image ? (
                  <Image source={item.image} style={[styles.icon, { width: 22, height: 22 }]} />
                ) : Icon ? (
                  <Icon name={item.icon} size={15} color={Colors.gradientBlue} style={styles.icon} />
                ) : null}
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawer;
