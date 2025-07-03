import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../Components/CustomHeader';
import Heading from '../../Components/Headings';
import Colors from '../../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { SF, SH, SW } from '../../utils/Dimensions';
import styles from '../../Styles/HrStyle';
import { containerStyle } from '../../Styles/ScreenContainer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const actions = [
  {
    icon: <FontAwesome5 name="calendar-check" size={30} color="white" />,
    title: 'Apply Leave',
    screen: 'getleavescreen',
    color: '#f5e3dc',
    textColor: '#f5b29a',
  },
  {
    icon: <FontAwesome name="user" size={30} color="#546180" />,
    title: 'User Profile',
    screen: 'userprofilescreen',
    color: '#dff3f5',
    textColor: '#47dded',
  },
  {
    icon: <Entypo name="briefcase" size={30} color="#000" />,
    title: 'Company Profile',
    screen: 'companyprofilescreen',
    color: '#f5f1d3',
    textColor: '#ebd409',
  },
  {
    icon: <MaterialCommunityIcons name="cash-multiple" size={30} color="#2E7D32" />,
    title: 'Salary Slip',
    screen: 'salaryscreen',
    color: '#e1f2e7',
    textColor: '#84bf97',
  },
  {
    icon: <MaterialCommunityIcons name="calendar-clock" size={30} color="#4A148C" />, // Dark Purple
    title: 'Attendance History',
    screen: 'attendanceScreen',
    color: '#e9dfed',
    textColor: '#bc79db',
  },
];

const getGreetingAndIcon = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { greeting: "Good Morning", icon: "☀️" };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: "Good Afternoon", icon: "🌤️" };
  } else {
    return { greeting: "Good Evening", icon: "🌙" };
  }
};

const { greeting, icon } = getGreetingAndIcon();


const Hr = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[containerStyle.container, { paddingHorizontal: 0 }]}>
      <CustomHeader navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: SW(10) }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Punch In & Out</Text>
          </View>

          <View style={styles.punchCard}>
            <View style={styles.punchTimes}>
              <Text style={styles.punchLabel}>Punch In</Text>
              <Text style={styles.punchTime}>16:27</Text>
              <Text style={[styles.punchLabel, { marginTop: SH(16) }]}>Punch Out</Text>
              <Text style={styles.punchTime}>--:--</Text>
            </View>
            <TouchableOpacity style={styles.punchOutButton}>
              <MaterialCommunityIcons name="exit-run" size={28} color="white" />
              <Text style={styles.punchOutText}>Punch Out</Text>
            </TouchableOpacity>
          </View>

          {/* HR Actions Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick HR Actions</Text>
            {/* <TouchableOpacity>
            <Text style={styles.sectionAction}>Edit</Text>
          </TouchableOpacity> */}
          </View>

          <View style={styles.grid}>
            {actions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, { backgroundColor: item.color }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={[styles.iconWrapper, { backgroundColor: item.textColor }]}>
                  {React.cloneElement(item.icon, { color: Colors.light })}
                </View>
                <Text style={[styles.cardText, { color: Colors.dark }]}>{item.title}</Text>
              </TouchableOpacity>
            ))}

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Hr;
