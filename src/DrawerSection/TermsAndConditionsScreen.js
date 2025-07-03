import { View,Text,ScrollView,StyleSheet } from "react-native";
import React from 'react'
import { containerStyle } from "../Styles/ScreenContainer";
import { SH,SW,SF } from "../utils/Dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../Components/AppHeader";
import Colors from "../utils/Colors";

const TermsAndConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={containerStyle.container}>
      <AppHeader navigation={navigation} title="Terms & Conditions" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>Introduction</Text>
          <Text style={styles.itemValue}>
            These Terms & Conditions govern your use of this application. By accessing or using the app, you agree to comply with all the terms listed below.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>User Responsibilities</Text>
          <Text style={styles.itemValue}>
            Users are responsible for maintaining the confidentiality of their login credentials and must ensure that the app is used in a lawful manner.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>Data Privacy</Text>
          <Text style={styles.itemValue}>
            We respect your privacy and are committed to protecting your personal information. Refer to our Privacy Policy for more details.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>Modifications</Text>
          <Text style={styles.itemValue}>
            We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes your acceptance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default TermsAndConditionsScreen

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