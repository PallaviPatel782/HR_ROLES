import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    const { title, body } = remoteMessage.notification || {};
    if (title || body) {
        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId: 'default',
                smallIcon: 'ic_launcher',
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
            },
        });
    }
});

AppRegistry.registerComponent(appName, () => App);
