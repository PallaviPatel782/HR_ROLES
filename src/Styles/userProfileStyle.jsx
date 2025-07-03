import { StyleSheet, Dimensions } from "react-native";
import { SH, SW, SF } from "../utils/Dimensions";
import Colors from "../utils/Colors";
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: 'white'
    },
    subView1: {
        marginTop: SH(10),
        marginHorizontal: SW(20),
    },
    subView2: {
        alignSelf: 'center',
        width: '87%',
        marginTop: SH(10)
    },
    topFlexView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: '5%',
        paddingTop: SH(10),
        paddingBottom: SH(10),
    },
    dashboardTxt: {
        fontSize: SF(12),
        fontFamily: "Inter-Medium",
        color: '#1e2832',
    },
    logoutTxt: {
        fontFamily: "Inter-Medium",
        color: '#1e2832',
    },
    lineView: {
        height: 1,
        backgroundColor: 'gray',
        width: '100%',
    },
    logoutView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    txtInputView: {
        borderRadius: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: SH(10)
    },
    txtInput: {
        paddingLeft: 0,
        color: Colors.black
    },
    dobInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: SW(5),
        paddingHorizontal: SW(15),
        paddingVertical: SH(10),
        marginVertical: SH(7),
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SH(10),
    },

    downloadBtnSm: {
        backgroundColor: '#cfe7ff',
        paddingHorizontal: SW(12),
        borderRadius: 7,
    },
    downloadBtnTxt: {
        color: Colors.darkBlue,
        fontFamily: "Inter-Medium",
        paddingVertical: SH(5),
        fontSize: SF(13),
        letterSpacing: 0.2
    },
    sameTxt: {
        fontFamily: "Inter-Medium",
        fontSize: SF(15),
        color:Colors.dark
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SW(15),
        marginVertical: SH(10),
    },
    saveBtn: {
        borderRadius: 7,
        paddingHorizontal: SW(20),
    },
    saveBtnTxt: {
        color: Colors.light,
        fontFamily: "Inter-Medium",
        paddingVertical: windowHeight * 0.006,
        fontSize: SF(15)
    },
    dashboardBtn: {
        alignSelf: 'center',
        backgroundColor: "#303753",
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: windowHeight * 0.008,
        borderRadius: 40,
        marginBottom: windowHeight * 0.02
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: SW(20),
        paddingVertical: SH(20),
    },
    documentsTxt: {
        fontFamily: "Inter-Medium",
        color: Colors.darkBlue,
        paddingVertical: SH(10),
        fontSize: SF(16)
    }
});

export default styles;