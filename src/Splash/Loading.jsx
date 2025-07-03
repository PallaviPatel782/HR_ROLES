import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';
import { SH, SF, SW } from '../utils/Dimensions';
import LottieView from 'lottie-react-native';

const Loading = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assests/Images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <LottieView
                source={require('../assests/Images/LoadingIcon.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
            <Text style={styles.loadingText}>
                Optimize your HR workflows
            </Text>
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SW(20),
    },
    logo: {
        width: SW(150),
        height: SH(150),
        marginBottom: SH(10),
    },
    lottie: {
        width: SW(200),
        height: SH(200),
        marginBottom: SH(20),
    },
    loadingText: {
        fontSize: SF(16),
        color: Colors.darkBlue,
        textAlign: 'center',
        fontFamily: 'Inter-Bold',
        paddingHorizontal: SW(10),
        opacity: 0.85,
    },
});
