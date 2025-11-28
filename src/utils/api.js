// src/utils/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./BASE_URL";
import { resetToAuth } from "../Routing/NavigationService";

const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 404) {
      await AsyncStorage.removeItem("authToken");
      resetToAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
