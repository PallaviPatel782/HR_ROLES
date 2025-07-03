import { StyleSheet } from "react-native";
import { SH, SW, SF } from "../utils/Dimensions";
import Colors from "../utils/Colors";

export const styles = StyleSheet.create({
    list: {
        paddingHorizontal: SW(5),
        paddingVertical: SH(15)
    },
    notificationCard: {
        flexDirection: 'row',
        marginBottom: SH(16),
        alignItems: 'flex-start',
    },
    icon: {
        width: SW(40),
        height: SH(40),
        marginRight: SW(12),
        marginTop: SH(4),
    },
    textContainer: {
        flex: 1,
    },
    description: {
        fontSize: SF(15),
        color: '#333',
        fontFamily: 'Inter-Medium',
        marginBottom: SH(5),
    },
    date: {
        fontSize: SF(13),
        color: '#999',
        fontFamily: 'Inter-Regular',
    },
})