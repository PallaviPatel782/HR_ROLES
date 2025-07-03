import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { SF, SW, SH } from '../../utils/Dimensions';
import { containerStyle } from '../../Styles/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import Colors from '../../utils/Colors';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ToggleSection = ({ icon, iconName, iconSize, iconColor, title, isOpen, onToggle, children, paddingHorizontal }) => (
  <View>
    <TouchableOpacity
      style={[styles.btn, { paddingHorizontal: paddingHorizontal || windowWidth * 0.07 }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {icon === 'MaterialCommunityIcons' && (
        <MaterialCommunityIcon name={iconName} size={iconSize} color={iconColor} />
      )}
      {icon === 'FontAwesome' && (
        <FontAwesomeIcon name={iconName} size={iconSize} color={iconColor} />
      )}
      {icon === 'Ionicons' && (
        <IoniconsIcon name={iconName} size={iconSize} color={iconColor} />
      )}
      {icon === 'AntDesign' && (
        <AntDesignIcon name={iconName} size={iconSize} color={iconColor} />
      )}
      <Text style={styles.btnTxt}>{title}</Text>
      <View style={{ flex: 1 }} />
      <AntDesignIcon name={isOpen ? 'caretup' : 'caretdown'} size={12} color={Colors.darkBlue} />
    </TouchableOpacity>
    {isOpen && <View style={styles.expandContent}>{children}</View>}
  </View>
);

const Companyprofilescreen = ({ navigation }) => {
  const [sectionsOpen, setSectionsOpen] = useState({
    overview: false,
    address: false,
    announcement: false,
    policies: false,
    admins: false,
  });

  const toggleSection = (key) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Company's Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topView}>
          <Image
            style={styles.appIconImg}
            source={require('../../assests/Images/logo.png')}
            resizeMode="contain"
          />
          <Text style={[styles.appNameTxt1, { fontSize: SF(12) }]}>Redefining Recruitment</Text>
          <Text style={styles.appNameTxt2}>Webseeder Technology</Text>
          <Text style={styles.companyWebsiteTxt}>www.webseedertechnology.com</Text>
        </View>
        <ToggleSection
          icon="MaterialCommunityIcons"
          iconName="timetable"
          iconSize={24}
          iconColor={Colors.darkBlue}
          title="Overview"
          isOpen={sectionsOpen.overview}
          onToggle={() => toggleSection('overview')}
        >
          {[
            { label: "Registered Company Name", value: 'Webseeder Technology' },
            { label: "Official Email", value: 'contact@webseedertech.com' },
            { label: "Website", value: 'www.webseedertechnology.com' },
            { label: "Industry Type", value: 'Recruitment Services' },
          ].map((item, index) => (
            <View key={index} style={styles.sectionItem}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          ))}
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
          {['Registered Office', 'Head Office', 'Branch Office'].map((title, index) => (
            <View key={index} style={styles.sectionItem}>
              <Text style={styles.itemLabel}>{title}</Text>
              <Text style={styles.itemValue}>
                In publishing and graphic design, Lorem ipsum is placeholder text commonly used to demonstrate
              </Text>
            </View>
          ))}
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
          {[
            {
              title: 'Holiday on 15th August',
              description: 'The office will remain closed on the occasion of Independence Day.',
              date: '2025-08-15',
            },
            {
              title: 'New HR Policy Released',
              description: 'Please check the updated guidelines in the Policies section.',
              date: '2025-07-01',
            },
            {
              title: 'Monthly Townhall',
              description: 'Join us for the July Townhall on 10th July at 4:00 PM.',
              date: '2025-07-10',
            },
          ].map((announcement, index) => (
            <View key={index} style={styles.sectionItem}>
              <Text style={[styles.itemLabel, { marginBottom: 2 }]}>{announcement.title}</Text>
              <Text style={styles.itemValue}>{announcement.description}</Text>
              <Text style={[styles.itemLabel, { marginTop: 6, fontSize: SF(11), color: Colors.darkGray }]}>
                {announcement.date}
              </Text>
            </View>
          ))}
        </ToggleSection>

        <ToggleSection
          icon="MaterialCommunityIcons"
          iconName="book-lock-outline"
          iconSize={24}
          iconColor={Colors.darkBlue}
          title="Policies"
          isOpen={sectionsOpen.policies}
          onToggle={() => toggleSection('policies')}
        >
          {[
            { label: '1. Policy 1.1: About the contract', screen: 'PolicyDetail1' },
            { label: '2. Policy 1.2: About the Rules', screen: 'PolicyDetail2' },
          ].map((policy, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(policy.screen)}
              activeOpacity={0.8}
              style={styles.sectionItem}
            >
              <Text style={styles.itemValue}>{policy.label}</Text>
            </TouchableOpacity>
          ))}
        </ToggleSection>

       <View style={{alignSelf:"flex-end"}}>
         <TouchableOpacity
          style={[styles.btn, { paddingHorizontal: windowWidth * 0.08 }]}
          onPress={() => alert('Logout pressed')}
          activeOpacity={0.7}
        >
          <AntDesignIcon name="logout" size={24} color={Colors.darkBlue} />
          <Text style={styles.btnTxt}>Logout</Text>
          <View style={{ flex: 1 }} />
        </TouchableOpacity>
       </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  sectionItem: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: SW(10),
    paddingVertical: SH(10),
    marginVertical: SH(5),
    marginHorizontal: SW(1),
    alignSelf: 'stretch',
    shadowColor: Colors.gradientBlue,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  itemLabel: {
    fontSize: SF(12),
    color: Colors.darkGray,
    fontFamily: 'Inter-Medium',
    marginBottom: 5,
  },

  itemValue: {
    fontSize: SF(12),
    color: Colors.dark,
    fontFamily: 'Inter-Regular',
  },

  companyProfileTxt: {
    fontSize: SF(18),
    fontFamily: "Inter-Bold",
    color: '#000',
    marginVertical: SH(10),
    alignSelf: 'center',
  },
  topView: {
    alignItems: 'center',
    paddingHorizontal: SW(20),
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingBottom: SH(20)
  },
  appIconImg: {
    width: SW(200),
    height: SH(175),
  },
  appNameTxt1: {
    fontSize: SF(12),
    fontFamily: "Inter-Medium",
    color: Colors.darkBlue,
    marginBottom: SH(6),
  },
  appNameTxt2: {
    fontSize: SF(15),
    fontFamily: "Inter-Bold",
    color: '#222',
    marginBottom: SH(6),
  },
  companyWebsiteTxt: {
    fontSize: SF(13),
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  view2: {
    flex: 1,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SH(12),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.lightBlue,
    borderRadius: 50,
    marginVertical: SH(5)
  },
  btnTxt: {
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
  registerTxt: {
    fontSize: SF(13),
    fontFamily: "Inter-Medium",
    color: Colors.darkBlue,
    marginTop: SH(8),
  },
  whiteView: {
    backgroundColor: '#fff',
    paddingHorizontal: SH(10),
    marginVertical: SH(5),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default Companyprofilescreen;
