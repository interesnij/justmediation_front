import { API } from "helpers";

export const getStages = async (attorney) => {
  try {
    const response = await API().get("business/stages/", {
      params: { attorney },
    });
    return response.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const getMatterStages = async (matter) => {
  try {
    const response = await API().get("business/stages/", {
      params: { matter },
    });
    return response.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

export const createMaterStage = (data) => {
  return API().post("business/stages/", data);
};

export const updateMaterStage = (id, data) => {
  return API().put(`business/stages/${id}/`, data);
};

export const deleteMaterStage = (id) => {
  return API().delete(`business/stages/${id}/`);
};

export const getLeads = () => {
  return API().get("business/leads/");
};
