import { StyleSheet } from "react-native";
import { SH, SW, SF } from "../utils/Dimensions";
import Colors from "../utils/Colors";

const styles = StyleSheet.create({
    leaveButton:{
      backgroundColor:Colors.gradientBlue,
      borderRadius:5,
      marginHorizontal:SW(5)
    },
    tabContainer: {
        flexDirection: 'row',
        marginVertical: SH(10),
        elevation: 4,
        borderRadius: 8,
        backgroundColor: Colors.darkBlue,
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        paddingVertical: SH(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: Colors.gradientBlue,
    },
    inactiveTab: {
        backgroundColor: Colors.light,
    },
    activeTabText: {
        color: Colors.light,
        fontFamily: "Inter-Medium",
        fontSize: SF(11),
    },
    inactiveTabText: {
        color: Colors.darkBlue,
        fontFamily: "Inter-Medium",
        fontSize: SF(11),
    },
    leftRadius: {
        borderTopLeftRadius: SW(8),
        borderBottomLeftRadius: SW(8),
    },
    rightRadius: {
        borderTopRightRadius: SH(8),
        borderBottomRightRadius: SH(8),
    },
    dataContainer: {
        paddingHorizontal: SW(5),
        marginTop: SH(15),
    },
    sectionTitle: {
        fontFamily: "Inter-Medium",
        fontSize: SF(16),
        marginBottom: SH(10),
        color: Colors.dark,
    },
    card: {
        backgroundColor: Colors.light,
        borderRadius: 10,
        paddingVertical: SH(10),
        paddingHorizontal: SW(10),
        marginBottom: SH(5),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontFamily: "Inter-Medium",
        color: Colors.dark,
        fontSize: SF(13),
    },
    cardStatus: {
        fontFamily: "Inter-Bold",
        borderRadius: 12,
        paddingHorizontal: SW(10),
        paddingVertical: SH(2),
        fontSize: SF(11),
        overflow: 'hidden',
    },
    cardDate: {
        marginVertical: SH(6),
        color: Colors.darkBlue,
        fontFamily: "Inter-Medium",
        fontSize: SF(12),
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardCategory: {
        fontFamily: "Inter-Bold",
        color: Colors.darkOrange,
        fontSize: SF(12),
    },
    rightBtn: {
        backgroundColor: Colors.gradientBlue,
        paddingHorizontal: SW(6),
        paddingVertical: SH(6),
        borderRadius: 6,
    },
    simpleText: {
        textAlign: 'center',
        marginTop: SH(10),
        fontSize: SF(15),
        color: Colors.darkGray,
        fontFamily: "Inter-Medium"
    },
});

export default styles;