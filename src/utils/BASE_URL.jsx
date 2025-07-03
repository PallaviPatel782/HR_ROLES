export const BASE_URL = "https://gs-tourism-backend.onrender.com/api";

// add expenses api 
export const ADD_EXPENSES_API = `${BASE_URL}/expenses/create`;

// auth apis
export const AUTHORIZATION_API = `${BASE_URL}/APIToken/get`;
export const LOGIN = `${BASE_URL}/auth/login`;

// flight 
export const AIRPORTLISTS = `${BASE_URL}/airports`;
export const FLIGHT_SEARCH = `${BASE_URL}/flight-search/search`;
export const FARE_RULE = `${BASE_URL}/farerules`;
export const FARE_QUOTE = `${BASE_URL}/farequote`;
export const SSR = `${BASE_URL}/flight/ssr`;