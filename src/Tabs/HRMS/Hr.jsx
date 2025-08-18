import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ATTENDANCE_RECORD, PUNCH_IN_API, PUNCH_Out_API } from '../../utils/BASE_URL';
import { showMessage } from 'react-native-flash-message';

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
  // {
  //   icon: <MaterialCommunityIcons name="bullhorn-variant" size={30} color="#311B92" />, // Deep Indigo
  //   title: 'Announcement',
  //   screen: 'AnnouncementScreen',
  //   color: '#e1eefa',
  //   textColor: '#3271a8'
  // }
];

const Hr = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          setFirstName(userInfo.firstName);
          setLastName(userInfo.lastName);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchTodayPunch();
  }, []);

  const fetchTodayPunch = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const res = await axios.get(ATTENDANCE_RECORD, { headers });

      if (res.data?.data?.timestamps?.length > 0) {
        const today = new Date().toDateString();
        const todayRecord = res.data.data.timestamps.find((t) => {
          const punchDate = new Date(t.punchIn).toDateString();
          return punchDate === today;
        });

        if (todayRecord) {
          console.log("Today's Punch Data Found:", todayRecord);
          setPunchInTime(todayRecord.punchIn || null);
          setPunchOutTime(todayRecord.punchOut || null);
        } else {
          console.warn("No punch data for today.");
          setPunchInTime(null);
          setPunchOutTime(null);
        }
      } else {
        console.warn("No timestamps found in response.");
        setPunchInTime(null);
        setPunchOutTime(null);
      }
    } catch (err) {
      console.error("Error fetching punch data:", err);
      if (err.response) {
        console.error("Error Response Status:", err.response.status);
        console.error("Error Response Data:", err.response.data);
      } else {
        console.error("Error Message:", err.message);
      }
    }
  };


  const handlePunchIn = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.post(
        PUNCH_IN_API,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Punch In API Response:", res.data);

      showMessage({
        message: res.data?.message || "Punch-in successful",
        type: "success",
        icon: "success",
      });

      const now = new Date();
      setPunchInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Punch In failed:', err);
      showMessage({
        message: "Punch-in failed. Please try again.",
        type: "danger",
        icon: "danger",
      });
    }
  };

  const handlePunchOut = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await axios.post(
        PUNCH_Out_API,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Punch Out API Response:", res.data);

      showMessage({
        message: res.data?.message || "Punch-out successful",
        type: "success",
        icon: "success",
      });

      const now = new Date();
      setPunchOutTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Punch Out failed:', err);
      showMessage({
        message: "Punch-out failed. Please try again.",
        type: "danger",
        icon: "danger",
      });
    }
  };

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

  const formatTime = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
      hour12: true
    };

    return date.toLocaleTimeString('en-IN', options);
  };

  return (
    <SafeAreaView edges={['top']} style={[containerStyle.container, { flex: 1, paddingHorizontal: 0 }]}>
      <CustomHeader navigation={navigation} />
      <View style={styles.NameContainer}>
        <View>
          <Text style={styles.noon}>{greeting},</Text>
          <Text style={styles.name}>{firstName} {lastName}</Text>
        </View>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View>
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom
          }}>
          <View style={{ paddingHorizontal: SW(10) }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Punch In & Out</Text>
            </View>

            <View style={styles.punchCard}>
              <View>
                <Text style={styles.punchLabel}>Punch In</Text>
                <Text style={styles.punchTime}>
                  {punchInTime ? formatTime(new Date(punchInTime)) : '--:--'}
                </Text>

                <Text style={styles.punchLabel}>Punch Out</Text>
                <Text style={styles.punchTime}>
                  {punchOutTime ? formatTime(new Date(punchOutTime)) : '--:--'}
                </Text>
              </View>

           <View>
  {!punchInTime ? (
    <TouchableOpacity
      onPress={handlePunchIn}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SH(10),
        backgroundColor: 'green',
        paddingVertical: SH(12),
        paddingHorizontal: SW(20),
        borderRadius: 8,
      }}
    >
      <MaterialCommunityIcons name="login" size={20} color="white" />
      <Text style={{ color: 'white', marginLeft: SW(8), fontSize: SF(13), fontFamily: 'Inter-Medium' }}>
        Punch In
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={!punchOutTime ? handlePunchOut : null}
      disabled={!!punchOutTime}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SH(10),
        backgroundColor: punchOutTime ? 'gray' : 'red',
        paddingVertical: SH(12),
        paddingHorizontal: SW(20),
        borderRadius: 8,
        opacity: punchOutTime ? 0.6 : 1,
      }}
    >
      <MaterialCommunityIcons name="exit-run" size={20} color="white" />
      <Text style={{ color: 'white', marginLeft: SW(8), fontSize: SF(13), fontFamily: 'Inter-Medium' }}>
        {punchOutTime ? 'Punched Out' : 'Punch Out'}
      </Text>
    </TouchableOpacity>
  )}
</View>



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
      </View>
    </SafeAreaView>
  );
};

export default Hr;
