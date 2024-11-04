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
};

export default apiDefinitions;