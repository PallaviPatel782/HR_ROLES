import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../utils/Colors';
import { SH, SW, SF } from '../utils/Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GradientButton from '../Components/GradientButton';

const FilterModal = ({ visible, onClose, options, selectedFilters, onApply, showDateFilter = true }) => {
    const [localFilters, setLocalFilters] = useState({
        status: selectedFilters.status || {},
        dateRange: selectedFilters.dateRange || { from: null, to: null },
    });

    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

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

    const onDateChange = (event, selectedDate, type) => {
        setShowFromPicker(false);
        setShowToPicker(false);

        if (selectedDate) {
            setLocalFilters(prev => ({
                ...prev,
                dateRange: {
                    ...prev.dateRange,
                    [type]: selectedDate,
                },
            }));
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' }}>
                <TouchableOpacity activeOpacity={1} onPress={onClose} style={{ flex: 1 }} />

                <View style={{
                    backgroundColor: Colors.light,
                    paddingHorizontal: SW(20),
                    paddingVertical: SH(20),
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    maxHeight: '75%',
                }}>
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
                                    <View key={option} style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                    }}>
                                        <CheckBox
                                            value={!!localFilters.status[option]}
                                            onValueChange={() => toggleStatusFilter(option)}
                                            tintColors={{ true: Colors.gradientBlue, false: Colors.darkGray }}
                                        />
                                        <Text style={{ marginLeft: 10, fontSize: 15, color: Colors.dark }}>
                                            {option}
                                        </Text>
                                    </View>
                                ))}
                            </>
                        )}


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
                                    onPress={() => setShowFromPicker(true)}
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
                                    onPress={() => setShowToPicker(true)}
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

                                {showFromPicker && (
    <DateTimePicker
        value={localFilters.dateRange.from || new Date()}
        mode="date"
        display="default"
        onChange={(e, d) => onDateChange(e, d, 'from')}
        // Allow all future dates
        maximumDate={localFilters.dateRange.to || new Date('2100-01-01')}
    />
)}

{showToPicker && (
    <DateTimePicker
        value={localFilters.dateRange.to || new Date()}
        mode="date"
        display="default"
        onChange={(e, d) => onDateChange(e, d, 'to')}
        minimumDate={localFilters.dateRange.from || new Date()}
        maximumDate={new Date('2100-01-01')}
    />
)}

                            </>
                        )}
                        <GradientButton
                            title={' Apply Filters'}
                            onPress={() => {
                                onApply(localFilters);
                                onClose();
                            }}
                            style={{ marginTop: SH(20) }}
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;
