import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { containerStyle } from '../../Styles/ScreenContainer';
import GradientButton from '../../Components/GradientButton';
import { SH, SF, SW } from '../../utils/Dimensions';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';

const OtpVerification = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
            title="Confirm OTP"
            onPress={() => navigation.navigate('App')}
            style={{ marginTop: SH(30) }}
          />

          <Text style={styles.bottomtext}>
            Didn't receive code?{' '}
            <Text style={{ color: Colors.gradientBlue }}>Resend</Text>
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
    textAlignVertical: 'center'
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
