import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import AppHeader from '../../Components/AppHeader';
import Colors from '../../utils/Colors';
import { SF, SH, SW } from '../../utils/Dimensions';
import Feather from 'react-native-vector-icons/Feather';

const ViewReceiptScreen = ({ route, navigation }) => {
    const { salaryItem } = route.params;

    const earnings = [
        { label: 'Working Days', amount: salaryItem.workingDays.toString() },
        { label: 'Present Days', amount: salaryItem.presentDays.toString() },
        { label: 'Absent Days', amount: salaryItem.absentDays.toString() },
        { label: 'Credited Salary', amount: salaryItem.creditedSalary },
    ];

    const deductions = [
        { label: 'PF', amount: '₹1,000' },
        { label: 'Tax', amount: '₹500' },
    ];

    const totalEarnings = earnings.reduce(
        (sum, e) => sum + parseInt(e.amount.replace(/₹|,/g, '') || '0'),
        0
    );
    const totalDeductions = deductions.reduce(
        (sum, d) => sum + parseInt(d.amount.replace(/₹|,/g, '') || '0'),
        0
    );
    const netSalary = totalEarnings - totalDeductions;

    const textStyle = { color: Colors.darkBlue, fontFamily: 'Inter' };

    return (
        <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
            <AppHeader navigation={navigation} title="Salary Slip" />

            <ScrollView contentContainerStyle={{ paddingHorizontal: SW(5), paddingVertical: SH(7) }}>

                <View style={{ backgroundColor: '#f2f2f2', paddingHorizontal: SW(10), borderRadius: 8, marginBottom: SH(12), paddingVertical: SH(10) }}>
                    <Text style={[{ fontSize: SF(18), fontFamily: 'Inter-Bold' }, textStyle]}>ACME Pvt Ltd</Text>
                    <Text style={[{ fontSize: SF(14) }, textStyle]}>Salary Slip for {salaryItem.displayDate}</Text>
                </View>

                <View style={{ backgroundColor: '#fff', padding: SW(12), borderRadius: 8, marginBottom: SH(12) }}>
                    <Text style={[{ fontSize: SF(16), fontFamily: '600', marginBottom: SH(6) }, textStyle]}>Employee Details</Text>
                    <Text style={[{ fontSize: SF(14) }, textStyle]}>Name: John Doe</Text>
                    <Text style={[{ fontSize: SF(14) }, textStyle]}>Employee ID: EMP12345</Text>
                    <Text style={[{ fontSize: SF(14) }, textStyle]}>Department: Finance</Text>
                </View>


                <View style={{ backgroundColor: '#fff', padding: SW(12), borderRadius: 8, marginBottom: SH(12) }}>
                    <Text style={[{ fontSize: SF(16), fontFamily: '600', marginBottom: SH(6) }, textStyle]}>Earnings</Text>
                    {earnings.map((e, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SH(4) }}>
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>{e.label}</Text>
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>{e.amount}</Text>
                        </View>
                    ))}
                    <View style={{ borderTopWidth: 1, borderTopColor: '#ccc', marginTop: SH(6), paddingTop: SH(4), flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[{ fontFamily: 'Inter-Bold', fontSize: SF(14) }, textStyle]}>Total Earnings</Text>
                        <Text style={[{ fontFamily: 'Inter-Bold', fontSize: SF(14) }, textStyle]}>₹{totalEarnings.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: '#fff', padding: SW(12), borderRadius: 8, marginBottom: SH(12) }}>
                    <Text style={[{ fontSize: SF(16), fontFamily: '600', marginBottom: SH(6) }, textStyle]}>Deductions</Text>
                    {deductions.map((d, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SH(4) }}>
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>{d.label}</Text>
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>{d.amount}</Text>
                        </View>
                    ))}
                    <View style={{ borderTopWidth: 1, borderTopColor: '#ccc', marginTop: SH(6), paddingTop: SH(4), flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[{ fontFamily: 'Inter-Bold', fontSize: SF(14) }, textStyle]}>Total Deductions</Text>
                        <Text style={[{ fontFamily: 'Inter-Bold', fontSize: SF(14) }, textStyle]}>₹{totalDeductions.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: '#e6f7ff', padding: SW(12), borderRadius: 8, marginBottom: SH(20), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[{ fontFamily: 'Inter-Bold', fontSize: SF(16) }, textStyle]}>Net Salary</Text>
                    <Text style={[{ fontFamily: 'Inter-Bold', fontSize: SF(16) }, textStyle]}>₹{netSalary.toLocaleString()}</Text>
                </View>

                {/* <TouchableOpacity
          style={{ backgroundColor: Colors.darkOrange, padding: SH(12), borderRadius: 8, alignItems: 'center', marginBottom: SH(20) }}
          onPress={() => {
            // trigger PDF download if needed
          }}
        >
          <Feather name="download" size={16} color="#fff" style={{ marginRight: SW(6) }} />
          <Text style={{ color: '#fff', fontFamily: '600', fontSize: SF(14), fontFamily: 'Inter' }}>Download PDF</Text>
        </TouchableOpacity> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewReceiptScreen;
