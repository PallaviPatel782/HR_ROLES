import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import styles from '../../Styles/attendanceScreenStyle';
import React, { useEffect, useState } from 'react';
import { SH, SF } from '../../utils/Dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppHeader from '../../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import Colors from '../../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterModal from '../../Components/FilterModal';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceHistory } from '../../redux/slices/attendanceSlice';

const AttendanceScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.attendance);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredDaysData, setFilteredDaysData] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    dateRange: { from: null, to: null },
  });

  useEffect(() => {
    dispatch(fetchAttendanceHistory());
  }, [dispatch]);

  const onApplyFilters = (appliedFilters) => {
    const fromDate = appliedFilters.dateRange.from
      ? new Date(appliedFilters.dateRange.from.setHours(0, 0, 0, 0))
      : null;
    const toDate = appliedFilters.dateRange.to
      ? new Date(appliedFilters.dateRange.to.setHours(23, 59, 59, 999))
      : null;

    setLocalFilters({ dateRange: { from: fromDate, to: toDate } });

    const filtered = history.filter(item => {
      const itemDate = new Date(item.date);
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });
    setFilteredDaysData(filtered);
  };

  const latestRecord = history?.[history.length - 1] || {};

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Attendance History" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gradientBlue} />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#555' }}>
            Loading attendance records...
          </Text>
        </View>
      ) : (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
                <View key={index} style={[styles.chartstatusView, { backgroundColor: item.backgroundColor, alignItems: 'center' }]}>
                  <MaterialCommunityIcons name={item.icon} size={22} color={item.iconColor} />
                  <Text style={[styles.punchText, { color: item.textColor, marginTop: 4 }]}>{item.value}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: SH(10) }}>
              <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
            </TouchableOpacity>
          </View>

          <View style={{ marginVertical: SH(20) }}>
            <View style={{
              flexDirection: 'row',
              backgroundColor: Colors.gradientBlue,
              paddingVertical: SH(12),
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
              {['Date', 'Punch In', 'Punch Out', 'Total Hours'].map((heading, index) => (
                <Text key={index} style={{ flex: 1, textAlign: 'center', color: 'white', fontSize: SF(12), fontFamily: 'Inter-Medium' }}>
                  {heading}
                </Text>
              ))}
            </View>

            <FlatList
              data={filteredDaysData.length > 0 ? filteredDaysData : history || []}
              keyExtractor={(item, index) => `${item.date}-${index}`}
              renderItem={({ item, index }) => {
                const formattedDate = moment(item.date).format("DD MMM");
                return (
                  <View style={{
                    flexDirection: 'row',
                    backgroundColor: index % 2 === 0 ? '#F4F7FB' : '#FFFFFF',
                    paddingVertical: SH(12),
                    borderBottomWidth: 1,
                    borderBottomColor: '#E0E0E0',
                  }}>
                    <Text style={[styles.tableCell, { fontFamily: 'Inter-Bold' }]}>{formattedDate}</Text>
                    <Text style={styles.tableCell}>{item.punchIn || '-'}</Text>
                    <Text style={styles.tableCell}>{item.punchOut || '-'}</Text>
                    <Text style={styles.tableCell}>{item.hoursWorked || '-'}</Text>
                  </View>
                );
              }}
              ListEmptyComponent={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: SH(40) }}>
                  <AntDesign name="calendar" size={40} color="#9E9E9E" />
                  <Text style={{ marginTop: 10, fontSize: 16, color: '#9E9E9E', fontFamily: 'Inter-Medium' }}>
                    No attendance record found
                  </Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: SH(20), flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}

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
