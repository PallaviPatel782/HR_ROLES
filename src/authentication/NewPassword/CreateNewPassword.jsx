import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../Components/AppHeader';
import { containerStyle } from '../../Styles/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SF, SH, SW } from '../../utils/Dimensions';
import Colors from '../../utils/Colors';
import GradientButton from '../../Components/GradientButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formStyle } from '../../Styles/formStyle';
import { showMessage } from 'react-native-flash-message';
import { RESET_PASSWORD } from '../../utils/BASE_URL';
import api from '../../utils/api';
import { useRoute, useNavigation } from '@react-navigation/native';

const CreateNewPassword = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email, resetToken } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleSecureNew = () => setSecureNew(!secureNew);
  const toggleSecureConfirm = () => setSecureConfirm(!secureConfirm);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      showMessage({
        message: "Error",
        description: "Please fill all fields.",
        type: "danger",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage({
        message: "Error",
        description: "New and confirm passwords do not match.",
        type: "danger",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(RESET_PASSWORD, {
        resetToken,
        newPassword,
        confirmPassword,
      });

      console.log("Reset Password Response:", response.data);

      if (response?.status === 200) {
        showMessage({
          message: "Success",
          description: response.data.message || "Password reset successfully!",
          type: "success",
        });
        navigation.replace("LoginScreen");
      } else {
        showMessage({
          message: "Error",
          description: response.data.message || "Failed to reset password",
          type: "danger",
        });
      }
    } catch (error) {
      console.log("Reset Password Error:", error.response?.data || error);
      showMessage({
        message: "Error",
        description: error.response?.data?.message || "Something went wrong",
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
        <AppHeader navigation={navigation} title="Create New Password" />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bannerBox}>
            <Ionicons
              name="lock-closed-outline"
              size={34}
              color={Colors.light}
              style={styles.lock}
            />
            <Text style={styles.bannerTitle}>Create Your New Password</Text>
            <Text style={styles.bannerText}>
              Set a strong password to secure your account and log in safely.
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={formStyle.title}>New Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={formStyle.inputBox}
                secureTextEntry={secureNew}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor={Colors.darkGray}
              />
              <TouchableOpacity onPress={toggleSecureNew} style={styles.eyeBtn}>
                <Ionicons
                  name={secureNew ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <Text style={formStyle.title}>Confirm New Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={formStyle.inputBox}
                secureTextEntry={secureConfirm}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor={Colors.darkGray}
              />
              <TouchableOpacity onPress={toggleSecureConfirm} style={styles.eyeBtn}>
                <Ionicons
                  name={secureConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <GradientButton
              title={loading ? "Please wait..." : "Create Password"}
              onPress={handleSubmit}
              disabled={loading}
              style={{ marginTop: SH(40) }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
  content: {
    paddingVertical: SH(16),
  },
  lock: {
    paddingVertical: SH(20),
    paddingHorizontal: SW(20),
    backgroundColor: Colors.gradientBlue,
    borderRadius: 50,
  },
  bannerBox: {
    paddingVertical: SH(20),
    paddingHorizontal: SW(20),
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
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});
