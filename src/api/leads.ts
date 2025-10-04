import { API } from "helpers";

/** Get business leads. */
export const getBusinessLeads = async () => {
  try {
    const res = await API().get("business/leads/");
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/** Get business lead by id. */
export const getBusinessLeadsById = async (id: number) => {
  try {
    const res = await API().get(`business/leads/${id}`);
    return res.data;
  } catch (error) {
    return {};
  }
};

/** Create business leads. */
interface CreateBusinessLeads {
  client: number;
  mediator: number;
}
export const createBusinessLeads = (data: CreateBusinessLeads) => {
  return API().post("business/leads/", data);
};

/** Delete business lead by id. */
export const deleteBusinessLead = (id: number) => {
  return API().delete(`business/leads/${id}`);
};

/** Update business lead by id. */
export const updateBusinessLead = (id: number, data) => {
  return API().put(`business/leads/${id}`, data);
};
