import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../Components/AppHeader';
import { containerStyle } from '../Styles/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SF, SH, SW } from '../utils/Dimensions';
import Colors from '../utils/Colors';
import GradientButton from '../Components/GradientButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formStyle } from '../Styles/formStyle';

const ChangePassword = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secure, setSecure] = useState(true);

    const toggleSecure = () => setSecure(!secure);

    const handleSubmit = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New and confirm passwords do not match.');
            return;
        }
        alert('Password changed successfully!');
    };

    return (
        <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
            <AppHeader navigation={navigation} title="Change Password" />

            <View style={styles.bannerBox}>
                <Ionicons name="lock-closed-outline" size={34} color={Colors.light} style={styles.lock} />
                <Text style={styles.bannerTitle}>Keep your account secure</Text>
                <Text style={styles.bannerText}>
                    Use a strong and unique password to protect your account from unauthorized access.
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={formStyle.title}>Current Password</Text>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        style={formStyle.inputBox}
                        secureTextEntry={secure}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholderTextColor={Colors.darkGray}
                    />
                    <TouchableOpacity
                        onPress={toggleSecure}
                        style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: [{ translateY: -10 }],
                        }}
                    >
                        <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#555" />
                    </TouchableOpacity>
                </View>


                <Text style={formStyle.title}>New Password</Text>

                <View style={{ position: 'relative' }}>
                    <TextInput
                        style={formStyle.inputBox}
                        secureTextEntry={secure}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholderTextColor={Colors.darkGray}
                    />
                    <TouchableOpacity
                        onPress={toggleSecure}
                        style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: [{ translateY: -10 }],
                        }}
                    >
                        <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#555" />
                    </TouchableOpacity>
                </View>


                <Text style={formStyle.title}>Confirm New Password</Text>
                <View style={{ position: "relative" }}>
                    <TextInput
                        style={formStyle.inputBox}
                        secureTextEntry={secure}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor={Colors.darkGray}
                    />
                    <TouchableOpacity onPress={toggleSecure} style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: [{ translateY: -10 }],
                    }}>
                        <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#555" />
                    </TouchableOpacity>
                </View>

                <GradientButton title="Update Password" onPress={handleSubmit} style={{ marginTop: SH(40) }} />
            </View>
        </SafeAreaView>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    content: {
        paddingVertical: SH(16),
    },
    lock:{
paddingVertical: SH(20),
        paddingHorizontal:SW(20),
        backgroundColor:Colors.gradientBlue,
        borderRadius:50
    },
    bannerBox: {
        paddingVertical: SH(20),
        paddingHorizontal:SW(20),
        borderRadius: SW(10),
        marginHorizontal: SW(16),
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: SF(18),
        fontFamily: 'Inter-Bold',
        color: Colors.gradientBlue,
        marginTop: SH(8),
    },
    bannerText: {
        fontSize: SF(12),
        textAlign: 'center',
        color: '#555',
        marginTop: SH(4),
        lineHeight: SH(18),
        fontFamily: 'Inter-Regular',
    },
});
