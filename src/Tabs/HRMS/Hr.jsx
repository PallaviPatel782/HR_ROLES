import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import CustomHeader from '../../Components/CustomHeader';
import Colors from '../../utils/Colors';
import { SF, SH, SW } from '../../utils/Dimensions';
import styles from '../../Styles/HrStyle';
import { containerStyle } from '../../Styles/ScreenContainer';
import { fetchTodayPunch, punchIn, punchOut } from '../../redux/slices/attendanceSlice';
import { fetchUserProfile, setUserInfo } from '../../redux/slices/profileSlice';
import { fetchAllNotifications } from '../../redux/slices/notificationSlice';

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
    icon: <MaterialCommunityIcons name="calendar-clock" size={30} color="#4A148C" />,
    title: 'Attendance History',
    screen: 'attendanceScreen',
    color: '#e9dfed',
    textColor: '#bc79db',
  },
  // {
  //   icon: <MaterialCommunityIcons name="bullhorn-variant" size={30} color="#311B92" />, 
  //   title: 'Announcement',
  //   screen: 'AnnouncementScreen',
  //   color: '#e1eefa',
  //   textColor: '#3271a8'
  // }
];

const Hr = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notification);
  const notificationCount = notifications?.length || 0;
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  const { punchInTime, punchOutTime } = useSelector((state) => state.attendance);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const stored = await AsyncStorage.getItem('userInfo');
        console.log("stored", stored);
        if (stored) {
          const parsed = JSON.parse(stored);
          const freshProfile = await dispatch(fetchUserProfile(parsed.id)).unwrap();
          const notifications = await dispatch(fetchAllNotifications(parsed.id)).unwrap();
          console.log("📩 Notifications Loaded:", notifications);
          dispatch(setUserInfo(freshProfile));
          setFirstName(freshProfile.firstName || "");
          setLastName(freshProfile.lastName || "");
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getDataOnFocus = async () => {
        const stored = await AsyncStorage.getItem('userInfo');
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch(fetchTodayPunch());
          dispatch(fetchAllNotifications(parsed.id));
        }
      };

      getDataOnFocus();

    }, [dispatch])
  );


  const handlePunchIn = async () => {
    try {
      const res = await dispatch(punchIn()).unwrap();
      showMessage({
        message: res?.message || "Punched In Successfully",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: error?.message || "Punch In Failed",
        type: "danger",
      });
    }
  };

  // Punch Out
  const handlePunchOut = async () => {
    try {
      const res = await dispatch(punchOut()).unwrap();
      showMessage({
        message: res?.message || "Punched Out Successfully",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: error?.message || "Punch Out Failed",
        type: "danger",
      });
    }
  };

  const getGreetingAndIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { greeting: "Good Morning", icon: "☀️" };
    if (hour >= 12 && hour < 17) return { greeting: "Good Afternoon", icon: "🌤️" };
    return { greeting: "Good Evening", icon: "🌙" };
  };

  const { greeting, icon } = getGreetingAndIcon();

  const formatTime = (time) => {
    if (!time) return "--:--";

    const str = String(time);

    if (str.includes("T")) {
      return str.split("T")[1].substring(0, 5);
    }

    return str;
  };

  return (
    <SafeAreaView edges={['top']} style={[containerStyle.container, { flex: 1, paddingHorizontal: 0 }]}>
      <CustomHeader
        navigation={navigation}
        notificationCount={notificationCount}
      />
      <View style={styles.NameContainer}>
        <View>
          <Text style={styles.noon}>{greeting},</Text>
          <Text style={styles.name}>{firstName} {lastName}</Text>
        </View>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: SW(10) }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Punch In & Out</Text>
          </View>

          <View style={styles.punchCard}>
            <View>
              <Text style={styles.punchLabel}>Punch In</Text>
              <Text style={styles.punchTime}>{formatTime(punchInTime)}</Text>

              <Text style={styles.punchLabel}>Punch Out</Text>
              <Text style={styles.punchTime}>{formatTime(punchOutTime)}</Text>
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
                    backgroundColor: '#70b185ff',
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
                    backgroundColor: punchOutTime ? 'gray' : '#de717a',
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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick HR Actions</Text>
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
