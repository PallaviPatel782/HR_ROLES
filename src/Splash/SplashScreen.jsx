import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientButton from '../Components/GradientButton';
import { containerStyle } from '../Styles/ScreenContainer';
import { SH, SF, SW } from '../utils/Dimensions';
import Colors from '../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  
  const navigation = useNavigation();

  return (
   <SafeAreaView style={containerStyle.container} edges={['top', 'bottom']}>
      <View style={{flex:1}}>
        <View style={styles.contentContainer}>
          <Image
            source={require('../assests/Images/hrms.png')}
            resizeMode="contain"
            style={styles.image}
          />

          <View style={styles.textContainer}>
            <Text style={styles.title}>Smart HR Solutions</Text>
            <Text style={styles.subtitle}>
              Manage salary, leave, and attendance efficiently — all from one powerful app.
            </Text>
          </View>
        </View>

        <GradientButton
          title="Get Started"
          onPress={() => navigation.navigate('LoginScreen')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SW(20),
  },
  image: {
    width: '100%',
    height: SH(350),
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SW(10),
  },
  title: {
    fontSize: SF(20),
    fontFamily: 'Inter-Bold',
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: SH(10),
  },
  subtitle: {
    fontSize: SF(13),
    color: Colors.dark,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: SH(24),
  },
  button: {
    marginBottom: SH(80),
    width: '90%',
    alignSelf: 'center',
  },
});

export default SplashScreen;
