import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, Alert, Image, Linking } from 'react-native';
import React, { useState } from 'react';
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

const Settings = ({ navigation }) => {
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const appVersion = DeviceInfo.getVersion();
  console.log("appVersion",appVersion);
  const handleLogout = async () => {
    console.log("logout button is pressed");

    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      console.log("authToken & userInfo cleared");

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
              value={isNotificationOn}
              onValueChange={setIsNotificationOn}
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
        {/* <TouchableOpacity
          onPress={() => Linking.openURL(companyLink.url)}
        >
          <Image source={companyLink.logo} style={styles.logoImage} />
        </TouchableOpacity> */}
        <Image source={companyLink.logo} style={styles.logoImage} />
        <View style={styles.logoutWrapper}>
          <GradientButton
            title="Logout"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
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
    marginRight: 10,
    resizeMode: 'contain',
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
