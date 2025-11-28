export const BASE_URL = "https://api.tghrms.com/api";
export const IMG_URL = "https://api.tghrms.com";

//auth apis 

export const LOGIN_API = `${BASE_URL}/v1/user/login`;

// attendance apis 

export const PUNCH_IN_API = `${BASE_URL}/v1/attendance/punchin`;
export const PUNCH_Out_API = `${BASE_URL}/v1/attendance/punchout`;
export const ATTENDANCE_RECORD = `${BASE_URL}/v1/attendance/summary`;
export const ATTENDANCES_API_DATA = `${BASE_URL}/v1/attendance/monthrecord`;
export const SALARY_API = `${BASE_URL}/v1/payroll/getPayrollByMonthAndYear`;
export const GET_USER_PROFILE = `${BASE_URL}/v1/user/getUserById`;
export const UPDATE_PROFILE = `${BASE_URL}/v1/user/updateUserForm`;
export const LEAVE_REQUEST=`${BASE_URL}/v1/leave/createLeaveRequest`;
export const GET_LEAVE_DATA = `${BASE_URL}/v1/leave/getUserLeaveRequests`;
export const FORGOT_PASSWORD = `${BASE_URL}/v1/user/forgotPassword`;
export const OTP = `${BASE_URL}/v1/user/verifyOTP`;
export const CHANGE_PASSWORD = `${BASE_URL}/v1/user/changePassword`;
export const RESET_PASSWORD = `${BASE_URL}/v1/user/resetPassword`;
export const COMPANY_PROFILE = `${BASE_URL}/v1/company/getCompanyById`;
export const COMPANY_POLICIES = `${BASE_URL}/v1/company/getAllPolicies`;
export const GET_DEPARTMENT=`${BASE_URL}/v1/company/getDepartmentsByCompany`;
export const GET_DESIGNATION=`${BASE_URL}/v1/company/getDesignationByCompany`;