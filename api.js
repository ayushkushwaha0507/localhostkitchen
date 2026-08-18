/**
 * api.js — the ONLY place that calls fetch() to Apps Script. Both
 * attendance.js and admin.js go through these functions; no raw
 * fetch() calls anywhere else in the codebase.
 *
 * Note: requests use Content-Type: text/plain to avoid a CORS preflight
 * (a well-known Apps Script quirk) — doPost() still parses the body as
 * JSON regardless of the declared content type.
 */
const Api = (function () {
  async function call(action, params) {
    params = params || {};
    try {
      const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(Object.assign({ action: action }, params)),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      return { success: false, error: 'NETWORK_ERROR', message: "We couldn't connect to Localhost Kitchen right now. Please try again." };
    }
  }

  return {
    // student auth
    requestOtp: (email) => call('requestOtp', { email }),
    verifyOtp: (email, otp) => call('verifyOtp', { email, otp }),
    logout: (sessionToken) => call('logout', { sessionToken }),

    // student data
    getStudentDashboard: (sessionToken, date) => call('getStudentDashboard', { sessionToken, date }),
    getMenu: (date) => call('getMenu', { date }),
    getAttendance: (sessionToken, date) => call('getAttendance', { sessionToken, date }),
    skipMeal: (sessionToken, date, meal) => call('skipMeal', { sessionToken, date, meal }),
    undoSkip: (sessionToken, date, meal) => call('undoSkip', { sessionToken, date, meal }),
    markFutureAbsence: (sessionToken, fromDate, toDate, meals) => call('markFutureAbsence', { sessionToken, fromDate, toDate, meals }),

    // admin auth
    adminRequestOtp: (email) => call('adminRequestOtp', { email }),
    adminVerifyOtp: (email, otp) => call('adminVerifyOtp', { email, otp }),
    adminLogout: (sessionToken) => call('adminLogout', { sessionToken }),

    // admin data
    getAdminDashboard: (sessionToken, date) => call('getAdminDashboard', { sessionToken, date }),
    getMealStudents: (sessionToken, date, meal) => call('getMealStudents', { sessionToken, date, meal }),
    adminOverride: (sessionToken, studentId, date, meal, newStatus) => call('adminOverride', { sessionToken, studentId, date, meal, newStatus }),
    adminAddStudent: (payload) => call('adminAddStudent', payload),
    adminAddAdmin: (sessionToken, name, email) => call('adminAddAdmin', { sessionToken, name, email }),

    // public
    getSettings: () => call('getSettings', {}),
  };
})();
