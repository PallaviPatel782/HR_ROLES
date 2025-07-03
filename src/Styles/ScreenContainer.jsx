import { SH, SW } from "../utils/Dimensions";
import Colors from "../utils/Colors";
import { StyleSheet } from "react-native";

export const containerStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: SW(15),
        paddingVertical: 0,
        marginVertical: 0
    },
});