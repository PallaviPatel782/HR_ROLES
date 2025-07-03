import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import Colors from '../../utils/Colors';
import styles from '../../Styles/LeaveHistoryStyle';
import RightIcon from 'react-native-vector-icons/AntDesign';
import { containerStyle } from '../../Styles/ScreenContainer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FilterModal from '../../Components/FilterModal';
import moment from 'moment';

const allLeaves = [
  {
    type: 'Half Day Application',
    date: 'Wed, 16 Apr 2025',
    status: 'Pending',
    color: Colors.darkOrange,
    bg: Colors.orange,
    category: 'Casual',
  },
  {
    type: 'Full Day Application',
    date: 'Mon, 16 May 2025',
    status: 'Approved',
    color: '#3BA55D',
    bg: '#D1F1DD',
    category: 'Sick',
  },
  {
    type: '3 Days Application',
    date: 'Mon, 22 Nov 2021 - Fri, 25 Nov 2021',
    status: 'Declined',
    color: '#E33E3E',
    bg: '#FCE9E9',
    category: 'Earned',
  },
  {
    type: 'Annual Leave',
    date: 'Tue, 01 Jan 2022 - Fri, 04 Jan 2022',
    status: 'Approved',
    color: '#3BA55D',
    bg: '#D1F1DD',
    category: 'Earned',
  },
  {
    type: 'Medical Leave',
    date: 'Thu, 15 Jul 2021',
    status: 'Approved',
    color: '#3BA55D',
    bg: '#D1F1DD',
    category: 'Sick',
  },
];


const getleavescreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const filterOptions = ['All', 'Casual', 'Sick', 'Earned', 'Maternity'];

  const [localFilters, setLocalFilters] = useState({
    status: { All: true, Casual: true, Sick: true, Earned: true, Maternity: true },
    dateRange: { from: null, to: null },
  });

const filteredLeaves = allLeaves.filter((item) => {
  const statusMatch =
    selectedStatus === 'All' || item.status === selectedStatus;

  const categoryMatch =
    localFilters.status[item.category] || localFilters.status['All'];

  let dateMatch = true;
  const from = localFilters.dateRange.from;
  const to = localFilters.dateRange.to;

  if (from && to) {
    let itemFromDate, itemToDate;

    if (item.date.includes(' - ')) {
      const [start, end] = item.date.split(' - ');
      itemFromDate = moment(start.trim(), 'ddd, DD MMM YYYY').startOf('day');
      itemToDate = moment(end.trim(), 'ddd, DD MMM YYYY').endOf('day');
    } else {
      itemFromDate = moment(item.date.trim(), 'ddd, DD MMM YYYY').startOf('day');
      itemToDate = itemFromDate.clone().endOf('day');
    }

    const fromDate = moment(from).startOf('day');
    const toDate = moment(to).endOf('day');

    // Check overlap of date range
    console.log("dateMatch",dateMatch);
    dateMatch = itemFromDate.isSameOrBefore(toDate) && itemToDate.isSameOrAfter(fromDate);
  }

  return statusMatch && categoryMatch && dateMatch;
});


const onApplyFilters = (appliedFilters) => {
  // console.log('Applied Filters:', appliedFilters);
  // console.log('From raw:', appliedFilters.dateRange.from);
  // console.log('To raw:', appliedFilters.dateRange.to);
  // console.log('Is valid from date:', moment(appliedFilters.dateRange.from).isValid());
  // console.log('Is valid to date:', moment(appliedFilters.dateRange.to).isValid());

  setLocalFilters({
    status: appliedFilters.status,
    dateRange: {
      from: moment(appliedFilters.dateRange.from).isValid()
        ? moment(appliedFilters.dateRange.from).toDate()
        : null,
      to: moment(appliedFilters.dateRange.to).isValid()
        ? moment(appliedFilters.dateRange.to).toDate()
        : null,
    },
  });
};

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="Leaves" />
      <View>
        <View style={styles.tabContainer}>
          {['All', 'Approved', 'Pending', 'Declined'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.tabButton,
                selectedStatus === status ? styles.activeTab : styles.inactiveTab,
                status === 'All' ? styles.leftRadius : status === 'Declined' ? styles.rightRadius : null,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={selectedStatus === status ? styles.activeTabText : styles.inactiveTabText}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ alignSelf: "flex-end" }}>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ marginLeft: 10, paddingHorizontal: 5 }}>
            <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.dataContainer} showsVerticalScrollIndicator={false}>
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave, index) => (
            <LeaveCard key={index} {...leave} />
          ))
        ) : (
          <Text style={styles.simpleText}>No Leaves Found</Text>
        )}
      </ScrollView>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        options={filterOptions}
        selectedFilters={localFilters}
        onApply={onApplyFilters}
      />
    </SafeAreaView>
  );
};

const LeaveCard = ({ type, date, status, color, bg, category }) => (
  <View style={styles.card}>
    <View style={styles.cardTop}>
      <Text style={styles.cardTitle}>{type}</Text>
      <Text style={[styles.cardStatus, { color, backgroundColor: bg }]}>{status}</Text>
    </View>
    <Text style={styles.cardDate}>{date}</Text>
    <View style={styles.cardBottom}>
      <Text style={styles.cardCategory}>{category}</Text>
      <TouchableOpacity style={styles.rightBtn}>
        <RightIcon name="right" size={16} color={Colors.light} />
      </TouchableOpacity>
    </View>
  </View>
);

export default getleavescreen;