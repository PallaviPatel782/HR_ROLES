import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Modal } from 'react-native';
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

const userprofilescreen = ({ navigation }) => {
  const [isStartModalVisible, setStartModalVisible] = useState(false);
  const [startDate, setStartDate] = useState('');

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


          <Text style={styles.documentsTxt}>Documents</Text>
          <Text style={formStyle.title}>PAN Card</Text>

          <View style={styles.dobInputView}>
            <Text style={styles.txtInput}>Upload your Pan Card</Text>
            <LinkIcon name='link' size={17} color="#000" />
          </View>

          <Text style={formStyle.title}>Aadhar Card</Text>
          <View style={styles.dobInputView}>
            <Text style={styles.txtInput}>Upload your Aadhar Card</Text>
            <LinkIcon name='link' size={17} color="#000" />
          </View>

          <Text style={formStyle.title}>Marksheet{'('}10th & 12th{')'}</Text>
          <View style={styles.dobInputView}>
            <Text style={styles.txtInput}>Upload your 10th Marksheet</Text>
            <LinkIcon name='link' size={17} color="#000" />
          </View>
          <View style={styles.dobInputView}>
            <Text style={styles.txtInput}>Upload your 12th Marksheet</Text>
            <LinkIcon name='link' size={17} color="#000" />
          </View>

          <View style={styles.rowBetween}>
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
          </View>


          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.gradientBlue }]}>
              <Text style={styles.saveBtnTxt}>Save changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: '#ff7372' }]}>
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