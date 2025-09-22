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
import { pick, types } from '@react-native-documents/picker';

const UserProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo, profile, loading } = useSelector((state) => state.profile);
  console.log("userInfo in userProfileScreen", profile);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [profileUri, setProfileUri] = useState(null);
  const [panDoc, setPanDoc] = useState(null);
  const [aadhaarDoc, setAadhaarDoc] = useState(null);
  const [tenthDoc, setTenthDoc] = useState(null);
  const [twelfthDoc, setTwelfthDoc] = useState(null);
  const [resignationDoc, setResignationDoc] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      const stored = await AsyncStorage.getItem("userInfo");
      console.log("stored", stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch(setUserInfo(parsed));
        dispatch(fetchUserProfile(parsed.id));
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

      const displayPhoto =
        profileUri || (profile.photograph ? `${IMG_URL}${profile.photograph}` : null);
      setProfileUri(displayPhoto);
      if (profile.documents && Array.isArray(profile.documents)) {
        profile.documents.forEach((doc) => {
          const fileName = doc.docDocument.split("/").pop();

          switch (doc.docName) {
            case "PAN Card":
              setPanDoc({ name: fileName, uri: doc.docDocument });
              break;
            case "Aadhaar Card":
              setAadhaarDoc({ name: fileName, uri: doc.docDocument });
              break;
            case "10th Marksheet":
              setTenthDoc({ name: fileName, uri: doc.docDocument });
              break;
            case "12th Marksheet":
              setTwelfthDoc({ name: fileName, uri: doc.docDocument });
              break;
            case "Resignation":
              setResignationDoc({ name: fileName, uri: doc.docDocument });
              break;
            default:
              break;
          }
        });
      }

    }
  }, [profile]);

  const handleImagePick = () => {
    launchImageLibrary(
      { mediaType: "photo", maxWidth: 600, maxHeight: 600, quality: 0.8 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setProfileUri(response.assets[0].uri);
        }
      }
    );
  };


  const pickDocument = async (setDoc) => {
    try {
      const [res] = await pick({
        type: [types.allFiles],
      });

      if (res.size > 5 * 1024 * 1024) {
        showMessage({
          message: 'File exceeds 5MB. Please upload a smaller file.',
          type: 'warning',
          duration: 3000,
        });
        return;
      }

      setDoc({
        name: res.name,
        uri: res.uri,
      });

      console.log("Selected File:", res);

    } catch (err) {
      if (err?.code === 'canceled') {
        console.log("User cancelled picker");
      } else {
        console.error("DocumentPicker Error: ", err);
      }
    }
  };


  const handleSave = () => {
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !primaryPhone?.trim()) {
      showMessage({
        message: 'Validation Error',
        description: 'First Name, Last Name, Email, and Phone are required',
        type: 'danger',
        icon: 'danger'
      });
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: primaryPhone.trim(),
      photograph: profileUri || "",
      documents: [
        panDoc ? { docName: "PAN Card", docDocument: panDoc.uri || panDoc } : null,
        aadhaarDoc ? { docName: "Aadhaar Card", docDocument: aadhaarDoc.uri || aadhaarDoc } : null,
        tenthDoc ? { docName: "10th Marksheet", docDocument: tenthDoc.uri || tenthDoc } : null,
        twelfthDoc ? { docName: "12th Marksheet", docDocument: twelfthDoc.uri || twelfthDoc } : null,
        resignationDoc ? { docName: "Resignation", docDocument: resignationDoc.uri || resignationDoc } : null,
      ].filter(Boolean),
    };

    console.log("Final Payload going to API:", JSON.stringify(payload, null, 2));

    dispatch(updateUserProfile({ userId: userInfo?.id || userInfo?._id, payload }))
      .unwrap()
      .then(() => {
        showMessage({
          message: 'Profile updated successfully',
          type: 'success',
          icon: 'success'
        });

        setTimeout(() => {
          navigation.replace("App");
        }, 2000);
      })
      .catch((err) =>
        showMessage({
          message: 'Update failed',
          description: err?.message || 'Something went wrong',
          type: 'danger',
          icon: 'danger'
        })
      );
  };



  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="User Profile" />
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
                style={{
                  position: 'absolute',
                  bottom: SH(5),
                  right: SW(5),
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  padding: 6,
                  borderWidth: 1,
                  borderColor: '#ccc'
                }}
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
            <TextInput
              style={formStyle.inputBox}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              placeholderTextColor={Colors.darkGray}
            />

            <Text style={formStyle.title}>Email</Text>
            <TextInput
              style={formStyle.inputBox}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.darkGray}
            />

            <Text style={formStyle.title}>Phone Number</Text>
            <TextInput
              style={formStyle.inputBox}
              value={primaryPhone}
              onChangeText={setPrimaryPhone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              placeholderTextColor={Colors.darkGray}
            />

            <Text style={formStyle.title}>Documents</Text>
            {["PAN Card", "Aadhaar Card", "10th Marksheet", "12th Marksheet", "Resignation"].map((docType, idx) => {
              const docMap = {
                "PAN Card": panDoc,
                "Aadhaar Card": aadhaarDoc,
                "10th Marksheet": tenthDoc,
                "12th Marksheet": twelfthDoc,
                "Resignation": resignationDoc
              };
              const setDocMap = {
                "PAN Card": setPanDoc,
                "Aadhaar Card": setAadhaarDoc,
                "10th Marksheet": setTenthDoc,
                "12th Marksheet": setTwelfthDoc,
                "Resignation": setResignationDoc
              };

              const doc = docMap[docType];
              const setDoc = setDocMap[docType];

              return (
                <View key={idx} style={{ marginVertical: SH(5) }}>
                  <Text style={formStyle.title}>{docType}</Text>
                  <View style={[styles.uploadBtn, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>

                    <TouchableOpacity
                      onPress={() => pickDocument(setDoc)}
                      style={{ flex: 1 }}
                    >
                      <Text style={styles.uploadText} numberOfLines={1} ellipsizeMode="tail">
                        {doc ? doc.name : `Upload ${docType}`}
                      </Text>
                    </TouchableOpacity>
                    {doc && (
                      <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        {/* <TouchableOpacity onPress={() => openFile(doc.uri)} style={{ marginRight: 10 }}>
                          <FontAwesome name="eye" size={20} color={Colors.darkBlue} />
                        </TouchableOpacity> */}

                        <TouchableOpacity onPress={() => setDoc(null)}>
                          <FontAwesome name="trash" size={20} color="red" />
                        </TouchableOpacity>
                      </View>
                    )}

                  </View>

                </View>
              );
            })}


            <View style={{ marginTop: SH(30) }}>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: Colors.gradientBlue }]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  saveBtn: { paddingVertical: SH(12), borderRadius: 10, alignItems: 'center' },
  saveText: { color: Colors.light, fontSize: SF(15), fontFamily: 'Inter-Bold' },
  uploadBtn: {
    paddingVertical: SH(12),
    paddingHorizontal: SW(10),
    borderWidth: 1,
    borderColor: Colors.darkBlue,
    borderRadius: 8,
    marginVertical: SH(5),
    backgroundColor: '#f5f5f5',
  },
  uploadText: {
    fontSize: SF(14),
    color: Colors.darkBlue,
    fontFamily: "Inter-Regular",
  },
});
