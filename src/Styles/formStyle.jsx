import { StyleSheet } from "react-native";
import Colors from "../utils/Colors";
import { SH, SW, SF } from "../utils/Dimensions";


export const formStyle = StyleSheet.create({
    formStyle: {
        marginVertical: SH(5)
    },
    inputBox: {
        borderColor: Colors.gray,
        borderWidth: 1,
        marginVertical: SH(7),
        borderRadius: 5,
        paddingLeft: SW(15),
        color:Colors.dark
    },
    title: {
        fontFamily: "Inter-Medium",
        fontSize: SF(13),
        textTransform: "capitalize",
        color:Colors.dark
    }
})