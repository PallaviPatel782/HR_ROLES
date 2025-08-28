import React from 'react';
import RootNavigator from './src/Routing/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import InternetCheck from './src/Components/CheckInternet';
import FlashMessage from "react-native-flash-message";
import store from './src/redux/store';
import { Provider } from 'react-redux';
import { View, StyleSheet, StatusBar } from 'react-native';
import Colors from './src/utils/Colors';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
          <RootNavigator />
          <InternetCheck />
          <FlashMessage position="bottom" />
        </View>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
