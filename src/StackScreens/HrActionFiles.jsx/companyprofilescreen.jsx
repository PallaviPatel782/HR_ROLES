import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyById, fetchPoliciesByCompany } from "../../redux/slices/companyProfileSlice";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { SF, SW, SH } from '../../utils/Dimensions';
import { containerStyle } from '../../Styles/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import Colors from '../../utils/Colors';
import { IMG_URL } from '../../utils/BASE_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

const windowWidth = Dimensions.get('window').width;

/* 🔹 Reusable Toggle Section */
const ToggleSection = ({ icon, iconName, iconSize, iconColor, title, isOpen, onToggle, children, paddingHorizontal }) => (
  <View>
    <TouchableOpacity
      style={[styles.sectionHeader, { paddingHorizontal: paddingHorizontal || windowWidth * 0.07 }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {icon === 'MaterialCommunityIcons' && <MaterialCommunityIcon name={iconName} size={iconSize} color={iconColor} />}
      {icon === 'FontAwesome' && <FontAwesomeIcon name={iconName} size={iconSize} color={iconColor} />}
      {icon === 'Ionicons' && <IoniconsIcon name={iconName} size={iconSize} color={iconColor} />}
      {icon === 'AntDesign' && <AntDesignIcon name={iconName} size={iconSize} color={iconColor} />}

      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ flex: 1 }} />
      <AntDesignIcon name={isOpen ? 'caretup' : 'caretdown'} size={12} color={Colors.darkBlue} />
    </TouchableOpacity>
    {isOpen && <View style={styles.expandContent}>{children}</View>}
  </View>
);

const CompanyProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { company, policies, loading } = useSelector((state) => state.companyProfile);

  const [sectionsOpen, setSectionsOpen] = useState({
    overview: false,
    address: false,
    social: false,
    announcement: false,
    policies: false,
  });

  useEffect(() => {
    console.log("company data ", company)
    const loadCompanyData = async () => {
      try {
        const companyId = await AsyncStorage.getItem("companyId");
        console.log("companyId", companyId);
        if (companyId) {
          dispatch(fetchCompanyById(companyId));
          dispatch(fetchPoliciesByCompany(companyId));
        } else {
          console.warn("companyId not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error loading companyId:", error);
      }
    };
    loadCompanyData();
  }, [dispatch]);

  const toggleSection = (key) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userInfo', 'companyName', 'companyLogo']);
      showMessage({ message: "Logout successful", description: "You have been logged out.", type: "success", icon: "success" });
      navigation.reset({ index: 0, routes: [{ name: 'AuthStack', state: { routes: [{ name: 'LoginScreen' }] } }] });
    } catch (error) {
      console.error("Logout error:", error);
      showMessage({ message: "Logout failed", description: "Something went wrong while logging out.", type: "danger", icon: "danger" });
    }
  };

  if (loading && !company) {
    return (
      <SafeAreaView style={containerStyle.container}>
        <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Company's Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {company && (
          <View style={styles.topView}>
            <Image
              style={styles.appIconImg}
              source={
                company.logo
                  ? { uri: `${IMG_URL}/${company.logo}` }
                  : company.companyInfo?.profile?.companyLogo
                    ? { uri: `${IMG_URL}/${company.companyInfo.profile.companyLogo}` }
                    : require('../../assests/Images/logo.png')
              }
              resizeMode="contain"
            />
            <Text style={styles.appNameTxt2}>
              {
                company.companyInfo?.profile?.registeredCompanyName ||
                "Company Name"}
            </Text>
            <Text style={styles.appNameTxt1}>
              {company.companyInfo?.profile?.industryType || "No IndustryType"}
            </Text>
          </View>
        )}

        <ToggleSection
          icon="MaterialCommunityIcons"
          iconName="timetable"
          iconSize={24}
          iconColor={Colors.darkBlue}
          title="Overview"
          isOpen={sectionsOpen.overview}
          onToggle={() => toggleSection('overview')}
        >
          {company && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Company Overview</Text>
              {[
                { label: "Registered Company Name", value: company.companyInfo?.profile?.registeredCompanyName || "Not Available" },
                { label: "Brand Name", value: company.companyInfo?.profile?.brandName || "Not Available" },
                { label: "Official Email", value: company.companyInfo?.profile?.companyOfficeEmail || "Not Available", type: "email" },
                { label: "Website", value: company.companyInfo?.profile?.companyWebsite || "Not Available", type: "link" },
                { label: "Industry Type", value: company.companyInfo?.profile?.industryType || "Not Available" },
                { label: "Official Contact", value: company.companyInfo?.profile?.companyOfficialContact || "Not Available" },
                { label: "Domain Name", value: company.companyInfo?.profile?.domainName || "Not Available" },
              ].map((item, index) => (
                <View key={index} style={[styles.row, index !== 6 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  {item.type === "link" && item.value !== "Not Available" ? (
                    <Text style={styles.rowValueLink} onPress={() => Linking.openURL(item.value.startsWith("http") ? item.value : `https://${item.value}`)}>
                      {item.value}
                    </Text>
                  ) : item.type === "email" && item.value !== "Not Available" ? (
                    <Text style={styles.rowValueLink} onPress={() => Linking.openURL(`mailto:${item.value}`)}>
                      {item.value}
                    </Text>
                  ) : (
                    <Text style={styles.rowValue}>{item.value}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </ToggleSection>
        <ToggleSection
          icon="FontAwesome"
          iconName="address-book"
          iconSize={22}
          iconColor={Colors.darkBlue}
          title="Address"
          isOpen={sectionsOpen.address}
          onToggle={() => toggleSection('address')}
        >
          {company && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Registered Office Address</Text>
              <Text style={[styles.rowValue, { textAlign: "left" }]}>
                {company.companyInfo?.registeredOfficeAddress?.addressLine1 || ""}
                {company.companyInfo?.registeredOfficeAddress?.addressLine2 ? `, ${company.companyInfo.registeredOfficeAddress.addressLine2}` : ""}
                {company.companyInfo?.registeredOfficeAddress?.city ? `, ${company.companyInfo.registeredOfficeAddress.city}` : ""}
                {company.companyInfo?.registeredOfficeAddress?.state ? `, ${company.companyInfo.registeredOfficeAddress.state}` : ""}
                {company.companyInfo?.registeredOfficeAddress?.country ? `, ${company.companyInfo.registeredOfficeAddress.country}` : ""}
                {company.companyInfo?.registeredOfficeAddress?.pincode ? ` - ${company.companyInfo.registeredOfficeAddress.pincode}` : ""}
              </Text>
            </View>
          )}
        </ToggleSection>

        {/* 🔹 Social Media */}
        <ToggleSection
          icon="AntDesign"
          iconName="sharealt"
          iconSize={22}
          iconColor={Colors.darkBlue}
          title="Social Media"
          isOpen={sectionsOpen.social}
          onToggle={() => toggleSection('social')}
        >
          {company && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Social Media Links</Text>
              {[
                { label: "LinkedIn", value: company.socialMedia?.linkedInURL || "Not Available" },
                { label: "Twitter", value: company.socialMedia?.twitterURL || "Not Available" },
                { label: "YouTube", value: company.socialMedia?.youtubeURL || "Not Available" },
                { label: "Facebook", value: company.socialMedia?.facebookURL || "Not Available" },
              ].map((item, index) => (
                <View key={index} style={[styles.row, index !== 3 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  {item.value !== "Not Available" ? (
                    <Text style={styles.rowValueLink} onPress={() => Linking.openURL(item.value)}>
                      {item.value}
                    </Text>
                  ) : (
                    <Text style={styles.rowValue}>{item.value}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </ToggleSection>

        <ToggleSection
          icon="Ionicons"
          iconName="megaphone-outline"
          iconSize={22}
          iconColor={Colors.darkBlue}
          title="Announcement"
          isOpen={sectionsOpen.announcement}
          onToggle={() => toggleSection('announcement')}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Latest Announcements</Text>
            {[
              { title: "Holiday on 15th August", description: "Independence Day holiday", date: "2025-08-15" },
            ].map((announcement, index) => (
              <View key={index} style={[styles.announcementItem, index !== 0 && styles.rowBorder]}>
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementDesc}>{announcement.description}</Text>
                <Text style={styles.announcementDate}>📅 {announcement.date}</Text>
              </View>
            ))}
          </View>
        </ToggleSection>

        {/* 🔹 Policies */}
        <ToggleSection
          icon="MaterialCommunityIcons"
          iconName="book-lock-outline"
          iconSize={24}
          iconColor={Colors.darkBlue}
          title="Policies"
          isOpen={sectionsOpen.policies}
          onToggle={() => toggleSection('policies')}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Company Policies</Text>
            {policies && policies.length > 0 ? (
              policies.map((policy, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate("PolicyDetail", { policy })}
                  activeOpacity={0.8}
                  style={styles.policyRow}
                >
                  <Text style={styles.policyText}>{`${index + 1}. ${policy.section}: ${policy.title}`}</Text>
                  <Text style={styles.policyViewBtn}>View</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.rowValue}>No Policies Found</Text>
            )}
          </View>
        </ToggleSection>

        {/* 🔹 Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <AntDesignIcon name="logout" size={24} color={Colors.darkBlue} />
          <Text style={styles.logoutText}>Logout</Text>
          <View style={{ flex: 1 }} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyProfileScreen;

const styles = StyleSheet.create({
  topView: {
    alignItems: 'center',
    paddingHorizontal: SW(20),
    backgroundColor: Colors.background,
    borderRadius: SW(12),
    paddingBottom: SH(20),
    marginBottom: SH(10),
  },
  appIconImg: { width: SW(150), height: SH(150) },

  appNameTxt1: {
    fontSize: SF(12),
    fontFamily: "Inter-Medium",
    color: Colors.darkBlue,
    marginBottom: SH(6),
    textAlign: "center",
  },
  appNameTxt2: {
    fontSize: SF(15),
    fontFamily: "Inter-Bold",
    color: '#222',
    marginBottom: SH(6),
    textAlign: "center",
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SH(12),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.lightBlue,
    borderRadius: SW(50),
    marginVertical: SH(5),
  },
  sectionTitle: {
    fontSize: SF(14),
    marginLeft: SW(12),
    fontFamily: "Inter-Medium",
    color: Colors.darkBlue,
  },

  expandContent: {
    paddingHorizontal: SW(5),
    paddingVertical: SH(5),
    backgroundColor: '#f7f7f7',
  },

  card: {
    backgroundColor: "#fff",
    padding: SW(14),
    borderRadius: SW(10),
    elevation: 3,
    marginBottom: SH(12),
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: SW(4),
  },
  cardTitle: {
    fontSize: SF(16),
    fontWeight: "bold",
    marginBottom: SH(10),
    color: "#222",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SH(6),
  },
  rowBorder: { borderBottomWidth: 0.5, borderColor: "#eee" },
  rowLabel: { fontSize: SF(14), fontWeight: "600", color: "#444", flex: 1 },
  rowValue: {
    fontSize: SF(14),
    color: "#555",
    maxWidth: "60%",
    textAlign: "right",
  },
  rowValueLink: {
    fontSize: SF(14),
    color: "#1e90ff",
    textDecorationLine: "underline",
    maxWidth: "60%",
    textAlign: "right",
  },

  announcementItem: { marginBottom: SH(12) },
  announcementTitle: {
    fontSize: SF(15),
    fontWeight: "600",
    marginBottom: SH(2),
    color: "#333",
  },
  announcementDesc: { fontSize: SF(14), color: "#555", marginBottom: SH(4) },
  announcementDate: { fontSize: SF(12), color: Colors.darkGray },

  policyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SH(8),
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  policyText: { fontSize: SF(14), color: "#444", flex: 1 },
  policyViewBtn: { fontSize: SF(14), color: "#1e90ff" },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SH(12),
    paddingHorizontal: SW(30),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.lightBlue,
    borderRadius: SW(50),
    marginVertical: SH(15),
  },
  logoutText: {
    fontSize: SF(14),
    marginLeft: SW(12),
    fontFamily: "Inter-Medium",
    color: Colors.darkBlue,
  },
});
