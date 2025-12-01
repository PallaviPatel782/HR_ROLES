import React, { useEffect } from 'react';
import RootNavigator from './src/Routing/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import InternetCheck from './src/Components/CheckInternet';
import FlashMessage from "react-native-flash-message";
import store from './src/redux/store';
import { Provider } from 'react-redux';
import { View, StyleSheet, StatusBar, Platform, PermissionsAndroid } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './src/Routing/NavigationService';

const AppContent = () => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    requestUserPermission();
    getFcmToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification Received:', JSON.stringify(remoteMessage, null, 2));

      const { title, body } = remoteMessage.notification || {};

      if (title || body) {
        await notifee.displayNotification({
          title,
          body,
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
            importance: AndroidImportance.HIGH,
            pressAction: { id: 'default' },
          },
        });
      } else {
        console.log('No notification payload found in remoteMessage.');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Opened from background state:', JSON.stringify(remoteMessage, null, 2));
      navigationRef.current?.navigate('Notification');
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from killed (cold start):', JSON.stringify(remoteMessage, null, 2));
          navigationRef.current?.navigate('Notification');
        } else {
          console.log('App launched normally — no notification data.');
        }
      })
      .catch(err => console.log('Error fetching initial notification:', err));

    return unsubscribe;
  }, []);


  const requestUserPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        return enabled; // <-- important
      } else {
        if (Platform.Version >= 33) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return result === PermissionsAndroid.RESULTS.GRANTED; // <-- important
        }
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  const getFcmToken = async () => {
    try {
      const permission = await requestUserPermission();

      if (!permission) {
        console.log("Notification permission denied. Removing token.");
        await AsyncStorage.removeItem('fcmToken');
        return;
      }

      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        await AsyncStorage.setItem('fcmToken', token);
      }

    } catch (error) {
      console.log('Error fetching FCM token:', error);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
      <RootNavigator />
      <InternetCheck />
      <FlashMessage
        position="bottom"
        style={{ marginBottom: insets.bottom }}
        floating={true}
      />
    </View>
  );
};

const App = () => {
  return (
    <Provider store={store} ref={navigationRef}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
