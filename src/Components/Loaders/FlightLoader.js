import React from 'react';
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native';  
import LottieView from 'lottie-react-native';
import Colors from '../../utils/Colors';
import { SF,SW } from '../../utils/Dimensions';

const { width, height } = Dimensions.get('window');

const FlightLoader = ({ message }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={true}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <LottieView
                    source={require('../../assests/Images/FlightLoader.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
                {message ? <Text style={styles.messageText}>{message}</Text> : null}
            </View>
        </Modal>
    );
};

export default FlightLoader;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        width,
        height,
        backgroundColor: Colors.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: 200,
        height: 200,
    },
    messageText: {
        marginTop: 20,     
        fontSize:SF(20),
        color: Colors.darkBlue,
        textAlign: 'center',
        fontFamily:"Inter-Bold",
        marginHorizontal:SW(10)
    },
});
