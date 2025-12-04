import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import Colors from '../../utils/Colors';
import styles from '../../Styles/LeaveHistoryStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FilterModal from '../../Components/FilterModal';
import moment from 'moment';
import { SH } from '../../utils/Dimensions';
import { GET_LEAVE_DATA } from '../../utils/BASE_URL';
import api from '../../utils/api';
import { containerStyle } from '../../Styles/ScreenContainer';

const getleavescreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState(['All']);
  const [localFilters, setLocalFilters] = useState({
    status: {},
    dateRange: { from: null, to: null },
  });
  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const response = await api.get(GET_LEAVE_DATA);
      if (response?.data?.success) {
        const data = response.data.data || [];
        console.log("data", data);
        setLeaveData(data);
        const leaveNames = Array.from(new Set(data.map(l => l.leaveName)));
        setFilterOptions(['All', ...leaveNames]);
        const statusObj = Object.fromEntries(['All', ...leaveNames].map(f => [f, true]));
        setLocalFilters({ status: statusObj, dateRange: { from: null, to: null } });
      }
    } catch (error) {
      console.log("Error fetching leaves:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const filteredLeaves = leaveData.filter((item) => {
    const statusMap = {
      approved: 'Approved',
      pending: 'Pending',
      rejected: 'Declined',
    };
    const mappedStatus = statusMap[item.status?.toLowerCase()] || 'Pending';

    const statusMatch = selectedStatus === 'All' || mappedStatus === selectedStatus;
    const categoryMatch = localFilters.status[item.leaveName] || localFilters.status['All'];

    let dateMatch = true;
    const from = localFilters.dateRange.from;
    const to = localFilters.dateRange.to;

    if (from && to) {
      const itemFromDate = moment(item.startDate).startOf('day');
      const itemToDate = moment(item.endDate).endOf('day');

      const fromDate = moment(from).startOf('day');
      const toDate = moment(to).endOf('day');

      dateMatch = itemFromDate.isSameOrBefore(toDate) && itemToDate.isSameOrAfter(fromDate);
    }

    return statusMatch && categoryMatch && dateMatch;
  });

  const onApplyFilters = (appliedFilters) => {
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppHeader navigation={navigation} title="Leaves" />
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SH(10) }}>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ marginLeft: 10 }}>
            <MaterialIcons name="filter-list" size={26} color={Colors.gradientBlue} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateLeaveScreen')}
            style={styles.leaveButton}
          >
            <MaterialIcons name="add" size={20} color={Colors.light} />
          </TouchableOpacity>
        </View>
      </View>

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
      <ScrollView style={styles.dataContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.gradientBlue} style={{ marginTop: 20 }} />
        ) : filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => <LeaveCard key={leave._id} leave={leave} />)
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

const LeaveCard = ({ leave }) => {
  const statusMap = {
    approved: { text: "Approved", color: '#3BA55D', bg: '#D1F1DD' },
    pending: { text: "Pending", color: Colors.darkOrange, bg: Colors.orange },
    rejected: { text: "Declined", color: '#E33E3E', bg: '#FCE9E9' },
  };

  const statusInfo = statusMap[leave.status?.toLowerCase()] || statusMap['pending'];
  const leaveDates = leave.leaveDates || [];

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>{leave.leaveName}</Text>
        <Text style={[styles.cardStatus, { color: statusInfo.color, backgroundColor: statusInfo.bg }]}>
          {statusInfo.text}
        </Text>
      </View>

      {leaveDates.map((day) => (
        <Text key={day._id} style={styles.cardDate}>
          {moment(day.date).format("ddd, DD MMM YYYY")} - {day.duration === 'full' ? 'Full Day' : 'Half Day'}
        </Text>
      ))}

      <View style={styles.cardBottom}>
        <Text style={styles.cardCategory}>
          {leave.isPaid ? "Paid Leave" : "Unpaid Leave"}
        </Text>
      </View>
    </View>
  );
};

export default getleavescreen;
