import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { containerStyle } from '../../Styles/ScreenContainer';
import AppHeader from '../../Components/AppHeader';
import Colors from '../../utils/Colors';
import { SH, SF, SW } from '../../utils/Dimensions';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const PolicyDetail1 = ({ route, navigation }) => {
  const { policy } = route.params;
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={[containerStyle.container, { backgroundColor: Colors.background }]}>
      <AppHeader navigation={navigation} title={policy?.section || "Policy Detail"} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: SW(15), paddingVertical: SH(20) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{policy?.title || "Untitled Policy"}</Text>

          <View style={styles.divider} />

          <View style={styles.infoBox}>
            <Text style={styles.label}>Section</Text>
            <Text style={styles.value}>{policy?.section || "N/A"}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Created On</Text>
            <Text style={styles.value}>
              {policy?.createdAt ? new Date(policy.createdAt).toLocaleDateString() : "N/A"}
            </Text>
          </View>

          <Text style={[styles.label, { marginTop: SH(18) }]}>Description</Text>
          {policy?.description ? (
            <View style={styles.descriptionBox}>
              <RenderHTML
                contentWidth={width}
                source={{ html: policy.description }}
                baseStyle={styles.htmlText}
              />
            </View>
          ) : (
            <Text style={styles.value}>No description provided.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PolicyDetail1;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: SW(18),
    shadowColor: Colors.dark,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: SF(18),
    fontFamily: 'Inter-Bold',
    color: Colors.darkBlue,
    textAlign: 'center',
    marginBottom: SH(10),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    opacity: 0.4,
    marginVertical: SH(8),
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SH(6),
  },
  label: {
    fontSize: SF(14),
    color: Colors.darkGray,
    fontFamily: 'Inter-SemiBold',
  },
  value: {
    fontSize: SF(14),
    color: Colors.dark,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    flexShrink: 1,
  },
  descriptionBox: {
    borderRadius: 10,
    padding: SW(10),
    paddingLeft:0
  },
  htmlText: {
    fontSize: SF(13),
    color: Colors.dark,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});
