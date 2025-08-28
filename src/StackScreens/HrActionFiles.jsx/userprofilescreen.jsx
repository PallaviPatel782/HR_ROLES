import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import LogoutIcon from 'react-native-vector-icons/FontAwesome';
import CameraIcon from 'react-native-vector-icons/FontAwesome';
import DownIcon from 'react-native-vector-icons/Entypo';
import DashboardIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinkIcon from 'react-native-vector-icons/Feather';
import { SF, SH, SW } from '../../utils/Dimensions';
import { formStyle } from '../../Styles/formStyle';
// import { Calendar } from 'react-native-calendars';
import { containerStyle } from '../../Styles/ScreenContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../Components/AppHeader';
import Colors from '../../utils/Colors';
import styles from '../../Styles/userProfileStyle';
import DocumentPicker from '@react-native-documents/picker';
import { showMessage } from 'react-native-flash-message';

const userprofilescreen = ({ navigation }) => {
  const [isStartModalVisible, setStartModalVisible] = useState(false);
  const [startDate, setStartDate] = useState('');

  const [documents, setDocuments] = useState({
    pan: null,
    aadhar: null,
    marksheet10: null,
    marksheet12: null,
  });


  const handleSave = () => {
    showMessage({
      message: "Changes saved successfully ✅",
      type: "success",
    });
    navigation.goBack();
  };


  const handleResignation = () => {
    Alert.alert(
      "Confirm Resignation",
      "Are you sure you want to resign?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Resign",
          onPress: () => {
            console.log("Resignation submitted 🚀");
            navigation.goBack();
          }
        }
      ]
    );
  };

  const pickDocument = async (field) => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });

    if (res) {
      setDocuments((prev) => ({ ...prev, [field]: res }));
      Alert.alert("Uploaded!", `${res.name} selected for ${field}`);
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log("User cancelled picker");
    } else {
      console.log("DocumentPicker Error: ", err);
    }
  }
};

  return (
    <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <AppHeader navigation={navigation} title="My Profile" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        <View style={{ alignItems: 'center', marginBottom: SH(20) }}>
          <Image
            source={require('../../assests/Images/dummyProfile.jpg')}
            style={{
              width: SW(100),
              height: SW(100),
              borderRadius: SW(50),
              borderWidth: 2,
              borderColor: Colors.darkBlue,
            }}
          />
          <Text style={[styles.sameTxt, { marginTop: SH(10), fontSize: SF(16) }]}>
            John Doe
          </Text>
          <Text style={[styles.dashboardTxt, { fontSize: SF(13), color: Colors.gradientBlue }]}>
            Software Developer
          </Text>
        </View>


        <View style={formStyle.formStyle}>
          <Text style={formStyle.title}>Name</Text>
          <View style={formStyle.inputBox}>
            <TextInput
              style={styles.txtInput}
              placeholder="John Doe"
              placeholderTextColor="#999"
              value="John Doe"
              editable={false}
            />
          </View>

          <Text style={formStyle.title}>Email</Text>
          <View style={formStyle.inputBox}>
            <TextInput
              style={styles.txtInput}
              placeholder="john.doe@example.com"
              placeholderTextColor="#999"
              value="john.doe@example.com"
              editable={false}
            />
          </View>

          <Text style={formStyle.title}>Password</Text>
          <View style={formStyle.inputBox}>
            <TextInput
              style={[styles.txtInput, { color: '#000' }]}
              placeholder="********"
              secureTextEntry={true}
              value="password123"
              editable={false}
            />
          </View>

          <Text style={formStyle.title}>Date of Birth</Text>
          <View style={styles.dobInputView}>
            <Text style={styles.txtInput}>{startDate || '1995-05-20'}</Text>
            <TouchableOpacity onPress={() => setStartModalVisible(true)}>
              <DownIcon name='chevron-down' size={25} color={Colors.darkGray} />
            </TouchableOpacity>
          </View>

          <Text style={formStyle.title}>Designation</Text>
          <View style={formStyle.inputBox}>
            <TextInput
              style={styles.txtInput}
              placeholder="Software Developer"
              placeholderTextColor="#999"
              value="Software Developer"
              editable={false}
            />
          </View>

          <Text style={formStyle.title}>Department</Text>
          <View style={formStyle.inputBox}>
            <TextInput
              style={styles.txtInput}
              placeholder="IT"
              placeholderTextColor="#999"
              value="IT"
              editable={false}
            />
          </View>

          <Text style={formStyle.title}>Country/Region</Text>
          <View style={formStyle.inputBox}>
            <TextInput
              style={styles.txtInput}
              placeholder="India"
              placeholderTextColor="#999"
              value="India"
              editable={false}
            />
          </View>


          {/* <Text style={styles.documentsTxt}>Documents</Text>
          <Text style={formStyle.title}>PAN Card</Text>

          <TouchableOpacity
            style={styles.dobInputView}
            onPress={() => pickDocument('pan')}
          >
            <Text style={styles.txtInput}>
              {documents.pan ? documents.pan.name : "Upload your Pan Card"}
            </Text>
            <LinkIcon name='link' size={17} color="#000" />
          </TouchableOpacity>

          <Text style={formStyle.title}>Aadhar Card</Text>
          <TouchableOpacity
            style={styles.dobInputView}
            onPress={() => pickDocument('aadhar')}
          >
            <Text style={styles.txtInput}>
              {documents.aadhar ? documents.aadhar.name : "Upload your Aadhar Card"}
            </Text>
            <LinkIcon name='link' size={17} color="#000" />
          </TouchableOpacity>

          <Text style={formStyle.title}>Marksheet{'('}10th & 12th{')'}</Text>
          <TouchableOpacity
            style={styles.dobInputView}
            onPress={() => pickDocument('marksheet10')}
          >
            <Text style={styles.txtInput}>
              {documents.marksheet10 ? documents.marksheet10.name : "Upload your 10th Marksheet"}
            </Text>
            <LinkIcon name='link' size={17} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dobInputView}
            onPress={() => pickDocument('marksheet12')}
          >
            <Text style={styles.txtInput}>
              {documents.marksheet12 ? documents.marksheet12.name : "Upload your 12th Marksheet"}
            </Text>
            <LinkIcon name='link' size={17} color="#000" />
          </TouchableOpacity> */}

          {/* <View style={styles.rowBetween}>
            <Text style={styles.sameTxt}>Signed Non Disclosure Agreement</Text>
            <TouchableOpacity style={styles.downloadBtnSm}>
              <Text style={styles.downloadBtnTxt}>Download</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.sameTxt}>Offer Letter</Text>
            <TouchableOpacity style={styles.downloadBtnSm}>
              <Text style={styles.downloadBtnTxt}>Download</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.sameTxt}>Letter of Recommendation</Text>
            <TouchableOpacity style={styles.downloadBtnSm}>
              <Text style={styles.downloadBtnTxt}>Download</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.sameTxt}>Certificate of Completion</Text>
            <TouchableOpacity style={styles.downloadBtnSm}>
              <Text style={styles.downloadBtnTxt}>Download</Text>
            </TouchableOpacity>
          </View> */}


          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: Colors.gradientBlue }]}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnTxt}>Save changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: '#ff7372' }]}
              onPress={handleResignation}
            >
              <Text style={styles.saveBtnTxt}>Resignation</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={isStartModalVisible}
        onRequestClose={() => setStartModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            {/* <Calendar
                            markingType={'period'}
                            markedDates={{
                                [startDate]: { selected: true, color: 'blue', textColor: 'white' },
                            }}
                            onDayPress={onStartDateSelect}
                        /> */}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default userprofilescreen;