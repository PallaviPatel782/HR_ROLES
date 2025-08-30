import { StyleSheet, Text, View, Linking, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { containerStyle } from '../Styles/ScreenContainer';
import AppHeader from '../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../Components/GradientButton';
import { SF, SH, SW } from '../utils/Dimensions';
import { formStyle } from '../Styles/formStyle';
import Colors from '../utils/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { cardstyle } from '../Styles/CardStyle';

const MAX_LENGTH = 500;

const ContactSupport = ({ navigation }) => {
    const [message, setMessage] = useState('');

    const handleEmailPress = () => {
        Linking.openURL('mailto:info@trinexaglobal.com');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:+919999999999');
    };

    const handleSubmit = () => {
        if (message.trim().length === 0) {
            Alert.alert("Oops!", "Please enter your message.");
            return;
        }
        Alert.alert("Thank You", "Your message has been sent successfully.");
        setMessage('');
    };

    return (
        <SafeAreaView style={[containerStyle.container, { backgroundColor: '#F5F8FF' }]} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                <AppHeader navigation={navigation} title="Contact Support" />
                <ScrollView contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.heading}>Need Help? We're just a tap away.</Text>
                    <Text style={styles.description}>
                        Reach out via call or email, or send us a quick message. Our support team is always here to assist you.
                    </Text>
                    <TouchableOpacity style={[cardstyle.card, { flexDirection: "row", paddingVertical: SH(10) }]} onPress={handleEmailPress}>
                        <MaterialIcons name="email" size={18} color={Colors.darkBlue} />
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Email Us</Text>
                            <Text style={styles.cardDetail}>support@gstourism.com</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[cardstyle.card, { flexDirection: "row", paddingVertical: SH(10) }]} onPress={handlePhonePress}>
                        <MaterialIcons name="call" size={18} color={Colors.darkBlue} />
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Call Us</Text>
                            <Text style={styles.cardDetail}>+91 99999 99999</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.form}>
                        <Text style={styles.inputLabel}>💬 Send us a message</Text>
                        <TextInput
                            placeholder="Write your message here..."
                            style={[formStyle.inputBox, styles.textInput]}
                            multiline
                            numberOfLines={4}
                            value={message}
                            maxLength={MAX_LENGTH}
                            onChangeText={setMessage}
                        />
                        <Text style={styles.charCount}>{`${message.length}/${MAX_LENGTH}`}</Text>

                        <GradientButton
                            title={'Submit'}
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ContactSupport;

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: SW(10),
        paddingBottom: SH(30),
        flexGrow: 1
    },
    heading: {
        fontSize: SF(18),
        fontFamily: 'Inter-Bold',
        marginTop: SH(20),
        marginBottom: SH(10),
        color: Colors.darkBlue,
    },
    description: {
        fontSize: SF(12),
        fontFamily: 'Inter-Regular',
        color: '#606060',
        marginBottom: SH(24),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFFEE',
        paddingVertical: SH(14),
        marginBottom: SH(16),
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    cardText: {
        marginLeft: SW(12),
        color: Colors.dark
    },
    cardTitle: {
        fontSize: SF(12),
        fontFamily: 'Inter-Bold',
        color: Colors.darkBlue,
    },
    cardDetail: {
        fontSize: SF(12),
        fontFamily: 'Inter-Regular',
        color: '#007AFF',
        marginTop: SH(2),
    },
    form: {
        marginTop: SH(24),
    },
    inputLabel: {
        fontSize: SF(14),
        fontFamily: 'Inter-Medium',
        marginBottom: SH(8),
        color: Colors.darkGray
    },
    textInput: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: SH(12),
        minHeight: SH(100),
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        fontSize: SF(12),
        color: '#888',
        marginTop: SH(6),
    },
    submitButton: {
        marginTop: SH(24),
    },
});
