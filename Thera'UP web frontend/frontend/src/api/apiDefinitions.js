import { api } from "./apiBase";

const apiDefinitions = {

    checkAlive: async function () {
        return await api.get("check/alive");
    }
};

export default apiDefinitions;