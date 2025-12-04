import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import styles from '../../Styles/attendanceScreenStyle';
import React, { useEffect, useState } from 'react';
import { SH, SF } from '../../utils/Dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppHeader from '../../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import Colors from '../../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceHistory } from '../../redux/slices/attendanceSlice';
import MonthYearFilterModal from '../../Components/MonthYearFilterModal';
import axios from 'axios';
import { ATTENDANCES_API_DATA } from '../../utils/BASE_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.attendance);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: null,
    year: null
  });

  const formatDate = (date) => {
    if (!date) return '-';
    if (!moment(date).isValid()) return '-';
    return moment(date).format('DD MMM');
  };

  const formatTime = (time) => {
    if (!time) return '-';
    if (!moment(time, 'HH:mm').isValid()) return '-';
    return moment(time, 'HH:mm').format('HH:mm');
  };

  const formatHours = (hrs) => {
    if (!hrs) return '-';
    if (isNaN(Number(hrs))) return '-';
    return Number(hrs).toFixed(2);
  };


  useEffect(() => {
    (async () => {
      const todayMonth = moment().month() + 1;
      const todayYear = moment().year();

      const res1 = await dispatch(
        fetchAttendanceHistory({ month: todayMonth, year: todayYear })
      )
        .unwrap()
        .catch(() => []);

      if (Array.isArray(res1) && res1.length > 0) {
        setSelectedMonthYear({ month: todayMonth, year: todayYear });
        setFilteredData(res1);
        return;
      }

      const res2 = await dispatch(fetchAttendanceHistory()).unwrap().catch(() => []);

      if (Array.isArray(res2) && res2.length > 0) {
        const lastMonthObj = res2[res2.length - 1];
        const lastMonth = lastMonthObj.month;
        const lastYear = lastMonthObj.year;

        const res3 = await dispatch(
          fetchAttendanceHistory({ month: lastMonth, year: lastYear })
        )
          .unwrap()
          .catch(() => []);

        setSelectedMonthYear({ month: lastMonth, year: lastYear });
        setFilteredData(res3);
      }
    })();
  }, []);

  const onApplyFilters = async (filter) => {
    setSelectedMonthYear(filter);

    if (filter.month && filter.year) {
      const token = await AsyncStorage.getItem('authToken');

      const res = await axios.get(
        `${ATTENDANCES_API_DATA}?month=${filter.month}&year=${filter.year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

       console.log("FILTER API:", res.data.data);

      const firstItem = res.data?.data?.[0];
      if (firstItem && firstItem.timestamps) {
        setFilteredData(firstItem.timestamps);
      } else if (Array.isArray(res.data?.data)) {
        setFilteredData(res.data.data);
      } else {
        setFilteredData([]);
      }
    } else {
      dispatch(fetchAttendanceHistory());
      setFilteredData([]);
    }
  };

  const latestData =
    filteredData.length > 0
      ? filteredData[filteredData.length - 1]
      : history?.[history.length - 1]?.timestamps?.slice(-1)[0];

  const latestPunchIn = latestData?.punchIn || '-';
  const latestPunchOut = latestData?.punchOut || '-';
  const latestWorked = latestData?.workedHours ?? latestData?.hoursWorked ?? '-';

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Attendance History" />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gradientBlue} />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#555' }}>
            Loading attendance records...
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <View style={styles.timeChartView}>
              {[
                {
                  icon: 'exit-run',
                  value: formatTime(latestPunchIn),
                  bg: '#E3F2FD',
                  ic: '#1976D2',
                  tc: '#0D47A1'
                },
                {
                  icon: 'logout-variant',
                  value: formatTime(latestPunchOut),
                  bg: '#FFEBEE',
                  ic: '#D32F2F',
                  tc: '#B71C1C'
                },
                {
                  icon: 'clock-outline',
                  value: formatHours(latestWorked),
                  bg: '#E8F5E9',
                  ic: '#388E3C',
                  tc: '#1B5E20'
                }
              ].map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.chartstatusView,
                    { backgroundColor: item.bg, alignItems: 'center' }
                  ]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={item.ic}
                  />
                  <Text style={[styles.punchText, { color: item.tc, marginTop: 4 }]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setFilterModalVisible(true)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: SH(10) }}>
              <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: SH(20) }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Colors.gradientBlue,
                paddingVertical: SH(12),
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
              }}>
              {['Date', 'Punch In', 'Punch Out', 'Total Hours'].map((heading, index) => (
                <Text
                  key={index}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: SF(12),
                    fontFamily: 'Inter-Medium'
                  }}>
                  {heading}
                </Text>
              ))}
            </View>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => `${item.date}-${index}`}
              ListEmptyComponent={() => (
                <View style={{ alignItems: 'center', paddingVertical: SH(40) }}>
                  <AntDesign name="calendar" size={40} color="#9E9E9E" />
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 16,
                      color: '#9E9E9E',
                      fontFamily: 'Inter-Medium'
                    }}>
                    No attendance record found
                  </Text>
                </View>
              )}
              renderItem={({ item, index }) => {
                const worked = item.workedHours ?? item.hoursWorked ?? '-';
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: index % 2 === 0 ? '#F4F7FB' : '#FFFFFF',
                      paddingVertical: SH(12),
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}>
                    <Text style={styles.tableCell}>{formatDate(item.date)}</Text>
                    <Text style={styles.tableCell}>{formatTime(item.punchIn)}</Text>
                    <Text style={styles.tableCell}>{formatTime(item.punchOut)}</Text>
                    <Text style={styles.tableCell}>{formatHours(worked)}</Text>
                  </View>
                );
              }}
            />
          </View>
        </>
      )}

      <MonthYearFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selected={selectedMonthYear}
        onApply={onApplyFilters}
      />
    </SafeAreaView>
  );
};

export default AttendanceScreen;
