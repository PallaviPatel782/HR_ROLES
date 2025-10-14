import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { containerStyle } from '../../Styles/ScreenContainer';
import { SF, SH, SW } from '../../utils/Dimensions';
import GradientButton from '../../Components/GradientButton';
import Colors from '../../utils/Colors';
import { formStyle } from '../../Styles/formStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import { FORGOT_PASSWORD } from '../../utils/BASE_URL';
import api from '../../utils/api';
import { showMessage } from 'react-native-flash-message';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            showMessage({
                message: "Please enter your email address",
                type: "danger",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(FORGOT_PASSWORD, { email });

            console.log("Forgot Password Response:", response.data);

            if (response?.status === 200) {
                showMessage({
                    message: "Success",
                    description: response.data.message || "OTP sent successfully",
                    type: "success",
                });
                navigation.navigate("OtpVerification", { email });
            } else {
                showMessage({
                    message: "Error",
                    description: response.data.message || "Something went wrong",
                    type: "danger",
                });
            }
        } catch (error) {
            console.log("Forgot Password Error:", error.response?.data || error);
            showMessage({
                message: "Error",
                description: error.response?.data?.message || "Failed to send OTP",
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: SH(20) }}
                >
                    <AppHeader title="Forgot Password" navigation={navigation} />
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assests/Images/Forgot.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.heading}>Forgot Password?</Text>
                    <Text style={styles.welcome}>Don't worry, we've got you!</Text>
                    <Text style={styles.description}>
                        We'll send a one-time password (OTP) to your email so you can reset your password.
                    </Text>

                    <View style={styles.inputCard}>
                        <Text style={formStyle.title}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={Colors.darkGray} />
                            <TextInput
                                placeholder="johndoe12@yourcompany.com"
                                placeholderTextColor={Colors.placeholderColor}
                                style={styles.inputBox}
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    <GradientButton
                        title={loading ? 'Please wait...' : 'Continue'}
                        onPress={handleForgotPassword}
                        disabled={loading}
                        style={{ marginTop: SH(50) }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default ForgotPassword;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginBottom: SH(10),
    },
    logo: {
        height: SH(150),
        width: "100%",
    },
    heading: {
        fontFamily: 'Inter-Bold',
        fontSize: SF(22),
        textAlign: 'center',
        color: Colors.gradientBlue,
    },
    welcome: {
        fontFamily: 'Inter-Bold',
        fontSize: SF(22),
        textAlign: 'center',
        marginTop: SH(20),
        color: Colors.dark,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: SF(15),
        textAlign: 'center',
        marginTop: SH(10),
        color: Colors.darkGray,
        lineHeight: SH(20),
        marginBottom: SH(30),
    },
    inputCard: {
        paddingVertical: SH(20),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.lightGray,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: SW(10),
        height: SH(50),
        backgroundColor: '#F9F9F9',
        marginTop: SH(10),
    },
    inputBox: {
        flex: 1,
        marginLeft: SW(10),
        fontFamily: 'Inter-Regular',
        fontSize: SF(14),
        color: Colors.dark,
    },
    linkContainer: {
        marginTop: SH(30),
        alignItems: 'center',
    },
    linkText: {
        fontSize: SF(14),
        color: Colors.darkGray,
    },
    linkBold: {
        fontFamily: "Inter-Bold",
        color: Colors.gradientBlue,
    },
});