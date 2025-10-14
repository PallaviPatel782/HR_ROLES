import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../utils/Colors';
import { SH, SW, SF } from '../utils/Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GradientButton from '../Components/GradientButton';
import { Calendar } from "react-native-calendars";

const FilterModal = ({ visible, onClose, options, selectedFilters, onApply, showDateFilter = true }) => {
  const [localFilters, setLocalFilters] = useState({
    status: selectedFilters.status || {},
    dateRange: selectedFilters.dateRange || { from: null, to: null },
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [selecting, setSelecting] = useState('from'); // 'from' or 'to'

  useEffect(() => {
    setLocalFilters({
      status: selectedFilters.status || {},
      dateRange: selectedFilters.dateRange || { from: null, to: null },
    });
  }, [selectedFilters, visible]);

  const toggleStatusFilter = (key) => {
    setLocalFilters(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [key]: !prev.status[key],
      }
    }));
  };

  const onSelectDate = (day) => {
    const selected = new Date(day.dateString);
    setLocalFilters(prev => {
      let newRange = { ...prev.dateRange };

      if (selecting === 'from') {
        newRange.from = selected;
        if (newRange.to && newRange.to < selected) newRange.to = null; // reset if invalid
      } else {
        newRange.to = selected;
      }

      return { ...prev, dateRange: newRange };
    });

    setShowCalendar(false);
  };

  const getMarkedDates = () => {
    const { from, to } = localFilters.dateRange;
    let marked = {};

    if (from) {
      const fromStr = from.toISOString().split('T')[0];
      marked[fromStr] = { startingDay: true, color: Colors.gradientBlue, textColor: 'white' };
    }
    if (to) {
      const toStr = to.toISOString().split('T')[0];
      marked[toStr] = { endingDay: true, color: Colors.gradientBlue, textColor: 'white' };
    }
    if (from && to) {
      let current = new Date(from);
      while (current < to) {
        current.setDate(current.getDate() + 1);
        const dateStr = current.toISOString().split('T')[0];
        if (dateStr !== to.toISOString().split('T')[0])
          marked[dateStr] = { color: '#cde3ff', textColor: Colors.dark };
      }
    }

    return marked;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1 }} />

        {/* Main Filter Modal */}
        <View style={{
          backgroundColor: Colors.light,
          paddingHorizontal: SW(20),
          paddingVertical: SH(20),
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '85%',
        }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SH(10) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="filter" size={20} color={Colors.darkBlue} />
              <Text style={{
                fontSize: SF(15),
                fontFamily: 'Inter-Medium',
                color: Colors.darkBlue,
                marginLeft: SW(8),
              }}>
                Filter Options
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.gradientBlue} />
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.length > 0 && (
              <>
                <Text style={{
                  fontSize: SF(16),
                  fontFamily: 'Inter-Medium',
                  color: Colors.dark,
                  marginVertical: SH(10),
                }}>
                  Status
                </Text>

                {options.map(option => (
                  <View key={option} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <CheckBox
                      value={!!localFilters.status[option]}
                      onValueChange={() => toggleStatusFilter(option)}
                      tintColors={{ true: Colors.gradientBlue, false: Colors.darkGray }}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 15, color: Colors.dark }}>{option}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Date Filter */}
            {showDateFilter && (
              <>
                <Text style={{
                  fontSize: SF(16),
                  fontFamily: 'Inter-Medium',
                  color: Colors.dark,
                  marginTop: SH(10),
                  marginBottom: SH(6),
                }}>
                  Date Range
                </Text>

                <TouchableOpacity
                  onPress={() => { setShowCalendar(true); setSelecting('from'); }}
                  style={{
                    backgroundColor: Colors.background,
                    paddingHorizontal: SW(12),
                    paddingVertical: SH(12),
                    borderRadius: 8,
                    marginBottom: SH(10),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <MaterialIcons name="calendar-today" size={20} color={Colors.darkBlue} />
                  <Text style={{ marginLeft: 8, color: Colors.darkBlue }}>
                    From: {localFilters.dateRange.from ? localFilters.dateRange.from.toDateString() : 'Select date'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => { setShowCalendar(true); setSelecting('to'); }}
                  style={{
                    backgroundColor: Colors.background,
                    padding: 12,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <MaterialIcons name="event" size={20} color={Colors.darkBlue} />
                  <Text style={{ marginLeft: SW(8), color: Colors.darkBlue }}>
                    To: {localFilters.dateRange.to ? localFilters.dateRange.to.toDateString() : 'Select date'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Apply Button */}
            <GradientButton
              title={'Apply Filters'}
              onPress={() => {
                onApply(localFilters);
                onClose();
              }}
              style={{ marginTop: SH(20) }}
            />
          </ScrollView>
        </View>

        {/* Calendar Popup Modal */}
        <Modal
          visible={showCalendar}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)} // handles Android back
        >
          <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <TouchableWithoutFeedback>
                <View style={{
                  backgroundColor: Colors.light,
                  width: '90%',
                  borderRadius: 16,
                  paddingVertical: SH(15),
                  paddingHorizontal: SW(10),
                }}>
                  <Text style={{
                    textAlign: 'center',
                    color: Colors.darkBlue,
                    fontSize: SF(16),
                    marginBottom: SH(8),
                  }}>
                    Select {selecting === 'from' ? 'Start' : 'End'} Date
                  </Text>

                  <Calendar
                    markingType={'period'}
                    markedDates={getMarkedDates()}
                    onDayPress={onSelectDate}
                    theme={{
                      selectedDayBackgroundColor: Colors.gradientBlue,
                      todayTextColor: Colors.gradientBlue,
                      arrowColor: Colors.gradientBlue,
                    }}
                  />

                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      marginTop: SH(10),
                      backgroundColor: Colors.gradientBlue,
                      paddingHorizontal: SW(20),
                      paddingVertical: SH(8),
                      borderRadius: 8,
                    }}
                    onPress={() => setShowCalendar(false)}
                  >
                    <Text style={{ color: Colors.light, fontWeight: '500' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </View>
    </Modal>
  );
};

export default FilterModal;
