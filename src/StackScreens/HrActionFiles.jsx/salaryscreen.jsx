import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, Linking, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import AppHeader from '../../Components/AppHeader';
import styles from '../../Styles/SalaryHistoryStyle';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import { SF, SH, SW } from '../../utils/Dimensions';
import FilterModal from '../../Components/FilterModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DummyPieChart from '../../Components/DummyPieChart ';

const SalaryScreen = ({ navigation }) => {
  const [salaryData] = useState([
    {
      date: '2025-05-05',
      displayDate: '5 MAY 2025',
      workingDays: 24,
      presentDays: 20,
      absentDays: 4,
      creditedSalary: '₹21,000',
      receiptUrl: 'https://example.com/receipt_may_2025.pdf',
    },
    {
      date: '2025-04-10',
      displayDate: '10 APRIL 2025',
      workingDays: 24,
      presentDays: 22,
      absentDays: 2,
      creditedSalary: '₹23,000',
      receiptUrl: 'https://example.com/receipt_april_2025.pdf',
    },
    {
      date: '2025-03-07',
      displayDate: '7 MARCH 2025',
      workingDays: 24,
      presentDays: 21,
      absentDays: 3,
      creditedSalary: '₹22,000',
      receiptUrl: 'https://example.com/receipt_march_2025.pdf',
    },
    {
      date: '2025-02-05',
      displayDate: '5 FEBRUARY 2025',
      workingDays: 24,
      presentDays: 23,
      absentDays: 1,
      creditedSalary: '₹23,500',
      receiptUrl: 'https://example.com/receipt_feb_2025.pdf',
    },
    {
      date: '2025-01-10',
      displayDate: '10 JANUARY 2025',
      workingDays: 24,
      presentDays: 21,
      absentDays: 3,
      creditedSalary: '₹22,000',
      receiptUrl: 'https://example.com/receipt_jan_2025.pdf',
    },
  ]);

  const [filteredSalaryData, setFilteredSalaryData] = useState(salaryData);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    dateRange: { from: null, to: null },
  });

  const onApplyFilters = (appliedFilters) => {
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

    const filtered = salaryData.filter((item) => {
      const itemDate = new Date(item.date);
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });

    setFilteredSalaryData(filtered);
    setFilterModalVisible(false);
  };

  const handleDownloadReceipt = (url) => {
    if (!url) {
      Alert.alert('No receipt available');
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Failed to open receipt');
    });
  };


  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: index % 2 === 0 ? '#fff' : '#f8faff' },
      ]}
    >
      <Text style={styles.cardTitle}>{item.displayDate}</Text>

      <View style={styles.cardDetailsRow}>
        <View style={styles.cardDetailBox}>
          <Text style={styles.label}>Working Days</Text>
          <Text style={styles.value}>{item.workingDays}</Text>
        </View>
        <View style={styles.cardDetailBox}>
          <Text style={styles.label}>Present Days</Text>
          <Text style={styles.value}>{item.presentDays}</Text>
        </View>
        <View style={styles.cardDetailBox}>
          <Text style={styles.label}>Absent Days</Text>
          <Text style={styles.value}>{item.absentDays}</Text>
        </View>
        <View style={styles.cardDetailBox}>
          <Text style={styles.label}>Salary</Text>
          <Text style={styles.value}>{item.creditedSalary}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.ViewReceiptButton}
          onPress={() => handleDownloadReceipt(item.receiptUrl)}
        >
          <Feather name="file-text" size={16} color={Colors.darkOrange} style={{ marginRight: SW(6) }} />
          <Text style={styles.ViewReceiptText}>View Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButtonAlt}
          onPress={() => Alert.alert('Downloading...')}
          activeOpacity={0.7}
        >
          <Feather name="download" size={16} color={Colors.darkBlue} style={{ marginRight: SW(6) }} />
          <Text style={styles.downloadTextAlt}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Salary History" />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: SW(16) }}>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: SH(10) }}>
        <DummyPieChart salaryData={filteredSalaryData} />
        </View>

        {filteredSalaryData.length > 0 ? (
          <FlatList
            data={filteredSalaryData}
            keyExtractor={(item, index) => item.date + index}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View style={{ alignItems: 'center', marginTop: SH(50) }}>
            <Text style={{ fontSize: SF(16), color: Colors.darkGray }}>
              No records found for selected filter
            </Text>
          </View>
        )}

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          options={[]}
          selectedFilters={localFilters}
          onApply={onApplyFilters}
          showDateFilter={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SalaryScreen;