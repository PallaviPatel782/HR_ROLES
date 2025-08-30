import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback, KeyboardAvoidingViewBase, Platform, KeyboardAvoidingView } from "react-native";
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

const leaveOptions = [
    { label: "Sick Leave", value: "sick" },
    { label: "Casual Leave", value: "casual" },
    { label: "Earned Leave", value: "earned" },
    { label: "Unpaid Leave", value: "unpaid" },
];

const CreateLeaveScreen = ({ navigation }) => {
    const [leaveType, setLeaveType] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [duration, setDuration] = useState("Full Day");
    const [reason, setReason] = useState("");

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

        // Optional: Check if toDate is after fromDate
        if (new Date(toDate) < new Date(fromDate)) {
            showMessage({ message: 'To date cannot be before From date', type: 'warning' });
            return false;
        }

        if (!duration) {
            showMessage({ message: 'Please select leave duration', type: 'warning' });
            return false;
        }

        if (!reason.trim()) {
            showMessage({ message: 'Please enter reason for leave', type: 'warning' });
            return false;
        }

        return true;
    };


    const handleSubmit = () => {
        if (validateLeaveForm()) {
            showMessage({ message: 'Leave request submitted!', type: 'success' });
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        }
    };

    return (
        < SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>

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

                    <Text style={styles.label}>Duration</Text>
                    <View style={styles.durationRow}>
                        {["Full Day", "Half Day", "None"].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.durationBtn,
                                    duration === item && styles.durationBtnActive,
                                ]}
                                onPress={() => setDuration(item)}
                            >
                                <Text
                                    style={[
                                        styles.durationText,
                                        duration === item && styles.durationTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

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
                                        onDayPress={(day) => {
                                            setFromDate(day.dateString);
                                            setShowFromCalendar(false);
                                        }}
                                        markedDates={{
                                            [fromDate]: { selected: true, selectedColor: "#2c3e50" },
                                        }}
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
                                        onDayPress={(day) => {
                                            setToDate(day.dateString);
                                            setShowToCalendar(false);
                                        }}
                                        markedDates={{
                                            [toDate]: { selected: true, selectedColor: "#2c3e50" },
                                        }}
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
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: SW(16)
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SH(20)
    },
    headerTitle: {
        fontSize: SF(18),
        fontFamily: "Inter-Bold",
        marginLeft: SW(10)
    },

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
        marginTop: SH(10)
    },
    durationBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: SW(12),
        paddingVertical: SH(7),
        borderRadius: SW(8),
        alignItems: "center",
        marginRight: SW(10),
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
