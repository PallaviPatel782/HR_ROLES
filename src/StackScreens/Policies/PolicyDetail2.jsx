import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import AppHeader from '../../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import Colors from '../../utils/Colors';
import { SH, SF, SW } from '../../utils/Dimensions';

const PolicyDetail2 = ({ navigation }) => {
    return (
        <SafeAreaView style={containerStyle.container}>
            <AppHeader navigation={navigation} title="Policy 1.2: About the Rules" />
            <ScrollView contentContainerStyle={{ paddingHorizontal: SW(5), paddingVertical: SH(20) }} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.itemLabel}>General Conduct</Text>
                    <Text style={styles.itemValue}>
                        Employees are expected to maintain professionalism in communication, dress code, and punctuality.
                    </Text>

                    <Text style={[styles.itemLabel, { marginTop: 16 }]}>Working Hours</Text>
                    <Text style={styles.itemValue}>
                        The standard office hours are from 9:30 AM to 6:30 PM, Monday to Friday.
                    </Text>

                    <Text style={[styles.itemLabel, { marginTop: 16 }]}>Leave Application</Text>
                    <Text style={styles.itemValue}>
                        All leaves must be applied for at least 2 days in advance using the official HR portal.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PolicyDetail2

const styles = StyleSheet.create({

    itemLabel: {
        fontSize: SF(13),
        color: Colors.dark,
        fontFamily: 'Inter-Bold',
        marginBottom: 6,
    },

    itemValue: {
        fontSize: SF(13),
        color: '#1c1c1c',
        fontFamily: 'Inter-Regular',
        lineHeight: 22,
    }

})