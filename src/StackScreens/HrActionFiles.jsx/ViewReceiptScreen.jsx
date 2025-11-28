import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../Components/AppHeader";
import { SF, SH, SW } from "../../utils/Dimensions";
import Colors from "../../utils/Colors";
import { containerStyle } from "../../Styles/ScreenContainer";
import { useSelector } from "react-redux";

const ColumnItem = ({ label, value, bold }) => (
    <View style={{ marginBottom: SH(8) }}>
        <Text
            style={{
                fontSize: SF(11.5),
                fontFamily: "Inter",
                color: "#6B7B8C",
            }}
        >
            {label}
        </Text>

        <Text
            style={{
                fontSize: SF(14),
                fontFamily: bold ? "Inter-Bold" : "Inter",
                color: Colors.darkBlue,
                marginTop: SH(1),
            }}
        >
            {value || "-"}
        </Text>
    </View>
);

const RowItem = ({ label, value, bold }) => (
    <View
        style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: SH(4),
        }}
    >
        <Text
            style={{
                fontSize: SF(13),
                fontFamily: bold ? "Inter-Bold" : "Inter",
                color: Colors.darkBlue,
            }}
        >
            {label}
        </Text>

        <Text
            style={{
                fontSize: SF(13),
                fontFamily: bold ? "Inter-Bold" : "Inter",
                color: Colors.darkBlue,
            }}
        >
            {value?.toLocaleString() || "0"}
        </Text>
    </View>
);
const SectionCard = ({ title, children, bg }) => (
    <View
        style={{
            backgroundColor: bg || "#FFF",
            borderRadius: 10,
            paddingHorizontal: SW(14),
            paddingVertical: SH(5),
            marginBottom: SH(5),
            width: "100%",
            alignSelf: "center",
            borderWidth: 1,
            borderColor: "#DFE6EE",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 0.5,
        }}
    >
        {title && (
            <Text
                style={{
                    fontSize: SF(14),
                    fontFamily: "Inter-Bold",
                    color: Colors.darkBlue,
                    marginBottom: SH(5),
                }}
            >
                {title}
            </Text>
        )}
        {children}
    </View>
);


const ViewReceiptScreen = ({ route, navigation }) => {
    const { salaryItem } = route.params;
    const { departmentsList, designationsList } = useSelector(state => state.salary);
    const departmentTitle =
        departmentsList?.[0]?.department?.title || "-";
    const designationName =
        designationsList?.[0]?.name || "-";

    const companyName =
        salaryItem?.company?.companyName || "Company";

    const monthName = new Date(salaryItem?.periodStart).toLocaleDateString(
        "en-GB",
        { month: "long", year: "numeric" }
    );

    return (
        <SafeAreaView style={containerStyle.container}>
            <AppHeader navigation={navigation} title="Salary Summary" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 0,
                    paddingBottom: SH(40),
                }}
            >
                <SectionCard bg="#EAF1FF">
                    <Text
                        style={{
                            fontSize: SF(18),
                            fontFamily: "Inter-Bold",
                            textAlign: "center",
                            color: Colors.darkBlue,
                        }}
                    >
                        {companyName}
                    </Text>

                    <Text
                        style={{
                            fontSize: SF(14),
                            fontFamily: "Inter-Medium",
                            textAlign: "center",
                            color: "#495A71",
                        }}
                    >
                        Salary Slip – {monthName}
                    </Text>
                </SectionCard>
                <SectionCard title="Employee & Bank Details">
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ width: "48%" }}>
                            <ColumnItem
                                label="Employee Name"
                                value={`${salaryItem?.user?.firstName} ${salaryItem?.user?.lastName}`}
                            />
                            <ColumnItem label="Employee ID" value={salaryItem?.user?.empId} />
                            <ColumnItem
                                label="Department"
                                value={
                                    departmentTitle
                                }
                            />


                            <ColumnItem
                                label="Designation"
                                value={designationName}

                            />


                        </View>
                        <View style={{ width: "48%" }}>
                            <ColumnItem label="Bank Name" value={salaryItem?.user?.bankName} />
                            <ColumnItem label="Account No." value={salaryItem?.user?.accountNo} />
                            <ColumnItem label="IFSC Code" value={salaryItem?.user?.ifscCode} />
                        </View>

                    </View>
                </SectionCard>
                <SectionCard title="Earnings">
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: SH(6),
                        }}
                    >
                        <ColumnItem label="Present" value={salaryItem?.presentDays} />
                        <ColumnItem label="Absent" value={salaryItem?.absentDays} />
                        <ColumnItem label="Working" value={salaryItem?.totalWorkDays} />

                    </View>

                    <RowItem label="Base Salary (CTC)" value={salaryItem?.user?.salary?.toLocaleString()} />
                    <RowItem label="Gross Salary" value={salaryItem?.grossSalary} />
                    <RowItem label="Annual Salary" value={salaryItem?.annualSalary} />
                </SectionCard>
                <SectionCard title="Deductions">
                    {salaryItem?.deductions?.map((d, idx) => (
                        <RowItem key={idx} label={d.name} value={d.amount} />
                    ))}

                    {salaryItem?.extraDeductions?.map((ed, idx) => (
                        <RowItem key={idx} label={ed.name} value={ed.amount} />
                    ))}
                </SectionCard>
                <SectionCard>
                    <Text
                        style={{
                            fontFamily: "Inter-Bold",
                            fontSize: SF(14),
                            color: Colors.darkBlue,
                        }}
                    >
                        Net Salary (Take Home)
                    </Text>

                    <Text
                        style={{
                            fontFamily: "Inter-Bold",
                            fontSize: SF(14),
                            color: Colors.darkBlue,
                        }}
                    >
                        {salaryItem?.netSalary?.toLocaleString()}
                    </Text>
                </SectionCard>
                <Text
                    style={{
                        textAlign: "center",
                        marginTop: SH(10),
                        fontFamily: "Inter",
                        fontSize: SF(12),
                        color: "#6B7B8C",
                    }}
                >
                    Generated automatically on {new Date().toLocaleDateString()}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewReceiptScreen;
