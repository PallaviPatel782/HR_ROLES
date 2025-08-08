import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SH, SW, SF } from '../../utils/Dimensions';
import Colors from '../../utils/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FilterModal from '../../Components/FilterModal';
import AppHeader from '../../Components/AppHeader';
import { containerStyle } from '../../Styles/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyAnnouncements = [
  {
    id: '1',
    title: 'HR Policy Update',
    description: 'New leave policy effective from 1st August.',
    date: new Date('2025-07-01'),
  },
  {
    id: '2',
    title: 'Holiday Notice',
    description: 'Office will remain closed on 5th July for festival.',
    date: new Date('2025-06-30'),
  },
  {
    id: '3',
    title: 'New Joiners',
    description: "Let's welcome our new team members this Monday!",
    date: new Date('2025-06-28'),
  },
];

const AnnouncementScreen = () => {
  const [announcements] = useState(dummyAnnouncements);
  const [filteredData, setFilteredData] = useState(dummyAnnouncements);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: {},
    dateRange: { from: null, to: null },
  });

  const applyFilters = (filters) => {
    const { dateRange } = filters;
    let data = announcements;

    if (dateRange.from && dateRange.to) {
      data = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    setFilters(filters);
    setFilteredData(data);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{item.date.toDateString()}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
   <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader title={'Announcements'} />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={{marginHorizontal:-SW(10)}}>
            {announcements.length > 0 && (
              <View style={styles.banner}>
                <MaterialIcons name="campaign" size={24} color={Colors.light} />
                <View style={{ marginLeft: SW(10) }}>
                  <Text style={styles.bannerTitle}>
                    {announcements[0].title}
                  </Text>
                  <Text style={styles.bannerDescription}>
                    {announcements[0].description}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.headerRow}>
              <Text style={styles.heading}>HR Announcements</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(true)}
              >
                <MaterialIcons
                  name="filter-list"
                  size={20}
                  color={Colors.darkBlue}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: SW(16), paddingBottom: SH(20) }}
      />
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        options={[]} 
        selectedFilters={filters}
        onApply={applyFilters}
        showDateFilter={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  banner: {
    backgroundColor: Colors.gradientBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SH(16),
    paddingVertical: SH(16),
    // marginHorizontal: SW(5),
    marginVertical: SH(5),
    borderRadius: 12,
    elevation: 2,
  },
  bannerTitle: {
    fontSize: SF(16),
    fontFamily: 'Inter-Bold',
    color: Colors.light,
  },
  bannerDescription: {
    fontSize: SF(12),
    color: Colors.light,
    marginTop: SH(4),
  },
  heading: {
    fontSize: SF(15),
    fontFamily: 'Inter-Medium',
    color: Colors.darkBlue,
    marginBottom: SH(10),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: SW(16),
    marginVertical: SH(10),
  },
  card: {
    backgroundColor: Colors.light,
    paddingHorizontal: SH(14),
    paddingVertical: SH(14),
    borderRadius: 10,
    marginBottom: SH(10),
    elevation: 1,
    marginHorizontal:-SW(10)
  },
  cardTitle: {
    fontSize: SF(16),
    fontFamily: 'Inter-Medium',
    color: Colors.darkBlue,
  },
  cardDate: {
    fontSize: SF(12),
    fontFamily: 'Inter-Medium',
    color: Colors.dark,
    marginVertical: SH(4),
  },
  cardDescription: {
    fontSize: SF(13),
    color: Colors.darkGray,
    fontFamily: 'Inter-Regular',
  },
});

export default AnnouncementScreen;
