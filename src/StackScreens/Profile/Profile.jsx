import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import AppHeader from '../../Components/AppHeader';
import { formStyle } from '../../Styles/formStyle';
import Colors from '../../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SH, SW, SF } from '../../utils/Dimensions';
import { launchImageLibrary } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

const Profile = ({ navigation }) => {
    const [name, setName] = useState('Rubby Doe');
    const [username, setUsername] = useState('rubbydoe@email.com');
    const [password, setPassword] = useState('123456');
    const [designation, setDesignation] = useState('Native Developer');
    const [showPassword, setShowPassword] = useState(false);
    const [profileUri, setProfileUri] = useState(null);

    const handleImagePick = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.8,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.error('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                setProfileUri(response.assets[0].uri);
            }
        });
    };


    const handleLogout = async () => {
        console.log("logout button is pressed");

        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userInfo');
            console.log("authToken & userInfo cleared");

            showMessage({
                message: 'Logout successful',
                description: 'You have been logged out.',
                type: 'success',
                icon: 'success',
                duration: 3000,
            });

            navigation.reset({
                index: 0,
                routes: [{ name: "AuthStack" }],
            });
        } catch (error) {
            console.error('Logout error:', error);

            showMessage({
                message: 'Logout failed',
                description: 'Something went wrong while logging out.',
                type: 'danger',
                icon: 'danger',
                duration: 3000,
            });
        }
    };

    return (
        <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
            <AppHeader navigation={navigation} title="My Profile" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignSelf: 'center', marginVertical: SH(10) }}>
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={
                                profileUri
                                    ? { uri: profileUri }
                                    : require('../../assests/Images/dummyProfile.jpg')
                            }
                            style={{
                                width: SW(100),
                                height: SW(100),
                                borderRadius: SW(100),
                                borderWidth: 2,
                                borderColor: Colors.darkBlue,
                            }}
                        />

                        <TouchableOpacity
                            onPress={handleImagePick}
                            style={{
                                position: 'absolute',
                                bottom: SH(1),
                                right: SW(10),
                                backgroundColor: '#fff',
                                borderRadius: 20,
                                paddingHorizontal: SW(6),
                                paddingVertical: SH(6),
                                borderWidth: 1,
                                borderColor: '#ccc',
                            }}
                        >
                            <FontAwesome name="camera" size={18} color={Colors.darkBlue} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={formStyle.formStyle}>

                    <Text style={formStyle.title}>Name</Text>
                    <TextInput
                        style={formStyle.inputBox}
                        value={name}
                        onChangeText={setName}
                        placeholder='Name'
                        placeholderTextColor={Colors.darkGray}
                    />

                    <Text style={formStyle.title}>Username</Text>
                    <TextInput
                        style={formStyle.inputBox}
                        value={username}
                        onChangeText={setUsername}
                        placeholder='Username'
                        placeholderTextColor={Colors.darkGray}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={formStyle.title}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[formStyle.inputBox, styles.passwordInput]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder='Password'
                            placeholderTextColor={Colors.darkGray}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color={Colors.darkGray}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={formStyle.title}>Designation</Text>
                    <TextInput
                        style={formStyle.inputBox}
                        value={designation}
                        onChangeText={setDesignation}
                        placeholder='Designation'
                        placeholderTextColor={Colors.darkGray}
                    />
                    <View style={{ marginTop: SH(50) }}>
                        <TouchableOpacity style={[styles.gradientButton, { backgroundColor: Colors.gradientBlue }]} onPress={() => navigation.navigate('App', {
                            screen: 'ChangePassword'
                        })}>
                            <Text style={[styles.title, { color: Colors.light }]}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gradientButton} onPress={handleLogout}>
                            <Text style={[styles.title]}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    passwordInput: {
        paddingRight: SW(50),
        color: Colors.dark
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 12,
    },
    gradientButton: {
        height: SH(40),
        paddingHorizontal: SW(20),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.darkBlue,
        marginVertical: SH(5),
        // borderWidth: 0.5,
        // borderColor: Colors.darkBlue
    },
    title: {
        color: Colors.light,
        fontFamily: 'Inter-Regular',
        fontSize: SF(16),
    },
});