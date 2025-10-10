export const BASE_URL = "https://api.tghrms.com/api";

//auth apis 

export const LOGIN_API = `${BASE_URL}/v1/user/login`;

// attendance apis 

export const PUNCH_IN_API = `${BASE_URL}/v1/attendance/punchin`;
export const PUNCH_Out_API = `${BASE_URL}/v1/attendance/punchout`;
export const ATTENDANCE_RECORD = `${BASE_URL}/v1/attendance/summary`;
export const ATTENDANCES_API_DATA = `${BASE_URL}/v1/attendance/monthrecord`;
export const SALARY_API = `${BASE_URL}/v1/payroll/getPayrollByMonthAndYear`;
export const GET_USER_PROFILE = `${BASE_URL}/v1/user/getUserById`;
export const UPDATE_PROFILE = `${BASE_URL}/v1/user/updateUser`;
export const LEAVE_REQUEST=`${BASE_URL}/v1/leave/createLeaveRequest`