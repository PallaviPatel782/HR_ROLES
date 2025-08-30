import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../utils/Colors';
import { SW, SH, SF } from '../utils/Dimensions';

const AppHeader = ({ navigation, title, description }) => {
    return (
        <View style={[styles.container]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate("Tabs", { screen: "Home" });
                        }
                    }}
                    style={styles.leftIcon}
                >
                    <AntDesign name="arrowleft" size={25} color={Colors.dark} />
                </TouchableOpacity>
                <Text style={styles.TitleText}>{title}</Text>
            </View>
            {description ? (
                <Text style={styles.descriptionText}>{description}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: SH(10),
        paddingBottom: SH(10),
        backgroundColor: Colors.background
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TitleText: {
        color: Colors.dark,
        fontSize: SF(14),
        fontFamily: "Inter-Medium",
        marginLeft: SW(5)
    },
    descriptionText: {
        fontFamily: "Inter-Medium",
        color: Colors.darkGray,
        fontSize: SF(10),
        marginTop: SH(5)
    }
});

export default AppHeader;
