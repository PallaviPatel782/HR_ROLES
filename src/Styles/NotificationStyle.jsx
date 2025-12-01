import { StyleSheet } from "react-native";
import { SH, SW, SF } from "../utils/Dimensions";
import Colors from "../utils/Colors";

export const styles = StyleSheet.create({
    list: {
        paddingHorizontal: SW(5),
        paddingVertical: SH(15),
        paddingTop: 0
    },
    notificationCard: {
        flexDirection: 'row',
        marginVertical: SH(5),
        alignItems: 'flex-start',
        paddingHorizontal: SW(10),
        paddingVertical: SH(7),
        borderRadius: 5,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1
    },
    icon: {
        width: SW(30),
        height: SH(30),
        marginRight: SW(12),
        marginTop: SH(4),
    },
    textContainer: {
        flex: 1,
    },
    description: {
        fontSize: SF(13),
        color: '#333',
        fontFamily: 'Inter-Medium',
        marginBottom: SH(5),
    },
    date: {
        fontSize: SF(11),
        color: '#999',
        fontFamily: 'Inter-Regular',
    },
})