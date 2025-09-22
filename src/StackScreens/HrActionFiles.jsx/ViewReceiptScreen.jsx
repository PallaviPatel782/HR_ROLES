import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { containerStyle } from "../../Styles/ScreenContainer";
import AppHeader from "../../Components/AppHeader";
import Colors from "../../utils/Colors";
import { SF, SH, SW } from "../../utils/Dimensions";

const ViewReceiptScreen = ({ route, navigation }) => {
    const { salaryItem } = route.params;

    useEffect(() => {
        console.log("salaryItem", salaryItem);
    }, []);

    const textStyle = { color: Colors.darkBlue, fontFamily: "Inter" };

    return (
        <SafeAreaView style={containerStyle.container} edges={["top", "bottom"]}>
            <AppHeader navigation={navigation} title="Salary Summary" />

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: SW(10),
                    paddingVertical: SH(10),
                }}
            >
                {/* Company Info */}
                <View
                    style={{
                        backgroundColor: "#f2f2f2",
                        padding: SW(12),
                        borderRadius: 8,
                        marginBottom: SH(12),
                    }}
                >
                    <Text
                        style={[{ fontSize: SF(18), fontFamily: "Inter-Bold" }, textStyle]}
                    >
                        {salaryItem?.company?.companyInfo?.profile?.brandName ||
                            salaryItem?.company?.name ||
                            "Company"}
                    </Text>
                    <Text style={[{ fontSize: SF(14) }, textStyle]}>
                        Salary Slip for{" "}
                        {new Date(salaryItem?.periodStart).toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                </View>

                {/* Employee Info */}
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: SW(12),
                        borderRadius: 8,
                        marginBottom: SH(12),
                    }}
                >
                    <Text
                        style={[
                            { fontSize: SF(16), fontFamily: "600", marginBottom: SH(6) },
                            textStyle,
                        ]}
                    >
                        Employee Details
                    </Text>
                    <Text style={[{ fontSize: SF(14) }, textStyle]}>
                        Name: {salaryItem?.user?.firstName} {salaryItem?.user?.lastName}
                    </Text>
                    <Text style={[{ fontSize: SF(14) }, textStyle]}>
                        Employee ID: {salaryItem?.user?.empId || "-"}
                    </Text>

                    <Text style={[{ fontSize: SF(14) }, textStyle]}>
                        Base Salary (CTC): ₹{salaryItem?.user?.salary?.toLocaleString()}
                    </Text>
                </View>

                {/* Earnings */}
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: SW(12),
                        borderRadius: 8,
                        marginBottom: SH(12),
                    }}
                >
                    <Text
                        style={[
                            { fontSize: SF(16), fontFamily: "600", marginBottom: SH(6) },
                            textStyle,
                        ]}
                    >
                        Earnings
                    </Text>
                    {salaryItem?.splits?.map((e, idx) => (
                        <View
                            key={idx}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: SH(4),
                            }}
                        >
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>{e.name}</Text>
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>
                                ₹{e.amount.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                    <View
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: "#ccc",
                            marginTop: SH(6),
                            paddingTop: SH(4),
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={[{ fontFamily: "Inter-Bold", fontSize: SF(14) }, textStyle]}
                        >
                            Gross Salary (Present Days)
                        </Text>
                        <Text
                            style={[{ fontFamily: "Inter-Bold", fontSize: SF(14) }, textStyle]}
                        >
                            ₹{salaryItem?.grossSalary?.toLocaleString()}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: SH(4),
                        }}
                    >
                        <Text
                            style={[{ fontFamily: "Inter-Bold", fontSize: SF(14) }, textStyle]}
                        >
                            Annual Salary
                        </Text>
                        <Text
                            style={[{ fontFamily: "Inter-Bold", fontSize: SF(14) }, textStyle]}
                        >
                            ₹{salaryItem?.annualSalary?.toLocaleString()}
                        </Text>
                    </View>
                </View>

                {/* Deductions */}
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: SW(12),
                        borderRadius: 8,
                        marginBottom: SH(12),
                    }}
                >
                    <Text
                        style={[
                            { fontSize: SF(16), fontFamily: "600", marginBottom: SH(6) },
                            textStyle,
                        ]}
                    >
                        Deductions
                    </Text>
                    {salaryItem?.deductions?.map((d, idx) => (
                        <View
                            key={idx}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: SH(4),
                            }}
                        >
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>{d.name}</Text>
                            <Text style={[{ fontSize: SF(14) }, textStyle]}>
                                ₹{d.amount.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>

                <View
                    style={{
                        backgroundColor: "#e6f7ff",
                        padding: SW(12),
                        borderRadius: 8,
                        marginBottom: SH(20),
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        style={[{ fontFamily: "Inter-Bold", fontSize: SF(16) }, textStyle]}
                    >
                        Net Salary (Take Home)
                    </Text>
                    <Text
                        style={[{ fontFamily: "Inter-Bold", fontSize: SF(16) }, textStyle]}
                    >
                        ₹{salaryItem?.netSalary?.toLocaleString()}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewReceiptScreen;
