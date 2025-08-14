import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../utils/Colors';
import { SW, SH, SF } from '../utils/Dimensions';

const CustomHeader = ({ navigation }) => {
  return (
    <View style={[styles.headerContainer]}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.leftIcon}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>0</Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.icon}>
          <MaterialCommunityIcons name="chart-line" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gradientBlue,
    // paddingVertical: SH(7),
    paddingHorizontal: SW(15),
    height:SH(50),
  },
  leftIcon: {
    padding: SW(5),
  },
  rightIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: SW(10),
    padding: SW(5),
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: -2,
    backgroundColor: 'red',
    borderRadius: 8,
    width: SW(16),
    height: SH(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: SF(10),
    fontFamily: "Inter-Medium"
  },
});

export default CustomHeader;
