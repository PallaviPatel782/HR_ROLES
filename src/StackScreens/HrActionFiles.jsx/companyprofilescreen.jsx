import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyById, fetchPoliciesByCompany } from "../../redux/slices/companyProfileSlice";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SF, SW, SH } from "../../utils/Dimensions";
import { containerStyle } from "../../Styles/ScreenContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../Components/AppHeader";
import Colors from "../../utils/Colors";
import { IMG_URL } from "../../utils/BASE_URL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const ToggleSection = ({
  icon,
  iconName,
  iconSize,
  iconColor,
  title,
  isOpen,
  onToggle,
  children,
}) => (
  <View>
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {icon === "Material" && (
        <MaterialCommunityIcons name={iconName} size={iconSize} color={iconColor} />
      )}
      {icon === "FontAwesome" && (
        <FontAwesome name={iconName} size={iconSize} color={iconColor} />
      )}
      {icon === "Ionicons" && (
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      )}
      {icon === "AntDesign" && (
        <AntDesign name={iconName} size={iconSize} color={iconColor} />
      )}

      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ flex: 1 }} />
      <AntDesign name={isOpen ? "caretup" : "caretdown"} size={12} color={Colors.darkBlue} />
    </TouchableOpacity>

    {isOpen && <View style={styles.expandContent}>{children}</View>}
  </View>
);

const CompanyProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { company, policies, loading } = useSelector((state) => state.companyProfile);
  console.log("company", company);
  console.log("policies", policies);

  const [sectionsOpen, setSectionsOpen] = useState({
    overview: false,
    address: false,
    social: false,
    policies: false,
  });

  const toggleSection = (key) =>
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  useEffect(() => {
    const loadCompany = async () => {
      const companyId = await AsyncStorage.getItem("companyId");
      console.log("companyId",companyId);
      if (companyId) {
        dispatch(fetchCompanyById(companyId));
        dispatch(fetchPoliciesByCompany(companyId));
      }
    };
    loadCompany();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["authToken", "userInfo", "companyName", "companyLogo"]);
    showMessage({ message: "Logout Successful", type: "success" });
    navigation.reset({ index: 0, routes: [{ name: "AuthStack" }] });
  };
  if (loading && !company) {
    return (
      <SafeAreaView style={containerStyle.container}>
        <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle.container}>
      <AppHeader navigation={navigation} title="Company Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {company && (
          <View style={styles.topView}>
            <Image
              style={styles.companyLogo}
              source={
                company.image
                  ? { uri: `${IMG_URL}/${company.image}` }
                  : require("../../assests/Images/logo.png")
              }
              resizeMode="contain"
            />
            <Text style={styles.companyName}>
              {company.companyInfo?.profile?.registeredCompanyName}
            </Text>
            <Text style={styles.industryType}>
              {company.companyInfo?.profile?.industryType || ""}
            </Text>
          </View>
        )}
        <ToggleSection
          icon="Material"
          iconName="timetable"
          iconSize={22}
          iconColor={Colors.darkBlue}
          title="Overview"
          isOpen={sectionsOpen.overview}
          onToggle={() => toggleSection("overview")}
        >
          {company && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Company Overview</Text>

              {[
                { label: "Registered Company Name", value: company.companyInfo?.profile?.registeredCompanyName },
                { label: "Brand Name", value: company.companyInfo?.profile?.brandName },
                { label: "Official Email", value: company.companyInfo?.profile?.companyOfficeEmail, email: true },
                { label: "Website", value: company.companyInfo?.profile?.companyWebsite, link: true },
                { label: "Industry Type", value: company.companyInfo?.profile?.industryType },
                { label: "Official Contact", value: company.companyInfo?.profile?.companyOfficialContact },
                { label: "Domain Name", value: company.companyInfo?.profile?.domainName },
              ]
                .filter((i) => i.value)
                .map((item, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.rowLabel}>{item.label}</Text>

                    {item.link ? (
                      <Text
                        style={styles.rowValueLink}
                        onPress={() =>
                          Linking.openURL(
                            item.value.startsWith("http") ? item.value : `https://${item.value}`
                          )
                        }
                      >
                        {item.value}
                      </Text>
                    ) : item.email ? (
                      <Text
                        style={styles.rowValueLink}
                        onPress={() => Linking.openURL(`mailto:${item.value}`)}
                      >
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
          onToggle={() => toggleSection("address")}
        >
          {company?.companyInfo?.registeredOfficeAddress && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Registered Office</Text>

              <Text style={styles.addressText}>
                {[
                  company.companyInfo.registeredOfficeAddress.addressLine1,
                  company.companyInfo.registeredOfficeAddress.addressLine2,
                  company.companyInfo.registeredOfficeAddress.city,
                  company.companyInfo.registeredOfficeAddress.state,
                  company.companyInfo.registeredOfficeAddress.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
                {company.companyInfo.registeredOfficeAddress.pincode
                  ? ` - ${company.companyInfo.registeredOfficeAddress.pincode}`
                  : ""}
              </Text>
            </View>
          )}
        </ToggleSection>
        <ToggleSection
          icon="AntDesign"
          iconName="sharealt"
          iconSize={22}
          iconColor={Colors.darkBlue}
          title="Social Media"
          isOpen={sectionsOpen.social}
          onToggle={() => toggleSection("social")}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Social Media</Text>

            {(() => {
              const socialLinks = [
                { label: "LinkedIn", value: company?.socialMedia?.linkedInURL },
                { label: "Twitter", value: company?.socialMedia?.twitterURL },
                { label: "YouTube", value: company?.socialMedia?.youtubeURL },
                { label: "Facebook", value: company?.socialMedia?.facebookURL },
              ].filter(item => item.value && item.value.trim() !== "");

              if (socialLinks.length === 0) {
                return <Text style={styles.noPolicies}>No social media links available</Text>;
              }

              return socialLinks.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text
                    style={styles.rowValueLink}
                    onPress={() => Linking.openURL(item.value)}
                  >
                    {item.value}
                  </Text>
                </View>
              ));
            })()}
          </View>

        </ToggleSection>
        <ToggleSection
          icon="Material"
          iconName="book-lock-outline"
          iconSize={24}
          iconColor={Colors.darkBlue}
          title="Policies"
          isOpen={sectionsOpen.policies}
          onToggle={() => toggleSection("policies")}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Company Policies</Text>

            {policies?.length ? (
              policies.map((policy, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.policyRow}
                  onPress={() => navigation.navigate("PolicyDetail", { policy })}
                >
                  <Text style={styles.policyText}>
                    {i + 1}. {policy.section}: {policy.title}
                  </Text>
                  <Text style={styles.policyLink}>View</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noPolicies}>No policies found</Text>
            )}
          </View>
        </ToggleSection>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <AntDesign name="logout" size={22} color={Colors.darkBlue} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyProfileScreen;

const styles = StyleSheet.create({
  topView: {
    alignItems: "center",
    paddingTop: SH(10),
    paddingBottom: SH(20),
  },
  companyLogo: { width: SW(120), height: SH(120), marginBottom: SH(10) },
  companyName: {
    fontSize: SF(18),
    fontFamily: "Inter-Bold",
    color: Colors.darkBlue,
  },
  industryType: {
    fontSize: SF(13),
    fontFamily: "Inter-Medium",
    color: "#444",
    marginTop: SH(4),
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SH(12),
    paddingHorizontal: SW(20),
    backgroundColor: Colors.lightBlue,
    borderRadius: SW(50),
    marginVertical: SH(8),
  },
  sectionTitle: {
    marginLeft: SW(10),
    fontSize: SF(14),
    color: Colors.darkBlue,
    fontFamily: "Inter-Medium",
  },
  expandContent: {
    paddingHorizontal: SW(10),
    paddingTop: SH(5),
  },

  card: {
    backgroundColor: "#fff",
    padding: SW(14),
    borderRadius: SW(10),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: SH(10),
  },

  cardTitle: {
    fontSize: SF(15),
    fontFamily: "Inter-Bold",
    color: Colors.darkBlue,
    marginBottom: SH(10),
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SH(8),
  },

  rowLabel: {
    fontSize: SF(14),
    fontFamily: "Inter-Medium",
    color: "#333",
    flex: 1,
  },

  rowValue: {
    fontSize: SF(14),
    fontFamily: "Inter",
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

  addressText: {
    fontSize: SF(14),
    color: "#444",
  },

  policyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SH(8),
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  policyText: { fontSize: SF(14), color: "#333", flex: 1 },
  policyLink: { fontSize: SF(14), color: "#1e90ff" },
  noPolicies: { fontSize: SF(14), color: "#555" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: SH(12),
    paddingHorizontal: SW(30),
    backgroundColor: Colors.lightBlue,
    borderRadius: SW(50),
    marginTop: SH(12),
  },
  logoutText: {
    fontSize: SF(14),
    marginLeft: SW(10),
    color: Colors.darkBlue,
  },
});
