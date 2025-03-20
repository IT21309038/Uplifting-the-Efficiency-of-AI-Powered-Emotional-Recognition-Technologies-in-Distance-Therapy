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
};

export default apiDefinitions;
