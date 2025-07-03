import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';
import { SH, SW, SF } from '../utils/Dimensions';

const CommonSearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onIconPress,
  containerStyle = {},
  inputStyle = {},
  iconColor = '#999',
  clearIconColor = '#999',
  placeholderTextColor = '#aaa',
  textColor = '#333',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={20} color={iconColor} style={styles.icon} />
      <TextInput
        style={[styles.input, inputStyle, { color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
      {onIconPress && value.length > 0 && (
        <TouchableOpacity onPress={onIconPress}>
          <Ionicons name="close-circle" size={20} color={clearIconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommonSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: SW(10),
    paddingHorizontal: SW(10),
    height: SH(40),
    marginBottom: SH(5),
    borderColor: Colors.darkGray,
    borderWidth: 1,
    borderRadius: 50,
  },
  icon: {
    marginRight: SW(6),
  },
  input: {
    flex: 1,
    fontSize: SF(14),
    fontFamily: 'Inter-Regular',
  },
});
