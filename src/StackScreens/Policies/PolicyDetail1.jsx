import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import AppHeader from '../../Components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import Colors from '../../utils/Colors';
import { SH, SF, SW } from '../../utils/Dimensions';


const PolicyDetail1 = ({ navigation }) => {
  return (
    <SafeAreaView style={containerStyle.container}>
      <AppHeader navigation={navigation} title="Policy 1.1: About the contract" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: SW(5), paddingVertical: SH(20) }} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.itemLabel}>Objective</Text>
          <Text style={styles.itemValue}>
            This policy outlines the terms and conditions under which an employee enters into an agreement with the company.
          </Text>

          <Text style={[styles.itemLabel, { marginTop: SH(16) }]}>Contract Period</Text>
          <Text style={styles.itemValue}>
            All employees are required to sign a 12-month service contract effective from the date of joining.
          </Text>

          <Text style={[styles.itemLabel, { marginTop: SH(16) }]}>Termination</Text>
          <Text style={styles.itemValue}>
            Either party may terminate the agreement with 30 days written notice or salary in lieu of notice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PolicyDetail1

const styles = StyleSheet.create({

  itemLabel: {
    fontSize: SF(13),
    color: Colors.dark,
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },

  itemValue: {
    fontSize: SF(13),
    color: '#1c1c1c',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  }
})