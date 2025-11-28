import {
    StyleSheet,
    Text,
    View,
    Linking,
    TouchableOpacity,
    ScrollView, Image
} from "react-native";
import React from "react";
import { containerStyle } from "../Styles/ScreenContainer";
import AppHeader from "../Components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { SH, SF, SW } from "../utils/Dimensions";
import Colors from "../utils/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ContactSupport = ({ navigation }) => {
    const handleEmailPress = () => {
        Linking.openURL("mailto:info@trinexaglobal.com");
    };

    const handlePhonePress = () => {
        Linking.openURL("tel:75078 64000");
    };

    return (
        <SafeAreaView
            style={[containerStyle.container, { backgroundColor: "#F5F8FF" }]}
            edges={["top", "bottom"]}
        >
            <AppHeader navigation={navigation} title="Contact Support" />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.centerContent}>
                    <Image
                        source={require('../assests/Images/ContactUs.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.heading}>Need Help? We're just a tap away.</Text>
                    <Text style={styles.description}>
                        Reach out via call or email. Our support team is always here to assist
                        you.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.card, { flexDirection: "row" }]}
                    onPress={handleEmailPress}
                >
                    <MaterialIcons name="email" size={20} color={Colors.darkBlue} />
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Email Us</Text>
                        <Text style={styles.cardDetail}>mailto:info@trinexaglobal.com</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { flexDirection: "row" }]}
                    onPress={handlePhonePress}
                >
                    <MaterialIcons name="call" size={20} color={Colors.darkBlue} />
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Call Us</Text>
                        <Text style={styles.cardDetail}>+91 75078 64000</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
};

export default ContactSupport;

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: SW(10),
        paddingBottom: SH(30),
    },
    heading: {
        fontSize: SF(20),
        fontFamily: "Inter-Bold",
        marginVertical: SH(20),
        color: Colors.darkBlue,
        textAlign: "center"
    },
    description: {
        fontSize: SF(13),
        fontFamily: "Inter-Regular",
        color: "#606060",
        marginBottom: SH(24),
        textAlign: "center"
    },
    centerContent: {
        alignItems: 'center',
        marginBottom: SH(24),
    },
    image: {
        width: SW(200),
        height: SH(200),
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: SH(14),
        marginBottom: SH(16),
        borderRadius: SW(10),
        borderWidth: 1,
        borderColor: "#E5EAF0",
    },
    cardText: {
        marginLeft: SW(12),
    },
    cardTitle: {
        fontSize: SF(12),
        fontFamily: "Inter-Bold",
        color: Colors.darkBlue,
    },
    cardDetail: {
        fontSize: SF(14),
        fontFamily: "Inter-Regular",
        color: "#007AFF",
        marginTop: SH(2),
    },
});
