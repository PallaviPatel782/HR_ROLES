import {
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import React, { useEffect } from "react";
import AppHeader from "../../Components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { containerStyle } from "../../Styles/ScreenContainer";
import Colors from "../../utils/Colors";
import { styles } from "../../Styles/NotificationStyle";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllNotifications,
  markAsRead,
} from "../../redux/slices/notificationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Notification = ({ navigation }) => {
  const dispatch = useDispatch();

  const { notifications, loading } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const stored = await AsyncStorage.getItem("userInfo");
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch(fetchAllNotifications(parsed.id));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-GB", options).replace(",", " •");
  };

  const handlePress = async (item) => {
    if (item.type === "LeaveStatus") {
      navigation.navigate("getleavescreen");
    } else if (item.type === "Payroll") {
      navigation.navigate("salaryscreen");
    } else if (item.type === "Letter") {
      ToastAndroid.show("Notification is Readed", ToastAndroid.SHORT);
    }
    await dispatch(markAsRead(item._id));
    const stored = await AsyncStorage.getItem("userInfo");
    const parsed = JSON.parse(stored);
    dispatch(fetchAllNotifications(parsed.id));
  };

  const renderItem = ({ item }) => (
  <TouchableOpacity onPress={() => handlePress(item)}>
    <View style={styles.notificationCard}>
      
      <View style={{ position: "relative" }}>
        <Image
          source={require("../../assests/Images/bell.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        {!item.read && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#1E60FF",
              position: "absolute",
              top:6,
              right:10,
            }}
          />
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.description}>{item.message}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>

    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView
      style={containerStyle.container}
      edges={["top", "bottom"]}
    >
      <AppHeader navigation={navigation} title="Notifications" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.gradientBlue}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: Colors.gray,
              }}
            >
              No notifications found
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Notification;
