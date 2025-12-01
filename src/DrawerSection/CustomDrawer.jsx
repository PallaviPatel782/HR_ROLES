import { Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../Styles/CustomerStyle';
import Colors from '../utils/Colors';
import { SH, SW } from '../utils/Dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../Styles/ScreenContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { IMG_URL } from '../utils/BASE_URL';
import { fetchUserProfile, setUserInfo } from '../redux/slices/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';

const CustomDrawer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.profile);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const stored = await AsyncStorage.getItem('userInfo');
      if (stored) {
        const parsed = JSON.parse(stored);
        const response = await dispatch(fetchUserProfile(parsed.id)).unwrap();
        dispatch(setUserInfo(response));
        updateLocalState(response);
      }
    };

    loadProfile();
  }, []);
  const updateLocalState = (profile) => {
    setFirstName(profile.firstName || '');
    setLastName(profile.lastName || '');
    setUserEmail(profile.email || '');

    const displayPhoto = profile.photograph
      ? profile.photograph.startsWith('http')
        ? profile.photograph
        : `${IMG_URL}/${profile.photograph}`
      : null;

    setUserPhoto(displayPhoto);
  };


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
    console.log("logout button is pressed");

    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('fcmToken');
      await messaging().deleteToken();
      console.log("authToken & userInfo cleared & fcm token remove ");

      showMessage({
        message: 'Logout successful',
        description: 'You have been logged out.',
        type: 'success',
        icon: 'success',
        duration: 3000,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
      });

    } catch (error) {
      console.error('Logout error:', error);

      showMessage({
        message: 'Logout failed',
        description: 'Something went wrong while logging out.',
        type: 'danger',
        icon: 'danger',
        duration: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={[containerStyle.container, { paddingTop: SH(15) }]} edges={['top', 'bottom']}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.avatar} />
          ) : (
            <Image source={require('../assests/Images/userpng.png')}
              style={styles.avatar} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.name}>
            {`${firstName} ${lastName}`.trim().length > 15
              ? `${firstName} ${lastName}`.trim().substring(0, 15) + "..."
              : `${firstName} ${lastName}`.trim() || "User"}
          </Text>
          <Text style={styles.email}>
            {userEmail
              ? userEmail.length > 20
                ? userEmail.substring(0, 20) + "..."
                : userEmail
              : "user@gmail.com"}
          </Text>
        </TouchableOpacity>

      </View>

      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {topMenuItems.map((item, index) => {
            const Icon = item.IconComponent;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.screen)}
              >
                <Icon name={item.icon} size={15} color={Colors.gradientBlue} style={styles.icon} />
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
