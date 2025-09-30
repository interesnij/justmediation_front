import { API } from "helpers";

/**
 * Get posted matters
 * @param data search params
 */
interface GetPostedMattersParams {
  search?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  status?: string;
  attorney?: string;
}

export const getPostedMatters = async (data?: GetPostedMattersParams) => {
  const params: any = {
    search: data?.search,
    offset: (data?.pageSize || 0) * (data?.page || 0),
    limit: data?.pageSize,
    ordering: data?.ordering || "-id",
    attorney: data?.attorney,
  };
  if (data?.status)
    params.status = data.status;
  try {
    const res = await API().get("business/posted-matter/", { params });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/**
 * Get Posted Matter by id
 * @param id
 * @param attorneyId
 */
export const getPostedMatterById = async (id, attorneyId?: string) => {
  try {
    const res = await API().get(`business/posted-matter/${id}/`, {params: {attorney: attorneyId}});
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/**
 * Create posted matter
 * 
 */
 interface iPostedMatterData {
  title?: string;
  description?: string;
  budget_min?: number,
  budget_max?: number,
  budget_type?: string,
  practice_area?: number
 }
 export const createPostedMatter = (data: iPostedMatterData) => {
  return API().post("/business/posted-matter/", data);
};

/**
 * Edit posted matter
 *  
 */
export const editPostedMatter = (
  postId: number,
  data: iPostedMatterData
) => {
  return API().patch(`/business/posted-matter/${postId}/`, data);
};

/**
 * Deactivate posted matter
 * @param id
 */
 export const deactivatePostedMatter = (postId) => {
  return API().post(`/business/posted-matter/${postId}/deactivate/`);
};

/**
 * Reactivate posted matter
 * @param id
 */
 export const reactivatePostedMatter = (postId) => {
  return API().post(`/business/posted-matter/${postId}/reactivate/`);
};

/**
 * Delete posted matter
 * @param id
 */
 export const deletePostedMatter = (postId) => {
  return API().delete(`/business/posted-matter/${postId}/`);
};

/**
 * Get posted matters list for specific practice area 
 * @param id
 */
export const getPracticeAreaPostedMatters = async (
  id: number,
  data?: GetPostedMattersParams  
) => {
  const params = {
    offset: (data?.pageSize || 0) * (data?.page || 0),
    limit: data?.pageSize,
    ordering: data?.ordering || "-created"
  };
  const res = await API().get(
    `/forum/practice_areas/${id}/posted_matters/`, 
    { params }
  );
  return res.data;
};

/**
 * Get posted matter topics
 * @param data search params
 */
interface GetPostedMatterTopicsParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
}
export const getPostedMatterTopics = async (
  data?: GetPostedMatterTopicsParams
) => { 
  const params = {
    offset: (data?.pageSize || 0) * (data?.page || 0),
    limit: data?.pageSize,
    ordering: data?.ordering || "title"
  };
  const res = await API().get("business/posted-matter/practice_area_stats/", {
    params,
  });
  return res.data;
};

/**
 * Get engagements
 * @param id
 */
 export const getEngagements = async (id, data) => {
  const params = {
    offset: (data?.pageSize || 0) * (data?.page || 0),
    limit: data?.pageSize,
    is_active: data?.isActive || 0
  };
  const res = await API().get(`/users/attorneys/${id}/engagements/`, { params });
  return res.data;
};

/**
 * Create new proposal
 * @param proposal data
 */
 export const createProposal = (data) => {
  return API().post("business/proposals/", data);
};


/**
 * Get proposal by Id
 * @param id
 */
 export const getProposalById = async (id) => {
  const res = await API().get(`/business/proposals/${id}/`);
  return res.data;
};

/**
 * Update proposal
 * @param data
 */
 export const updateProposal = (id, data) => {
  return API().put(`/business/proposals/${id}/`, {...data, rate_detail: "something"});
};

/**
 * Withdraw proposal
 * @param id
 */
 export const withdrawProposal = (id) => {
  return API().post(`/business/proposals/${id}/withdraw/`);
};

/**
 * Delete proposal
 * @param id
 */
 export const deleteProposal = (id) => {
  return API().delete(`/business/proposals/${id}/`);
};

/**
 * Accept proposal
 * @param id
 */
 export const acceptProposal = (id) => {
  return API().post(`/business/proposals/${id}/accept/`);
};

/**
 * Revoke proposal
 * @param id
 */
 export const revokeProposal = (id) => {
  return API().post(`/business/proposals/${id}/revoke/`);
};