import { api } from "./apiBase";

const apiDefinitions = {
  checkAlive: async function () {
    return await api.get("check/alive");
  },

  /****************Auth API Start */
  loginAuth: async function (payload) {
    return await api.post("doctors/login", payload);
  },
  /****************Auth API End */

  /****************Doctor API Start */
  getSessionByDoctor: async function (doctorId, currentMonth) {
    return await api.get(
      `schedule/get-schedule-by-doctor/${doctorId}?sortBy=${currentMonth}`
    );
  },
  getPatientListPending: async function () {
    return await api.get("doctors/get-patient-list/2?status=pending");
  },
  getPatientListCompleted: async function () {
    return await api.get("doctors/get-patient-list/1?status=completed");
  },

  /****************Patient API Start */
  activitySuggestion: async function (payload) {
    return await api.post(`postTherapy/suggestActivities`, payload);
  },
  assignActivities: async function (payload) {
    return await api.post(`postTherapy/assignActivities`, payload);
  },
  allPatientProgress: async function () {
    return await api.get(`postTherapy/allPatientsProgress`);
  },
  getProgressByPatientId: async function (patientId) {
    return await api.get(`postTherapy/progress/${patientId}`);
  },
  deleteActivityAssigned: async function (patientId, activityId) {
    return await api.delete(
      `postTherapy/deleteActivity/${patientId}/${activityId}`
    );
  },
  getAllPatientDetails: async function (patientId) {
    return await api.get(`patients/get-report/${patientId}`);
  },

  /********************Report Api Start************************** */
  crearteReport: async function (payload) {
    return await api.post(`reports/create`, payload);
  },

  getReports: async function (offset, pageSize, patientId, doctorId) {
    return await api.get(
      `reports/get-report-paginated/${offset}/${pageSize}?patientId=${patientId}&doctorId=${doctorId}`
    );
  }
};

export default apiDefinitions;
