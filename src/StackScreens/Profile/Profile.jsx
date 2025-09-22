import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import AppHeader from '../../Components/AppHeader';
import { formStyle } from '../../Styles/formStyle';
import Colors from '../../utils/Colors';
import { SH, SW, SF } from '../../utils/Dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, setUserInfo } from '../../redux/slices/profileSlice';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from "react-native-image-picker";
import { IMG_URL } from '../../utils/BASE_URL';

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();
    const { userInfo, profile, loading } = useSelector((state) => state.profile);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPrimaryPhone] = useState('');
    const [profileUri, setProfileUri] = useState(null);

    useEffect(() => {
        const loadUserInfo = async () => {
            const stored = await AsyncStorage.getItem("userInfo");
            if (stored) {
                const parsed = JSON.parse(stored);
                dispatch(setUserInfo(parsed));
                dispatch(fetchUserProfile(parsed._id));
            }
        };
        loadUserInfo();
    }, []);

    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setEmail(profile.email || '');
            setPrimaryPhone(profile.primaryPhone || '');
            const displayPhoto = profileUri || (profile.photograph ? `${IMG_URL}${profile.photograph}` : null);
            setProfileUri(displayPhoto);
        }
    }, [profile]);

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: "photo", maxWidth: 600, maxHeight: 600, quality: 0.8 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setProfileUri(response.assets[0].uri);
            }
        });
    };

    const handleSave = () => {
        if (!firstName || !lastName || !email || !phone) {
            showMessage({
                message: 'Validation Error',
                description: 'Please fill all fields',
                type: 'danger',
                icon: 'danger',
            });
            return;
        }

        const payload = { firstName, lastName, email, phone, photograph: profileUri };
        dispatch(updateUserProfile({ userId: userInfo?.id, payload }))
            .unwrap()
            .then(() => {
                showMessage({ message: 'Profile updated', type: 'success', icon: 'success' });
                setTimeout(() => {
                    navigation.replace("App");
                }, 2000);
            })
            .catch((err) =>
                showMessage({
                    message: 'Update failed',
                    description: err?.message || 'Something went wrong',
                    type: 'danger',
                    icon: 'danger',
                })
            );
    };

    return (
        <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
            <AppHeader navigation={navigation} title="My Profile" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView>
                    <View style={{ alignSelf: 'center', marginVertical: SH(10) }}>
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={profileUri ? { uri: profileUri } : require('../../assests/Images/dummyProfile.jpg')}
                                style={{ width: SW(120), height: SW(120), borderRadius: SW(60), borderWidth: 2, borderColor: Colors.darkBlue }}
                            />
                            <TouchableOpacity
                                onPress={handleImagePick}
                                style={{ position: 'absolute', bottom: SH(5), right: SW(5), backgroundColor: '#fff', borderRadius: 20, padding: 6, borderWidth: 1, borderColor: '#ccc' }}
                            >
                                <FontAwesome name="camera" size={18} color={Colors.darkBlue} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={formStyle.formStyle}>
                        <Text style={formStyle.title}>First Name</Text>
                        <TextInput
                            style={formStyle.inputBox}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="First Name"
                            placeholderTextColor={Colors.darkGray}
                        />
                        <Text style={formStyle.title}>Last Name</Text>
                        <TextInput style={formStyle.inputBox}
                            value={lastName} onChangeText={setLastName}
                            placeholder="Last Name"
                            placeholderTextColor={Colors.darkGray}
                        />
                        <Text style={formStyle.title}>Email</Text>
                        <TextInput style={formStyle.inputBox} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.darkGray} />
                        <Text style={formStyle.title}>Phone Number</Text>
                        <TextInput style={formStyle.inputBox} value={phone} onChangeText={setPrimaryPhone} placeholder="Phone Number" keyboardType="phone-pad" placeholderTextColor={Colors.darkGray} />

                        <View style={{ marginTop: SH(30) }}>
                            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.gradientBlue }]} onPress={handleSave} disabled={loading}>
                                <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    saveBtn: { paddingVertical: SH(12), borderRadius: 10, alignItems: 'center' },
    saveText: { color: Colors.light, fontSize: SF(15), fontFamily: 'Inter-Bold' },
});
