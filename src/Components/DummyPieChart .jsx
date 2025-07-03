import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PieChart from 'react-native-pie-chart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SF, SW, SH } from '../utils/Dimensions';
import Colors from '../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DummyPieChart = ({ salaryData = [] }) => {
  const widthAndHeight = 150;
  const [currentYear] = useState(new Date().getFullYear());

  const months = [
    { short: 'Jan', full: 'January' },
    { short: 'Feb', full: 'February' },
    { short: 'Mar', full: 'March' },
    { short: 'Apr', full: 'April' },
    { short: 'May', full: 'May' },
    { short: 'Jun', full: 'June' },
    { short: 'Jul', full: 'July' },
    { short: 'Aug', full: 'August' },
    { short: 'Sep', full: 'September' },
    { short: 'Oct', full: 'October' },
    { short: 'Nov', full: 'November' },
    { short: 'Dec', full: 'December' }
  ];

  const [currentMonthIndex, setCurrentMonthIndex] = useState(3);

  const generateMonthlyData = () => {
    const monthName = months[currentMonthIndex].full;
    const currentMonthData = salaryData.find((item) => {
      const itemMonth = new Date(item.date).toLocaleString('default', { month: 'long' });
      return itemMonth === monthName;
    });

    if (!currentMonthData) return null;

    return [
      { label: 'Present', value: currentMonthData.presentDays, color: '#FDC978' },
      { label: 'Absent', value: currentMonthData.absentDays, color: '#D9D9D9' },
      { label: 'working', value: currentMonthData.workingDays, color: '#A68EFF' },
    ];
  };

  const data = generateMonthlyData();
  const series = data ? data.map(item => ({ value: item.value, color: item.color })) : [];

  const goToPreviousMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex < months.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const hasPreviousMonth = currentMonthIndex > 0;
  const hasNextMonth = currentMonthIndex < months.length - 1;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="timelapse" size={20} color={'#4d0b37'} style={{
          backgroundColor: '#A68EFF',
          paddingHorizontal: SW(5), paddingVertical: SH(5), borderRadius: 50
        }} />
        <Text style={styles.headerText}>Attendance Recap</Text>
      </View>

      <View style={styles.monthNav}>
        <View>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToPreviousMonth}
            disabled={!hasPreviousMonth}
          >
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={hasPreviousMonth ? "#888" : "#EEE"}
            />
            {hasPreviousMonth && (
              <Text style={styles.adjacentMonthText}>
                {months[currentMonthIndex - 1].short} '{String(currentYear).slice(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.currentMonthText}>
            {months[currentMonthIndex].short} '{String(currentYear).slice(2)}
          </Text>
        </View>

        <View>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToNextMonth}
            disabled={!hasNextMonth}
          >
            {hasNextMonth && (
              <Text style={styles.adjacentMonthText}>
                {months[currentMonthIndex + 1].short} '{String(currentYear).slice(2)}
              </Text>
            )}
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={hasNextMonth ? "#888" : "#EEE"}
            />
          </TouchableOpacity>
        </View>
      </View>
      {data ? (
        <>
          <View style={styles.chartContainer}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              doughnut={true}
              coverRadius={0.6}
              coverFill={'#FFF'}
            />
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendRow}>
              {data.map((item, index) => (
                <View key={`label-${index}`} style={styles.legendColumn}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.legendRow}>
              {data.map((item, index) => (
                <View key={`value-${index}`} style={styles.legendColumn}>
                  <Text style={styles.legendValue}>{item.value} days</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={{ alignItems: 'center', marginTop: SH(20) }}>
          <Text style={{ fontSize: SF(16), color: Colors.darkGray }}>Data not available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: SW(16),
    paddingVertical: SH(14),
    alignSelf: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: SW(2),
    marginVertical: SH(2)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SH(20),
  },
  headerText: {
    fontFamily: 'Inter-Bold',
    fontSize: SF(15),
    color: Colors.dark,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SH(10),
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentMonthText: {
    fontFamily: 'Inter-Bold',
    fontSize: SF(14),
    color: Colors.dark,
  },
  adjacentMonthText: {
    fontFamily: 'Inter-Medium',
    fontSize: SF(13),
    color: Colors.darkGray,
  },
  chartContainer: {
    marginVertical: SH(8),
    alignSelf: "center"
  },
  legendContainer: {
    width: '100%',
    marginTop: SH(12),
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SH(4),
  },
  legendColumn: {
    alignItems: 'center',
    minWidth: SW(100),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: SF(11),
    fontFamily: 'Inter-Medium',
    color: Colors.darkGray,
  },
  legendValue: {
    fontSize: SF(12),
    fontFamily: 'Inter-Bold',
    color: Colors.dark,
  },
});

export default DummyPieChart;

