import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import AppHeader from '../../Components/AppHeader';
import { formStyle } from '../../Styles/formStyle';
import Colors from '../../utils/Colors';
import { SH, SW, SF } from '../../utils/Dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, setUserInfo } from '../../redux/slices/profileSlice';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from "react-native-image-picker";
import { IMG_URL } from '../../utils/BASE_URL';
import { UPDATE_PROFILE } from '../../utils/BASE_URL';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { pick, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();
    const { userInfo, profile, loading } = useSelector((state) => state.profile);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [primaryPhone, setPrimaryPhone] = useState('');
    const [profileUri, setProfileUri] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [documentsToRemove, setDocumentsToRemove] = useState([]);
    const [resumeFile, setResumeFile] = useState(null);
    const [aadharFile, setAadharFile] = useState(null);
    const [panFile, setPanFile] = useState(null);

    useEffect(() => {
        console.log("==== Profile Screen Mounted ====");
        const loadUserInfo = async () => {
            const stored = await AsyncStorage.getItem("userInfo");
            console.log("Stored AsyncStorage userInfo:", stored);

            if (stored) {
                const parsed = JSON.parse(stored);
                console.log("Parsed AsyncStorage userInfo:", parsed);

                // Normalize ID
                if (!parsed._id && parsed.id) parsed._id = parsed.id;

                dispatch(setUserInfo(parsed));
                console.log("Dispatched setUserInfo:", parsed);

                dispatch(fetchUserProfile(parsed._id))
                    .unwrap()
                    .then((res) => {
                        console.log("fetchUserProfile response:", res);
                    })
                    .catch((err) => {
                        console.error("fetchUserProfile error:", err);
                    });
            } else {
                console.warn("No userInfo found in AsyncStorage");
            }
        };
        loadUserInfo();
    }, []);


    useEffect(() => {
        console.log("profile", profile);
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setEmail(profile.email || '');
            setPrimaryPhone(profile.primaryPhone || '');
            setProfileUri(profile.photograph ? `${IMG_URL}/${profile.photograph}` : null);
            setDocuments(profile.documents?.map(doc => ({
                id: doc._id,
                name: doc.docName || 'Document',
                file: doc.docDocument ? { url: `${IMG_URL}/${doc.docDocument}` } : null,
                editable: true
            })) || []);
            setResumeFile(profile.resume ? { url: `${IMG_URL}/${profile.resume}` } : null);
            setAadharFile(profile.aadharCard ? { url: `${IMG_URL}/${profile.aadharCard}` } : null);
            setPanFile(profile.panCard ? { url: `${IMG_URL}/${profile.panCard}` } : null);
        }
    }, [profile]);


    const getCleanFileName = (file) => {
        const name = file?.name || file?.url?.split('/').pop() || 'Document';
        const parts = name.split('-');
        return parts.length > 1 ? parts.slice(1).join('-') : name;
    };

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: "photo", maxWidth: 600, maxHeight: 600, quality: 0.8 }, response => {
            if (response.didCancel) return;
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                const uri = asset.uri;
                const ext = uri.split('.').pop()?.toLowerCase();
                if (['jpg', 'jpeg', 'png'].includes(ext)) {
                    setProfileUri(uri);
                } else {
                    showMessage({ message: "Invalid File", description: "Only JPG/JPEG/PNG allowed", type: "warning" });
                }
            }
        });
    };

    const pickDocument = async (index) => {
        try {
            const [res] = await pick({ type: [types.allFiles] });
            if (!res) return;

            const maxSize = 2 * 1024 * 1024; // 2 MB
            if (res.size && res.size > maxSize) {
                showMessage({
                    message: "File too large!",
                    description: "Max 2 MB allowed. Please select another file.",
                    type: "warning",
                    duration: 4000,
                });
                return;
            }

            let uri = res.uri;
            if (uri.startsWith('content://')) {
                const destPath = `${RNFS.TemporaryDirectoryPath}/${res.name}`;
                await RNFS.copyFile(uri, destPath);
                uri = `file://${destPath}`;
            }

            const updatedDocs = [...documents];
            updatedDocs[index].file = { uri, name: res.name, type: res.type || 'application/pdf' };
            setDocuments(updatedDocs);

        } catch (err) {
            if (err?.code === 'canceled') return;
            console.error("DocumentPicker Error:", err);
            showMessage({
                message: "Error picking document",
                description: err.message,
                type: "danger",
                duration: 4000,
            });
        }
    };

    const pickSpecialDocument = async (type) => {
        try {
            const [res] = await pick({ type: [types.allFiles] });
            if (!res) return;

            const maxSize = 2 * 1024 * 1024;
            if (res.size > maxSize) {
                showMessage({ message: "File too large!", description: "Max 2 MB", type: "warning" });
                return;
            }

            let uri = res.uri;
            if (uri.startsWith('content://')) {
                const destPath = `${RNFS.TemporaryDirectoryPath}/${res.name}`;
                await RNFS.copyFile(uri, destPath);
                uri = `file://${destPath}`;
            }

            const fileObj = { uri, name: res.name, type: res.type || 'application/pdf' };

            if (type === 'resume') setResumeFile(fileObj);
            else if (type === 'aadhar') setAadharFile(fileObj);
            else if (type === 'pan') setPanFile(fileObj);

        } catch (err) {
            console.error(err);
            showMessage({ message: "Error picking document", type: "danger" });
        }
    };


    const addNewDocField = () => {
        setDocuments([...documents, { name: `Document ${documents.length + 1}`, file: null, editable: true }]);
    };

    const removeDocument = (doc, index) => {
        if (doc.id && doc.editable) {
            setDocumentsToRemove(prev => [...prev, { key: "documentsToRemove[]", value: doc.id, type: "text" }]);
            setDocuments(prev => prev.filter((_, i) => i !== index));
        }
    };

    const viewDocument = (doc) => {
        const link = doc.file?.url || doc.file?.uri;
        if (link) Linking.openURL(link).catch(() => showMessage({ message: "Unable to open file", type: "danger" }));
        else showMessage({ message: "No file to view", type: "warning" });
    };


    const handleSave = async () => {
        console.log("=== Saving profile ===");
        console.log("Current userInfo:", userInfo);
        console.log("Form Data:", { firstName, lastName, email, primaryPhone, profileUri });

        const formData = new FormData();
        if (firstName) formData.append("firstName", firstName);
        if (lastName) formData.append("lastName", lastName);
        if (email) formData.append("email", email);
        if (primaryPhone) formData.append("primaryPhone", primaryPhone);
        if (profileUri && !profileUri.startsWith("http")) {
            const filename = profileUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image/jpeg";
            formData.append("photograph", { uri: profileUri, name: filename, type });
            console.log("Profile image appended:", { uri: profileUri, name: filename, type });
        }
        if (resumeFile?.uri) formData.append("resume", resumeFile);
        if (aadharFile?.uri) formData.append("aadharCard", aadharFile);
        if (panFile?.uri) formData.append("panCard", panFile);

        documents.forEach(doc => {
            if (doc.file?.uri) {
                formData.append("documents", { uri: doc.file.uri, name: doc.file.name, type: doc.file.type });
            }
        });

        documentsToRemove.forEach(item => formData.append(item.key, item.value));

        try {
            const token = await AsyncStorage.getItem("authToken");
            console.log("Auth token:", token);
            if (!token) throw new Error("User not authenticated");

            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            };

            const url = `${UPDATE_PROFILE}/${userInfo?._id}`;
            console.log("PUT URL:", url);

            const res = await axios.post(url, formData, { headers });
            console.log("Update response:", res.data);

            if (res.data?.success) {
                showMessage({ message: 'Profile updated successfully', type: 'success', icon: 'success' });
                dispatch(fetchUserProfile(userInfo?._id));
                setTimeout(() => navigation.replace("App"), 2000);
            } else {
                throw new Error(res.data?.message || "Update failed");
            }
        } catch (err) {
            console.error("Profile Update Error:", err.response?.data || err.message || err);
            showMessage({
                message: 'Update failed',
                description: err.response?.data?.message || err.message || 'Something went wrong',
                type: 'danger',
                icon: 'danger'
            });
        }
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
                                resizeMode="cover"
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
                        <TextInput style={formStyle.inputBox} value={primaryPhone} onChangeText={setPrimaryPhone} placeholder="Phone Number" keyboardType="phone-pad" placeholderTextColor={Colors.darkGray} />
                        <View style={styles.card}>
                            <Text style={formStyle.title}>Resume</Text>
                            <View style={styles.docRow}>
                                <View style={{ flex: 1 }}>
                                    {resumeFile?.name || resumeFile?.url ? (
                                        <Text style={styles.fileName}>{getCleanFileName(resumeFile)}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.docActions}>
                                    {resumeFile && (
                                        <TouchableOpacity onPress={() => Linking.openURL(resumeFile?.url || resumeFile?.uri)} style={styles.iconBtn}>
                                            <FontAwesome name="eye" size={18} color={Colors.darkBlue} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => pickSpecialDocument('resume')} style={styles.iconBtn}>
                                        <MaterialIcons name="edit" size={20} color={Colors.orange} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={formStyle.title}>Aadhar Card</Text>
                            <View style={styles.docRow}>
                                <View style={{ flex: 1 }}>
                                    {aadharFile?.name || aadharFile?.url ? (
                                        <Text style={styles.fileName}>{getCleanFileName(aadharFile)}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.docActions}>
                                    {aadharFile && (
                                        <TouchableOpacity onPress={() => Linking.openURL(aadharFile?.url || aadharFile?.uri)} style={styles.iconBtn}>
                                            <FontAwesome name="eye" size={18} color={Colors.darkBlue} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => pickSpecialDocument('aadhar')} style={styles.iconBtn}>
                                        <MaterialIcons name="edit" size={20} color={Colors.orange} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={formStyle.title}>PAN Card</Text>
                            <View style={styles.docRow}>
                                <View style={{ flex: 1 }}>
                                    {panFile?.name || panFile?.url ? (
                                        <Text style={styles.fileName}>{getCleanFileName(panFile)}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.docActions}>
                                    {panFile && (
                                        <TouchableOpacity onPress={() => Linking.openURL(panFile?.url || panFile?.uri)} style={styles.iconBtn}>
                                            <FontAwesome name="eye" size={18} color={Colors.darkBlue} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => pickSpecialDocument('pan')} style={styles.iconBtn}>
                                        <MaterialIcons name="edit" size={20} color={Colors.orange} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Text style={formStyle.title}>Documents</Text>
                        {documents.map((doc, index) => (
                            <View key={doc.id || index} style={styles.docRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.docName}>{`Document ${index + 1}`}</Text>
                                    {doc.file?.name || doc.file?.url ? (
                                        <Text style={styles.fileName}>
                                            {getCleanFileName(doc.file)}
                                        </Text>
                                    ) : null}
                                </View>
                                <View style={styles.docActions}>
                                    {doc.file ? (
                                        <>
                                            <TouchableOpacity onPress={() => viewDocument(doc)} style={styles.iconBtn}>
                                                <FontAwesome name="eye" size={18} color={Colors.darkBlue} />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => pickDocument(index)} style={styles.iconBtn}>
                                                <MaterialIcons name="edit" size={20} color={Colors.orange} />
                                            </TouchableOpacity>

                                            {doc.editable && (
                                                <TouchableOpacity onPress={() => removeDocument(doc, index)} style={styles.iconBtn}>
                                                    <MaterialIcons name="delete" size={20} color="red" />
                                                </TouchableOpacity>
                                            )}
                                        </>
                                    ) : (
                                        <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument(index)}>
                                            <Text style={styles.uploadText}>Upload File</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}


                        <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: Colors.gradientBlue }]} onPress={addNewDocField}>
                            <Text style={{ color: "#fff", textAlign: "center" }}>+ Add Document</Text>
                        </TouchableOpacity>
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
    cameraBtn: { position: 'absolute', bottom: SH(5), right: SW(5), backgroundColor: '#fff', borderRadius: 20, padding: 6, borderWidth: 1, borderColor: '#ccc' },
    saveBtn: { paddingVertical: SH(12), borderRadius: 10, alignItems: 'center' },
    saveText: { color: Colors.light, fontSize: SF(15), fontFamily: 'Inter-Bold' },
    uploadBtn: { paddingVertical: SH(8), paddingHorizontal: SW(12), borderWidth: 1, borderColor: Colors.darkBlue, borderRadius: 8, marginVertical: SH(5), backgroundColor: '#f5f5f5' },
    uploadText: { fontSize: SF(14), color: Colors.darkBlue, fontFamily: "Inter-Regular" },
    docRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SH(10), borderBottomWidth: 0.5, borderColor: '#ddd', paddingBottom: SH(6) },
    docName: { fontSize: SF(14), fontFamily: "Inter-Medium", color: Colors.dark },
    fileName: { fontSize: SF(12), color: Colors.darkGray, fontFamily: "Inter-Regular", marginTop: 3 },
    docActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { marginHorizontal: SW(6) },
});
