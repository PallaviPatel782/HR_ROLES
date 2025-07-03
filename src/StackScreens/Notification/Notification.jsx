import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonTabSwitcher from '../../Components/CommonTabSwitcher';
import { containerStyle } from '../../Styles/ScreenContainer';
import Colors from '../../utils/Colors';
import { Notifications } from '../../Content/Content';
import { styles } from '../../Styles/NotificationStyle';

const Notification = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('General');

    const handleTabChange = (tab) => {
        setSelectedTab(tab.label);
    };

    const renderItem = ({ item }) => (
        <View style={styles.notificationCard}>
           <Image source={item.image} style={styles.icon} resizeMode="contain" />
            <View style={styles.textContainer}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
        </View>
    );

    const data = Notifications[selectedTab.toLowerCase()] || [];

    return (
        <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
            <AppHeader navigation={navigation} title="Notifications" />
            <CommonTabSwitcher
                tabs={[
                    {
                        label: 'General',
                        activeStyle: {
                            backgroundColor: Colors.lightBlue,
                            borderColor: Colors.gradientBlue,
                        },
                        activeTextStyle: {
                            color: Colors.gradientBlue,
                            fontFamily: 'Inter-Medium',
                        },
                    },
                    {
                        label: 'Announcements',
                        activeStyle: {
                            backgroundColor: Colors.orange,
                            borderColor: Colors.darkOrange,
                        },
                        activeTextStyle: {
                            color: Colors.darkOrange,
                            fontFamily: 'Inter-Medium',
                        },
                    },
                ]}
                onTabChange={handleTabChange}
            />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

export default Notification;