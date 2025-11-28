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
    <SafeAreaView
      style={[containerStyle.container, { backgroundColor: Colors.background }]}
    >
      <AppHeader
        navigation={navigation}
        title={policy?.section || "Policy Detail"}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SW(15),
          paddingVertical: SH(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateText}>
          {policy?.createdAt
            ? `Created on ${new Date(policy.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}`
            : 'Created on N/A'}
        </Text>

        {policy?.description ? (
          <View style={{ marginTop: SH(10) }}>
            <RenderHTML
              contentWidth={width}
              source={{ html: policy.description }}
              baseStyle={styles.htmlText}
            />
          </View>
        ) : (
          <Text style={styles.htmlText}>No description provided.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PolicyDetail1;

const styles = StyleSheet.create({
  dateText: {
    fontSize: SF(14),
    color: Colors.darkGray,
    fontFamily: 'Inter-SemiBold',
    marginBottom: SH(10),
  },
  htmlText: {
    fontSize: SF(14),
    color: Colors.dark,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});
