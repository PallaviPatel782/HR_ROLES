import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import { Calendar } from "react-native-calendars";
import AppHeader from "../../Components/AppHeader";
import { SH, SW, SF } from "../../utils/Dimensions";
import Colors from "../../utils/Colors";
import { containerStyle } from "../../Styles/ScreenContainer";
import GradientButton from "../../Components/GradientButton";
import { showMessage } from "react-native-flash-message";
import api from "../../utils/api";
import { LEAVE_REQUEST } from "../../utils/BASE_URL";

const leaveOptions = [
    { label: "Sick Leave", value: "sick", isPaid: true },
    { label: "Casual Leave", value: "casual", isPaid: true },
    { label: "Earned Leave", value: "earned", isPaid: true },
    { label: "Unpaid Leave", value: "unpaid", isPaid: false },
];

const getDatesInRange = (start, end) => {
    const dateArray = [];
    let currentDate = new Date(start);
    const lastDate = new Date(end);

    while (currentDate <= lastDate) {
        dateArray.push(new Date(currentDate).toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
};

const CreateLeaveScreen = ({ navigation }) => {
    const [leaveType, setLeaveType] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [reason, setReason] = useState("");
    const [leaveDurations, setLeaveDurations] = useState([]);

    useEffect(() => {
        if (fromDate && toDate) {
            const dates = getDatesInRange(fromDate, toDate);
            setLeaveDurations(dates.map(d => ({ date: d, duration: "full" })));
        }
    }, [fromDate, toDate]);

    const validateLeaveForm = () => {
        if (!leaveType) {
            showMessage({ message: 'Please select leave type', type: 'warning' });
            return false;
        }
        if (!fromDate) {
            showMessage({ message: 'Please select from date', type: 'warning' });
            return false;
        }
        if (!toDate) {
            showMessage({ message: 'Please select to date', type: 'warning' });
            return false;
        }
        if (new Date(toDate) < new Date(fromDate)) {
            showMessage({ message: 'To date cannot be before From date', type: 'warning' });
            return false;
        }
        if (!reason.trim()) {
            showMessage({ message: 'Please enter reason for leave', type: 'warning' });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (validateLeaveForm()) {
            const selectedLeave = leaveOptions.find(item => item.value === leaveType);

            const payload = {
                leaveName: selectedLeave?.label || leaveType,
                isPaid: selectedLeave?.isPaid || false,
                startDate: fromDate,
                endDate: toDate,
                description: reason,
                durations: leaveDurations,
            };

            console.log("Leave Request Payload ===>", JSON.stringify(payload, null, 2));

            try {
                const response = await api.post(LEAVE_REQUEST, payload);
                console.log("Leave Request Response ===>", response.data);
                showMessage({
                    message: response?.data?.message || "Leave request submitted successfully!",
                    type: "success",
                    duration: 3000,
                });
                setTimeout(() => {
                    navigation.goBack();
                }, 3000);
            } catch (error) {
                console.log("Leave request error:", error?.response?.data || error);

                showMessage({
                    message: error?.response?.data?.message || "Failed to submit leave request",
                    type: "danger",
                    duration: 3000,
                });
            }
        }
    };

    return (
        <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <AppHeader navigation={navigation} title="Create Leave" />

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.label}>Leave Type</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={leaveOptions}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select leave type"
                        searchPlaceholder="Search..."
                        value={leaveType}
                        onChange={(item) => setLeaveType(item.value)}
                        renderItem={(item) => (
                            <View style={{ padding: 12 }}>
                                <Text style={{ color: '#333', fontSize: SF(14) }}>{item.label}</Text>
                            </View>
                        )}
                        renderRightIcon={() => <Icon name="chevron-down" size={20} color="#555" />}
                    />

                    <View style={styles.dateRow}>
                        <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowFromCalendar(true)}
                        >
                            <Text style={styles.dateText}>
                                {fromDate ? fromDate : "From date"}
                            </Text>
                            <Icon name="calendar" size={18} color="#555" />
                        </TouchableOpacity>

                        <Text style={{ marginHorizontal: 10, alignSelf: "center" }}>-</Text>

                        <TouchableOpacity
                            style={styles.datePicker}
                            onPress={() => setShowToCalendar(true)}
                        >
                            <Text style={styles.dateText}>
                                {toDate ? toDate : "To date"}
                            </Text>
                            <Icon name="calendar" size={18} color="#555" />
                        </TouchableOpacity>
                    </View>

                    {leaveDurations.length > 0 && (
                        <>
                            <Text style={styles.label}>Select duration per day</Text>
                            {leaveDurations.map((item, index) => (
                                <View key={index} style={styles.durationRow}>
                                    <Text style={{ flex: 1, fontSize: SF(14), color: "#333" }}>
                                        {item.date}
                                    </Text>

                                    {["Full Day", "Half Day"].map(opt => {
                                        const isActive = item.duration === (opt === "Full Day" ? "full" : "half");
                                        return (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[
                                                    styles.durationBtn,
                                                    isActive && styles.durationBtnActive,
                                                ]}
                                                onPress={() => {
                                                    const updated = [...leaveDurations];
                                                    updated[index].duration =
                                                        opt === "Full Day" ? "full" : "half";
                                                    setLeaveDurations(updated);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.durationText,
                                                        { color: isActive ? "#fff" : "#000" }
                                                    ]}
                                                >
                                                    {opt}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ))}
                        </>
                    )}

                    <Text style={styles.label}>Reason for leave</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter reason"
                        placeholderTextColor="#888"
                        multiline
                        value={reason}
                        onChangeText={setReason}
                    />

                    <View style={{ marginVertical: SH(50) }}>
                        <GradientButton title={'SUBMIT'} onPress={() => handleSubmit()} />
                    </View>
                </ScrollView>

                <Modal
                    visible={showFromCalendar}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowFromCalendar(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowFromCalendar(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>
                                <View style={styles.calendarBox}>
                                    <Calendar
                                        current={new Date().toISOString().split("T")[0]}
                                        onDayPress={(day) => {
                                            setFromDate(day.dateString);
                                            setShowFromCalendar(false);
                                        }}
                                        markedDates={{
                                            [fromDate || new Date().toISOString().split("T")[0]]: {
                                                selected: true,
                                                selectedColor: "#2c3e50",
                                            },
                                        }}
                                        minDate={new Date().toISOString().split("T")[0]}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <Modal
                    visible={showToCalendar}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowToCalendar(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowToCalendar(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>
                                <View style={styles.calendarBox}>
                                    <Calendar
                                        current={new Date().toISOString().split("T")[0]}
                                        onDayPress={(day) => {
                                            setToDate(day.dateString);
                                            setShowToCalendar(false);
                                        }}
                                        markedDates={{
                                            [toDate || new Date().toISOString().split("T")[0]]: {
                                                selected: true,
                                                selectedColor: "#2c3e50",
                                            },
                                        }}
                                        minDate={fromDate || new Date().toISOString().split("T")[0]}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateLeaveScreen;

const styles = StyleSheet.create({
    label: {
        fontSize: SF(14),
        fontFamily: "Inter-Medium",
        marginBottom: SH(6),
        marginTop: SH(14),
        color: Colors.dark
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: SW(8),
        paddingHorizontal: SW(12),
        height: SH(40),
        color: Colors.dark
    },
    placeholderStyle: { fontSize: SF(14), color: "#888" },
    selectedTextStyle: { fontSize: SF(14), color: "#333" },
    iconStyle: { width: SW(20), height: SH(20) },
    inputSearchStyle: { height: SH(40), fontSize: SF(14) },
    dateRow: {
        flexDirection: "row",
        marginTop: SH(10),
        alignItems: "center"
    },
    datePicker: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: SW(12),
        borderRadius: SW(8),
        paddingVertical: SH(10)
    },
    dateText: { fontSize: SF(14), color: "#333" },
    durationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: SH(10)
    },
    durationBtn: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: SW(12),
        paddingVertical: SH(7),
        borderRadius: SW(8),
        alignItems: "center",
        marginLeft: SW(10),
    },
    durationBtnActive: {
        backgroundColor: Colors.gradientBlue,
        borderColor: Colors.light
    },
    durationText: { fontSize: SF(14), color: "#333" },
    durationTextActive: { color: "#fff" },
    textArea: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: SW(8),
        padding: SW(12),
        height: SH(100),
        textAlignVertical: "top",
        marginTop: SH(8),
        color: Colors.dark
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: SW(16),
    },
    calendarBox: {
        backgroundColor: "#fff",
        borderRadius: SW(12),
        padding: SW(16),
    },
});
