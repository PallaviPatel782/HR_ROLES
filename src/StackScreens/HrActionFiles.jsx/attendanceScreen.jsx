import { View, Text, TouchableOpacity, FlatList, Modal, useColorScheme, Platform, } from 'react-native';
import styles from '../../Styles/attendanceScreenStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
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
import { ATTENDANCES_API_DATA } from '../../utils/BASE_URL';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceScreen = ({ navigation }) => {
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [filteredDaysData, setFilteredDaysData] = useState([]);
  const [AttendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    getAttendance();
  }, [])

  const getAttendance = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const res = await axios.get(ATTENDANCES_API_DATA, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {}
      });
      setAttendanceData(res.data)

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

const latestRecord = AttendanceData?.data?.[AttendanceData.data.length - 1] || {};

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Attendance History" />
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

        <View style={styles.timeChartView}>
          {[
            {
              icon: 'exit-run',
              value: latestRecord.punchIn || "-",
              backgroundColor: '#E3F2FD',
              iconColor: '#1976D2',
              textColor: '#0D47A1',
            },
            {
              icon: 'logout-variant',
              value: latestRecord.punchOut || "-",
              backgroundColor: '#FFEBEE',
              iconColor: '#D32F2F',
              textColor: '#B71C1C',
            },
            {
              icon: 'clock-outline',
              value: latestRecord.hoursWorked || "-",
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
                fontFamily: 'Inter-Medium',
                fontSize: SF(12),
              }}
            >
              {heading}
            </Text>
          ))}
        </View>
        <FlatList
          data={filteredDaysData.length > 0 ? filteredDaysData : AttendanceData?.data || []}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          renderItem={({ item, index }) => {
            const formattedDate = moment(item.date, "DD/MM/YYYY").format("DD MMM");

            return (
              <View style={{
                flexDirection: 'row',
                backgroundColor: index % 2 === 0 ? '#F4F7FB' : '#FFFFFF',
                paddingVertical: SH(12),
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
              }}>
                <Text style={[styles.tableCell, { fontFamily: 'Inter-Bold' }]}>{formattedDate}</Text>
                <Text style={styles.tableCell}>{item.punchIn || "-"}</Text>
                <Text style={styles.tableCell}>{item.punchOut || "-"}</Text>
                <Text style={styles.tableCell}>{item.hoursWorked || "-"}</Text>
              </View>
            );
          }}
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
