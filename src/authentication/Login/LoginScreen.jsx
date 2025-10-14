import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { containerStyle } from '../../Styles/ScreenContainer';
import { SF, SH, SW } from '../../utils/Dimensions';
import GradientButton from '../../Components/GradientButton';
import Colors from '../../utils/Colors';
import { formStyle } from '../../Styles/formStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import { LOGIN_API } from '../../utils/BASE_URL';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { setAuthToken } from '../../redux/slices/LoginSlice';
import { useDispatch } from 'react-redux';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userName.trim() && !password.trim()) {
      showMessage({
        message: "Email and Password are required",
        type: "danger",
        icon: "auto",
      });
      return false;
    }

    if (!userName.trim()) {
      showMessage({
        message: "Email is required",
        type: "danger",
        icon: "auto",
      });
      return false;
    }

    if (!emailRegex.test(userName)) {
      showMessage({
        message: "Enter a valid email address",
        type: "danger",
        icon: "auto",
      });
      return false;
    }

    if (!password.trim()) {
      showMessage({
        message: "Password is required",
        type: "danger",
        icon: "auto",
      });
      return false;
    }

    return true;
  };

 const handleLogin = async () => {
  if (!validateForm()) return;

  const payload = {
    email: userName.trim(),
    password: password.trim(),
  };

  console.log("Login Payload:", payload);

  setLoading(true);
  try {
    const response = await axios.post(LOGIN_API, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("API Response:", response?.data);

    const user = response?.data?.user;
    const token = response?.data?.token;
    const companyId = user?.companyDetails?.companyId || '';
    const companyName = user?.companyDetails?.companyName || '';

    if (user && token) {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      if (companyId) await AsyncStorage.setItem('companyId', companyId);
      if (companyName) await AsyncStorage.setItem('companyName', companyName);

      console.log("Stored companyId:", companyId);
      console.log("Stored companyName:", companyName);

      showMessage({
        message: "Login Successful",
        type: "success",
        icon: "success",
        duration: 3000,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "AppStack" }],
      });
    } else {
      showMessage({
        message: response?.data?.message || 'Invalid credentials',
        type: 'danger',
        icon: 'danger',
        duration: 3000,
      });
    }
  } catch (error) {
    console.error("Login Error:", error?.response?.data || error.message);

    showMessage({
      message: error.response?.data?.message || 'Something went wrong',
      type: 'danger',
      icon: 'danger',
      duration: 3000,
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
        <AppHeader title="Login" navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: SH(20) }}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assests/Images/login2.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heading}>Get Started</Text>
          <Text style={styles.welcome}>Welcome to Trinexa Global !</Text>

          <View style={{ marginVertical: SH(20) }}>
            <Text style={formStyle.title}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={18} color={Colors.darkGray} />
              <TextInput
                placeholder="johndoe12@yourcompany.com"
                value={userName}
                onChangeText={setUsername}
                placeholderTextColor={Colors.placeholderColor}
                style={styles.inputBox}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={[styles.inputCard]}>
              <Text style={formStyle.title}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.darkGray} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.placeholderColor}
                  style={[styles.inputBox, { flex: 1 }]}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={Colors.darkGray}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.resetPassword} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.resetPasswordText}>forgot password ?</Text>
            </TouchableOpacity>
          </View>

          <GradientButton
            title="Continue"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: SH(50) }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: SH(10),
  },
  logo: {
    height: SH(190),
    width: "100%",
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: SF(19),
    textAlign: 'center',
    color: Colors.gradientBlue,
  },
  welcome: {
    fontFamily: 'Inter-Bold',
    fontSize: SF(17),
    textAlign: 'center',
    marginTop: SH(10),
    color: Colors.dark,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: SF(14),
    textAlign: 'center',
    marginTop: SH(10),
    color: Colors.darkGray,
    lineHeight: SH(20),
    marginBottom: SH(30),
  },
  inputCard: {
    paddingBottom: SH(10),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: SW(10),
    height: SH(45),
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
  resetPassword: {
    alignSelf: "flex-end"
  },
  resetPasswordText: {
    color: Colors.gradientBlue,
    fontFamily: "Inter-Bold",
    textTransform: 'capitalize',
    fontSize: SF(12)
  }
});
