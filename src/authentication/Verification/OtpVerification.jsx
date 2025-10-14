import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { containerStyle } from '../../Styles/ScreenContainer';
import GradientButton from '../../Components/GradientButton';
import { SH, SF, SW } from '../../utils/Dimensions';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import { OTP } from '../../utils/BASE_URL';
import api from '../../utils/api';
import { showMessage } from 'react-native-flash-message';
import { useRoute } from '@react-navigation/native';

const OtpVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleConfirmOtp = async () => {
    const finalOtp = otp.join('');
    if (finalOtp.length < 6) {
      showMessage({
        message: "Error",
        description: "Please enter the 6-digit OTP",
        type: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(OTP, { email, otp: finalOtp });

      console.log("OTP Verification Response:", response.data);

      if (response?.status === 200) {
        showMessage({
          message: "Success",
          description: response.data.message || "OTP verified successfully",
          type: "success",
        });
        navigation.navigate("CreateNewPassword", {
          email,
          resetToken: response.data.resetToken
        });
      } else {
        showMessage({
          message: "Error",
          description: response.data.message || "Invalid OTP",
          type: "danger",
        });
      }
    } catch (error) {
      console.log("OTP Verification Error:", error.response?.data || error);
      showMessage({
        message: "Error",
        description: error.response?.data?.message || "Failed to verify OTP",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={containerStyle.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <AppHeader title="Email Verification" navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text style={styles.welcome}>Just One Step Away</Text>
          <Text style={styles.description}>
            Enter the verification code we just sent to your email address
          </Text>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../assests/Images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.inputBox}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                ref={(ref) => (inputs.current[index] = ref)}
              />
            ))}
          </View>

          <GradientButton
            title={loading ? "Please wait..." : "Confirm OTP"}
            onPress={handleConfirmOtp}
            disabled={loading}
            style={{ marginTop: SH(30) }}
          />

          <Text style={styles.bottomtext}>
            Didn't receive code?{' '}
             <Text style={{ color: Colors.gradientBlue }} onPress={()=>navigation.navigate("ForgotPassword")}>Resend</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Inter-Regular",
    paddingVertical: SH(20),
    fontSize: SF(13),
    color: Colors.darkGray
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SW(10),
    marginVertical: SH(20)
  },
  inputBox: {
    width: SW(40),
    height: SH(40),
    borderColor: Colors.gradientBlue,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: SF(12),
    fontFamily: "Inter-Bold",
    textAlignVertical: 'center',
    color: Colors.dark
  },
  button: {
    marginTop: SH(20),
  },
  heading: {
    fontFamily: "Inter-Bold",
    fontSize: SF(24),
    textAlign: "center"
  },
  welcome: {
    fontFamily: 'Inter-Bold',
    fontSize: SF(22),
    textAlign: 'center',
    marginTop: SH(10),
    color: Colors.gradientBlue,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: SF(15),
    textAlign: 'center',
    marginTop: SH(10),
    color: Colors.darkGray,
    lineHeight: SH(22),
    marginRight: SW(10)
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: SH(150),
    width: "100%",
  },
  bottomtext: {
    textAlign: "center",
    marginTop: SH(50),
    fontFamily: "Inter-Medium",
    color: Colors.dark,
    fontSize: SF(15)
  }
});
