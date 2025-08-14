export const BASE_URL = "https://api.tghrms.com/api/v1";

//auth apis 

export const LOGIN_API = `${BASE_URL}/user/login`;

// attendance apis 

export const PUNCH_IN_API = `${BASE_URL}/attendance2/punchin`;
export const PUNCH_Out_API = `${BASE_URL}/attendance2/punchout`;
export const ATTENDANCE_RECORD= `${BASE_URL}/attendance2/summary`;
export const ATTENDANCES_API_DATA =`${BASE_URL}/attendance2/monthrecord`;