import Colors from "../utils/Colors";
import { SH, SW, SF } from "../utils/Dimensions";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SH(25),
    },
    avatar: {
        width: SW(40),
        height: SH(40),
        borderRadius: 30,
    },
    userInfo: {
        marginLeft: SW(15),
    },
    name: {
        fontSize: SF(15),
        fontFamily: "Inter-Bold",
        color: '#222',
    },
    email: {
        fontSize: SF(12),
        color: Colors.darkGray
    },
    menuContainer: {
        marginTop: SH(10),
    },
    bottomMenu: {
        paddingBottom: SH(20)
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SH(12),
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    icon: {
        marginRight: SW(15),
    },
    menuText: {
        fontSize: SF(14),
        color: '#333',
        fontFamily: "Inter-Regular"
    },
    menuText1: {
        fontSize: SF(14),
        color: '#333',
        fontFamily: "Inter-Medium"
    }
});
