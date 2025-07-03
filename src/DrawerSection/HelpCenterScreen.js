import { View,Text,ScrollView,StyleSheet } from "react-native";
import { containerStyle } from "../Styles/ScreenContainer";
import { SH,SW,SF } from "../utils/Dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react';
import AppHeader from "../Components/AppHeader";
import Colors from "../utils/Colors";

const HelpCenterScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={containerStyle.container}>
      <AppHeader navigation={navigation} title="Help Center" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>How can we help you?</Text>
          <Text style={styles.itemValue}>
            If you're facing issues with login, attendance, salary records, or anything else, check the FAQs or reach out to our support team.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>Frequently Asked Questions</Text>
          <Text style={styles.itemValue}>• How do I reset my password?</Text>
          <Text style={styles.itemValue}>• How to mark attendance remotely?</Text>
          <Text style={styles.itemValue}>• Whom do I contact for leave-related issues?</Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>Contact Support</Text>
          <Text style={styles.itemValue}>Email: support@webseedertech.com</Text>
          <Text style={styles.itemValue}>Phone: +91-9876543210</Text>
          <Text style={styles.itemValue}>Working Hours: 10:00 AM - 6:00 PM (Mon-Fri)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCenterScreen;

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
  },
   sectionItem:{
    marginVertical:SH(5)
  }
})

