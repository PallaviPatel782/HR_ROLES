import { View, Text, TouchableOpacity, FlatList, Modal, useColorScheme, Platform, } from 'react-native';
import styles from '../../Styles/attendanceScreenStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { SH, SW, SF } from '../../utils/Dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import Colors from '../../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterModal from '../../Components/FilterModal';
import moment from 'moment';
import { ATTENDANCE_RECORDS } from '../../utils/BASE_URL';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceScreen = ({ navigation }) => {
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [filteredDaysData, setFilteredDaysData] = useState([]);

  const getAttendance = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const res = await axios.get(ATTENDANCE_RECORDS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {}
      });

      console.log("Attendance API Response:", res.data);
      return res.data;

    } catch (err) {
      console.error("Attendance API Error:", err);
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem("authToken");
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'AuthStack',
              state: {
                routes: [{ name: 'LoginScreen' }],
              },
            },
          ],
        });
      }
      return null;
    }
  };

  const [localFilters, setLocalFilters] = useState({
    dateRange: { from: null, to: null },
  });

  const onApplyFilters = (appliedFilters) => {
    console.log('Applied Filters:', appliedFilters);

    const fromDate = appliedFilters.dateRange.from
      ? new Date(appliedFilters.dateRange.from.setHours(0, 0, 0, 0))
      : null;

    const toDate = appliedFilters.dateRange.to
      ? new Date(appliedFilters.dateRange.to.setHours(23, 59, 59, 999))
      : null;

    setLocalFilters({
      dateRange: {
        from: fromDate,
        to: toDate,
      },
    });

    const filtered = daysData.filter(item => {
      const itemDate = new Date(item.date);
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });

    setFilteredDaysData(filtered);
  };


  const daysData = [
    {
      day: '01',
      month: 'June',
      dayOfWeek: 'Sun',
      date: new Date('2025-06-01'),
      punchIn: '09:00 AM',
      punchOut: '06:00 PM',
      totalHours: '9h',
    },
    {
      day: '02',
      month: 'June',
      dayOfWeek: 'Mon',
      date: new Date('2025-06-02'),
      punchIn: '09:15 AM',
      punchOut: '06:10 PM',
      totalHours: '8h 55m',
    },
    {
      day: '03',
      month: 'June',
      dayOfWeek: 'Tue',
      date: new Date('2025-06-03'),
      punchIn: '09:05 AM',
      punchOut: '05:50 PM',
      totalHours: '8h 45m',
    },
    {
      day: '04',
      month: 'June',
      dayOfWeek: 'Wed',
      date: new Date('2025-06-04'),
      punchIn: '09:10 AM',
      punchOut: '06:00 PM',
      totalHours: '8h 50m',
    },
    {
      day: '05',
      month: 'June',
      dayOfWeek: 'Thu',
      date: new Date('2025-06-05'),
      punchIn: '09:00 AM',
      punchOut: '06:10 PM',
      totalHours: '9h 10m',
    },
    {
      day: '06',
      month: 'June',
      dayOfWeek: 'Fri',
      date: new Date('2025-06-06'),
      punchIn: '09:30 AM',
      punchOut: '06:00 PM',
      totalHours: '8h 30m',
    },
    {
      day: '07',
      month: 'June',
      dayOfWeek: 'Sat',
      date: new Date('2025-06-07'),
      punchIn: '10:00 AM',
      punchOut: '04:00 PM',
      totalHours: '6h',
    },
    {
      day: '08',
      month: 'June',
      dayOfWeek: 'Sun',
      date: new Date('2025-06-08'),
      punchIn: '09:00 AM',
      punchOut: '06:00 PM',
      totalHours: '9h',
    },
    {
      day: '09',
      month: 'June',
      dayOfWeek: 'Mon',
      date: new Date('2025-06-09'),
      punchIn: '08:55 AM',
      punchOut: '05:45 PM',
      totalHours: '8h 50m',
    },
    {
      day: '10',
      month: 'June',
      dayOfWeek: 'Tue',
      date: new Date('2025-06-10'),
      punchIn: '09:20 AM',
      punchOut: '06:15 PM',
      totalHours: '8h 55m',
    },
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const punchInTime = '09:00 AM';
  const punchOutTime = '06:00 PM';
  const totalHours = '9h 00m';

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Attendance History" />
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

        <View style={styles.timeChartView}>
          {[
            {
              icon: 'exit-run',
              value: punchInTime,
              backgroundColor: '#E3F2FD',
              iconColor: '#1976D2',
              textColor: '#0D47A1',
            },
            {
              icon: 'logout-variant',
              value: punchOutTime,
              backgroundColor: '#FFEBEE',
              iconColor: '#D32F2F',
              textColor: '#B71C1C',
            },
            {
              icon: 'clock-outline',
              value: totalHours,
              backgroundColor: '#E8F5E9',
              iconColor: '#388E3C',
              textColor: '#1B5E20',
            },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                styles.chartstatusView,
                {
                  backgroundColor: item.backgroundColor,
                  alignItems: 'center',
                },
              ]}
            >
              <MaterialCommunityIcons name={item.icon} size={22} color={item.iconColor} />
              <Text style={[styles.punchText, { color: item.textColor, marginTop: 4 }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: SH(10) }}>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
            {/* <Text style={{ color: Colors.primary, marginLeft: 6, fontSize: 16 }}>Filter</Text> */}
          </TouchableOpacity>
        </View>

      </View>
      <View style={{ marginVertical: SH(20), paddingHorizontal: 0 }}>
        {/* Table Header */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: Colors.gradientBlue,
          paddingVertical: SH(12),
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}>
          {['Date', 'Punch In', 'Punch Out', 'Total Hours'].map((heading, index) => (
            <Text
              key={index}
              style={{
                flex: 1,
                textAlign: 'center',
                color: 'white',
                fontFamily: 'Inter-SemiBold',
                fontSize: SF(14),
              }}
            >
              {heading}
            </Text>
          ))}
        </View>
        <FlatList
          data={filteredDaysData.length > 0 ? filteredDaysData : daysData}
          keyExtractor={(item, index) => `${item.day}-${item.month}-${index}`}
          renderItem={({ item, index }) => (
            <View style={{
              flexDirection: 'row',
              backgroundColor: index % 2 === 0 ? '#F4F7FB' : '#FFFFFF',
              paddingVertical: SH(12),
              borderBottomWidth: 1,
              borderBottomColor: '#E0E0E0',
            }}>
              <Text style={[styles.tableCell, { fontFamily: 'Inter-Bold' }]}>{`${item.day} ${item.month}`}</Text>
              <Text style={styles.tableCell}>{item.punchIn}</Text>
              <Text style={styles.tableCell}>{item.punchOut}</Text>
              <Text style={styles.tableCell}>{item.totalHours}</Text>
            </View>
          )}
          contentContainerStyle={{
            paddingBottom: SH(20),
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            overflow: 'hidden',
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        options={[]}
        selectedFilters={localFilters}
        onApply={onApplyFilters}
      />
    </SafeAreaView>
  );
};

export default AttendanceScreen;
