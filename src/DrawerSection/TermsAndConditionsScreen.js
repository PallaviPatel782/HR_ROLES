import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../Components/AppHeader";
import Colors from "../utils/Colors";
import { SH, SF } from "../utils/Dimensions";
import { containerStyle } from "../Styles/ScreenContainer";

const TermsAndConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={containerStyle.container}>
      <AppHeader navigation={navigation} title="Terms & Conditions" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>1. Introduction</Text>
          <Text style={styles.itemValue}>
            These Terms and Conditions (“Terms”) govern the use of this Human Resource Management System (HRMS) application (“App”). By accessing or using this App, you agree to be bound by these Terms. If you do not agree, you may not use the App.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>2. Eligibility</Text>
          <Text style={styles.itemValue}>
            The App is intended for authorized employees, HR administrators, and management personnel of the registered organization. Unauthorized use of the system is strictly prohibited.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>3. User Responsibilities</Text>
          <Text style={styles.itemValue}>
            You are responsible for maintaining the confidentiality of your login credentials and all activity under your account. Any misuse, unauthorized access, or data tampering will result in disciplinary and/or legal action.
          </Text>
        </View>

        {/* New focused sections with max 5 points each */}
        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>4. Punch In / Punch Out — Purpose</Text>
          <View style={{ paddingLeft: 8 }}>
            <Text style={styles.itemValue}>1. Record accurate start and end times for work shifts to ensure reliable attendance tracking.</Text>
            <Text style={styles.itemValue}>2. Provide a timestamped audit trail for payroll and compliance purposes.</Text>
            <Text style={styles.itemValue}>3. Enable automatic calculation of work hours, overtime, and shift differentials.</Text>
            <Text style={styles.itemValue}>4. Support attendance-related approvals and exceptions (e.g., missed punch, correction requests).</Text>
            <Text style={styles.itemValue}>5. Improve operational transparency between employees, supervisors, and HR.</Text>
          </View>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>5. User Profile — Key Points</Text>
          <View style={{ paddingLeft: 8 }}>
            <Text style={styles.itemValue}>1. Stores essential personal details (name, contact, emergency contact, address).</Text>
            <Text style={styles.itemValue}>2. Maintains employment records (employee ID, designation, department, joining date).</Text>
            <Text style={styles.itemValue}>3. Holds documents and certifications securely (upload/download governed by policy).</Text>
            <Text style={styles.itemValue}>4. Allows controlled access to update certain fields subject to HR approval.</Text>
            <Text style={styles.itemValue}>5. Personal data access and edits are logged for audit and compliance.</Text>
          </View>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>6. Company Profile — Key Points</Text>
          <View style={{ paddingLeft: 8 }}>
            <Text style={styles.itemValue}>1. Contains official company information (name, registered address, industry).</Text>
            <Text style={styles.itemValue}>2. Lists HR contacts, policy documents, and statutory registration numbers.</Text>
            <Text style={styles.itemValue}>3. Central place for leave policies, working hours, and holiday calendar.</Text>
            <Text style={styles.itemValue}>4. Controls role-based access, approval workflows, and organizational hierarchy.</Text>
            <Text style={styles.itemValue}>5. Maintains company-wide settings used by payroll, attendance, and reporting modules.</Text>
          </View>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>7. Salary Slip — Usage & Security</Text>
          <View style={{ paddingLeft: 8 }}>
            <Text style={styles.itemValue}>1. Salary slips show breakdown of earnings, deductions, taxes, and net pay.</Text>
            <Text style={styles.itemValue}>2. They are confidential—only accessible to the employee and authorized payroll personnel.</Text>
            <Text style={styles.itemValue}>3. Any discrepancy must be reported to payroll within the defined timeframe for correction.</Text>
            <Text style={styles.itemValue}>4. Historical salary slips are retained as per company retention and statutory requirements.</Text>
            <Text style={styles.itemValue}>5. Downloading/sharing salary slips may be restricted by policy and is logged for audit.</Text>
          </View>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>8. Attendance — Rules & Expectations</Text>
          <View style={{ paddingLeft: 8 }}>
            <Text style={styles.itemValue}>1. Employees must punch in/out using approved methods (mobile app, biometric, web) per company policy.</Text>
            <Text style={styles.itemValue}>2. Late arrivals, early departures, and absences will be recorded and may affect salary or leave balance.</Text>
            <Text style={styles.itemValue}>3. Corrections to attendance (missed punches) require timely submission and manager/HR approval.</Text>
            <Text style={styles.itemValue}>4. Repeated misuse or falsification of attendance data may lead to disciplinary action.</Text>
            <Text style={styles.itemValue}>5. Attendance data may be used for shift planning, payroll computation, and statutory reporting.</Text>
          </View>
        </View>

        {/* Remaining original sections — condensed where appropriate */}
        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>9. Data Privacy and Security</Text>
          <Text style={styles.itemValue}>
            We are committed to protecting your personal and employment-related data. All user data is collected and processed in compliance with applicable data protection laws. Personal information will not be shared with third parties without consent, except as required by law.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>10. Company Policy Compliance</Text>
          <Text style={styles.itemValue}>
            By using this App, users agree to follow all internal HR policies, employee handbooks, and code of conduct guidelines issued by the organization. Violation of company policies through misuse of the App may lead to disciplinary measures.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>11. Intellectual Property</Text>
          <Text style={styles.itemValue}>
            All content, design, code, and data within the App are the property of the organization or its licensors. Users may not copy, modify, distribute, or reverse-engineer any part of the system.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>12. System Access & Availability</Text>
          <Text style={styles.itemValue}>
            The organization strives to maintain uninterrupted access but does not guarantee continuous availability. Scheduled maintenance or technical issues may result in temporary downtime without prior notice.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>13. Modification of Terms</Text>
          <Text style={styles.itemValue}>
            The organization reserves the right to update or modify these Terms at any time without prior notice. Continued use of the App after modifications constitutes acceptance of the revised Terms.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>14. Termination of Access</Text>
          <Text style={styles.itemValue}>
            The organization may suspend or terminate access to the App for violations of these Terms, misconduct, resignation, or termination of employment.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>15. Limitation of Liability</Text>
          <Text style={styles.itemValue}>
            The organization shall not be liable for any data loss, system errors, or unauthorized access resulting from user negligence or third-party interference.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>16. Governing Law</Text>
          <Text style={styles.itemValue}>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in the organization’s registered location.
          </Text>
        </View>

        <View style={styles.sectionItem}>
          <Text style={styles.itemLabel}>17. Contact Information</Text>
          <Text style={styles.itemValue}>
            For any questions or concerns regarding these Terms, please contact the HR or IT department of your organization.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  itemLabel: {
    fontSize: SF(13),
    color: Colors.dark,
    fontFamily: "Inter-Bold",
    marginBottom: 6,
  },
  itemValue: {
    fontSize: SF(13),
    color: "#1c1c1c",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    marginBottom: 6,
  },
  sectionItem: {
    marginVertical: SH(5),
  },
});
