import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { containerStyle } from '../Styles/ScreenContainer';
import AppHeader from '../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SF, SH, SW } from '../utils/Dimensions';
import Colors from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import GradientButton from '../Components/GradientButton';
import geoLogo from '../assests/Images/logo.png';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { openSettings } from 'react-native-permissions';
import { SAVED_FCM_TOKEN } from '../utils/BASE_URL';
import { useFocusEffect } from '@react-navigation/native';

const Settings = ({ navigation }) => {
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const appVersion = DeviceInfo.getVersion();

  const loadToggleState = async () => {
    try {
      const saved = await AsyncStorage.getItem("notificationEnabled");
      if (saved !== null) {
        setAllowNotifications(JSON.parse(saved));
      } else {
        const hasPermission = await checkNotificationPermission();
        setAllowNotifications(hasPermission);
        await AsyncStorage.setItem("notificationEnabled", JSON.stringify(hasPermission));
      }
    } catch (e) {
      console.log("load state error", e);
    }
  };

  useEffect(() => {
    loadToggleState();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const hasPermission = await checkNotificationPermission();
        setAllowNotifications(hasPermission);
        await AsyncStorage.setItem("notificationEnabled", JSON.stringify(hasPermission));
      })();
    }, [])
  );

  const checkNotificationPermission = async () => {
    try {
      let enabled = false;

      if (Platform.OS === 'ios') {
        const status = await messaging().hasPermission();
        enabled = status === messaging.AuthorizationStatus.AUTHORIZED;
      } else {
        if (Platform.Version >= 33) {
          enabled = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        } else {
          enabled = true;
        }
      }
      return enabled;
    } catch (error) {
      console.log("Check permission error:", error);
      return false;
    }
  };

  const requestUserPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          await openSettings();
          return false;
        }
        return true;
      } else {
        if (Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (result === PermissionsAndroid.RESULTS.DENIED) {
            Linking.openSettings();
            return false;
          }

          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }
    } catch (err) {
      console.log('Permission error:', err);
      return false;
    }
  };

  const handleNotificationToggle = async (enabled) => {
    setAllowNotifications(enabled);
    await AsyncStorage.setItem("notificationEnabled", JSON.stringify(enabled));

    const userToken = await AsyncStorage.getItem('authToken');

    try {
      setLoading(true);

      if (enabled) {
        const permission = await requestUserPermission();
        if (!permission) {
          showMessage({
            type: 'info',
            message: 'Permission Needed',
            description: 'Please enable notifications from settings.',
          });
          setAllowNotifications(false);
          await AsyncStorage.setItem("notificationEnabled", "false");
          setLoading(false);
          return;
        }

        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem("fcmToken", fcmToken);

        const payload = { fcmToken };
        const { data } = await axios.post(SAVED_FCM_TOKEN, payload, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        showMessage({
          type: data.success ? "success" : "danger",
          message: data.success ? "Notifications Enabled" : "Error",
          description: data.message,
        });
      } else {
        await messaging().deleteToken();
        await AsyncStorage.removeItem("fcmToken");

        const payload = { fcmToken: "" };
        const { data } = await axios.post(SAVED_FCM_TOKEN, payload, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        showMessage({
          type: data.success ? "success" : "danger",
          message: data.success ? "Notifications Disabled" : "Error",
          description: data.message || "Notifications turned off.",
        });
      }

    } catch (error) {
      showMessage({
        type: 'danger',
        message: "Error",
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('fcmToken');

      showMessage({
        message: 'Logout successful',
        description: 'You have been logged out.',
        type: 'success',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      showMessage({
        message: 'Logout failed',
        description: 'Something went wrong.',
        type: 'danger',
      });
    }
  };

  const companyLink = {
    label: 'Geo Holidays',
    logo: geoLogo,
    url: 'https://geoholidays.in/',
  };

  const SettingItem = ({ icon, title, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={18} color={Colors.darkBlue} />
      </View>
      <Text style={styles.itemText}>{title}</Text>
      <View style={{ marginLeft: 'auto' }}>{rightComponent}</View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[containerStyle.container, { backgroundColor: '#F5F8FF' }]} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Settings" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          icon="person-outline"
          title="Edit Profile"
          onPress={() => navigation.navigate('Profile')}
        />
        <SettingItem
          icon="lock-closed-outline"
          title="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          rightComponent={
            <Switch
              onValueChange={handleNotificationToggle}
              value={allowNotifications}
              disabled={loading}
              trackColor={{ false: '#ccc', true: Colors.darkBlue }}
              thumbColor={'#fff'}
            />
          }
        />
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          icon="help-circle-outline"
          title="FAQ"
          onPress={() => navigation.navigate('HelpCenterScreen')}
        />
        <SettingItem
          icon="chatbubble-ellipses-outline"
          title="Contact Support"
          onPress={() => navigation.navigate('ContactSupport')}
        />
        <Text style={styles.sectionTitle}>App</Text>
        <SettingItem
          icon="document-text-outline"
          title="Terms & Conditions"
          onPress={() => navigation.navigate('TermsAndConditionsScreen')}
        />
        <SettingItem
          icon="information-circle-outline"
          title="App Version"
          rightComponent={<Text style={styles.versionText}>v{appVersion}</Text>}
        />
        <Image source={companyLink.logo} style={styles.logoImage} />
        <View style={styles.logoutWrapper}>
          <GradientButton title="Logout" onPress={handleLogout} style={styles.logoutButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SW(10),
    paddingBottom: SH(40),
  },
  sectionTitle: {
    fontSize: SF(14),
    fontFamily: 'Inter-Medium',
    color: Colors.darkBlue,
    marginTop: SH(8),
    marginBottom: SH(12),
  },
  logoImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: SH(10),
    paddingHorizontal: SW(14),
    marginBottom: SH(10),
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrapper: {
    width: SW(28),
    height: SW(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SW(12),
  },
  itemText: {
    fontSize: SF(13),
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  versionText: {
    fontSize: SF(13),
    color: '#888',
    fontFamily: 'Inter-Regular',
  },
  logoutWrapper: {
    marginTop: SH(30),
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
});
