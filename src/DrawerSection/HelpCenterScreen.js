import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { containerStyle } from "../Styles/ScreenContainer";
import { SH, SF } from "../utils/Dimensions";
import AppHeader from "../Components/AppHeader";
import Colors from "../utils/Colors";
import Icon from "react-native-vector-icons/Feather";

// Enable layout animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpCenterScreen = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How can I Punch In or Punch Out?",
      answer:
        "Go to the Attendance screen and tap the 'Punch In' button when you start work and 'Punch Out' when you finish. Make sure your location permission is enabled if geo-tracking is required.",
    },
    {
      question: "How do I update my user profile?",
      answer:
        "Navigate to the 'Profile' section in the app. You can edit your personal details such as phone number, address, and emergency contact. Once done, tap 'Save' to update.",
    },
    {
      question: "How can I view or edit the company profile?",
      answer:
        "The Company Profile section is accessible by admins or HR only. It displays company name, policies, and contact information. Reach out to HR if you need updates.",
    },
    {
      question: "How do I download my salary slip?",
      answer:
        "Go to the 'Salary' tab, select the month, and tap 'Download Slip'. A PDF version of your payslip will be generated, which you can view or share directly.",
    },
    {
      question: "How can I check my attendance records?",
      answer:
        "Visit the 'Attendance' tab to see your daily check-in and check-out details, total working hours, and any missing punch alerts for the selected month.",
    },
  ];

  return (
    <SafeAreaView style={containerStyle.container}>
      <AppHeader navigation={navigation} title="Help Center" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>Frequently Asked Questions</Text>

          {faqData.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                activeOpacity={0.7}
                onPress={() => handleToggle(index)}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <Icon
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={Colors.dark}
                />
              </TouchableOpacity>

              {expandedIndex === index && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>Contact Support</Text>
          <Text style={styles.itemValue}>Email: mailto:info@trinexaglobal.com</Text>
          <Text style={styles.itemValue}>Phone: +91-9999999999</Text>
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
    fontFamily: "Inter-Bold",
    marginBottom: 8,
  },
  itemValue: {
    fontSize: SF(13),
    color: "#1c1c1c",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
  },
  sectionItem: {
    marginVertical: SH(10),
  },
  faqItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SH(10),
    paddingHorizontal: 10,
  },
  questionText: {
    fontSize: SF(13),
    fontFamily: "Inter-SemiBold",
    color: Colors.dark,
    flex: 1,
    marginRight: 8,
  },
  answerContainer: {
    paddingHorizontal: 10,
    paddingBottom: SH(10),
  },
  answerText: {
    fontSize: SF(13),
    color: "#1c1c1c",
    fontFamily: "Inter-Regular",
    lineHeight: 21,
  },
});
