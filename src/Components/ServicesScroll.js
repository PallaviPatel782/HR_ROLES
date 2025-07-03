import React from 'react';
import { View, ScrollView, TouchableOpacity, Text,StyleSheet } from 'react-native';
import { SH,SW,SF } from '../utils/Dimensions';
import Colors from '../utils/Colors';

const ServicesScroll = ({ services, navigation }) => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.cardScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {services.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <item.icon width={60} height={70} />
              <Text style={styles.cardLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ServicesScroll;

const styles = StyleSheet.create({
  topContainer: {
    flex:1,
    backgroundColor: Colors.gradientBlue,
    borderBottomLeftRadius: SW(25),
    borderBottomRightRadius: SW(25),
    width: "100%",
    alignItems: 'center',
  },
  cardScroll: {
    paddingTop: SH(10),
  },
  scrollContent: {
    paddingHorizontal: SW(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: SW(80),
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: SW(12),
    elevation: 5,
    shadowColor: Colors.dark,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: SH(10),
    marginHorizontal: SW(5),
    paddingVertical:SH(10)
  },
  cardLabel: {
    fontSize: SF(12),
    fontFamily: "Inter-Medium",
    color: Colors.black,
  },
});
