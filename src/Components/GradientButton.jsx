import React from 'react';
import {Text,TouchableOpacity,StyleSheet,ActivityIndicator,View,} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../utils/Colors';
import { SF, SH, SW } from '../utils/Dimensions';

const GradientButton = ({ title, onPress, style, icon, loading = false }) => {
  return (
    <View style={styles.gradientContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.buttonContainer, style]}
        disabled={loading}
      >
        <LinearGradient
          colors={['#5599FF', '#2276E3']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? (
            <ActivityIndicator size="large" color={Colors.light} />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    // paddingBottom: SH(30),
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientButton: {
    height: SH(35),
    paddingHorizontal: SW(20),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SW(6),
  },
  title: {
    color: Colors.light,
    fontFamily: 'Inter-Medium',
    fontSize: SF(15),
  },
});

export default GradientButton;
