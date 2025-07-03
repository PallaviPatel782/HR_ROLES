// CommonTabSwitcher.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SH, SW, SF } from '../utils/Dimensions';
import Colors from '../utils/Colors';

const CommonTabSwitcher = ({ tabs = [], onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabPress = (index) => {
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(tabs[index], index);
    }
  };

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabPress(index)}
            style={[
              styles.tab,
              isActive && styles.activeTab,
              isActive && tab.activeStyle,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                isActive && styles.activeText,
                isActive && tab.activeTextStyle,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    // marginBottom: SH(5),
  },
  tab: {
    borderWidth: 1,
    borderColor: Colors.darkGray,
    paddingVertical: SH(5),
    paddingHorizontal: SW(10),
    borderRadius: 10,
    marginHorizontal: SW(5),
    backgroundColor: '#f8f8f8',
  },
  tabText: {
    color: Colors.darkGray,
    fontFamily: 'Inter-Medium',
    fontSize: SF(12)
  },
});

export default CommonTabSwitcher;
