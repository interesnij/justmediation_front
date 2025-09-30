import { API } from "helpers";
import { MATTERS_PER_PAGE } from "config";

interface GetMattersSearchParam {
  page?: number;
  pageSize?: number;
  search?: string;
  attorney?: string;
  paralegal?: string;
  client?: string | number;
  shared_with?: string | number;
  status?: string;
  ordering?: string;
}
/**
 * Get matters.
 */
export const getMatters = async ({
  page = 0,
  pageSize,
  search = "",
  attorney,
  paralegal,
  client,
  shared_with,
  status,
  ordering,
}: GetMattersSearchParam) => {
  const params = {
    ordering: ordering || "-modified",
    offset: page * (pageSize || 0),
    limit: pageSize,
    search,
    attorney,
    paralegal,
    client,
    status,
    shared_with,
  };
  try {
    const response = await API().get("business/matters/", { params });
    return response.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/**
 * Get matter by id.
 * @param id Id.
 */
export const getMatterById = async (id: number) => {
  try {
    const response = await API().get(`business/matters/${id}`);
    return response.data;
  } catch (error: any) {
    return Promise.reject(error?.data?.detail);
  }
};

/**
 * Create matter.
 * @param id user Id.
 * @param data request body.
 */
export const createMatter = (id: string, data) => {
  return API().post(`business/matters/`, data);
};

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/**
 * Create matter note.
 * @param data request body.
 */
export const createMatterNote = (data) => {
  return API().post(`business/notes/`, data);
};
/**
 * Update matter note.
 * @param data request body.
 */
export const updateMatterNote = (data) => {
  return API().put(`business/notes/${data.id}/`, data);
};
interface MatterPostsNoteParams {
  matter?: number;
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
  created_by?: number;
}
/**
 * Get matter notes.
 * @param data request body.
 */
export const getMatterNotes = async ({
  matter,
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  ordering,
  created_by,
}: MatterPostsNoteParams) => {
  const params = {
    matter,
    offset: page * pageSize,
    limit: pageSize,
    search,
    ordering: ordering || "-modified",
    created_by,
  };
  try {
    const res = await API().get(`business/notes/`, { params });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
    };
  }
};
/**
 * Delete matter note.
 * @param id matter note id.
 */
export const deleteMatterNote = (id: string | number) => {
  return API().delete(`business/notes/${id}/`);
};
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/**
 * Send referral
 * @param id matter id
 * @param data referral data
 */
export const sendMatterReferral = (id, data) => {
  return API().post(`business/matters/${id}/send_referral/`, data);
};

/**
 * Accept matter referral
 * @param id matter id
 */
export const acceptMatterReferral = (id) => {
  return API().post(`business/matters/${id}/accept_referral/`);
};

/**
 * Ignore matter referral
 * @param id matter id
 */
 export const ignoreMatterReferral = (id) => {
  return API().post(`business/matters/${id}/ignore_referral/`);
};

/**
 * Close matter
 * @param id matter id
 */
export const closeMatter = (id) => {
  return API().post(`business/matters/${id}/close/`);
};

/**
 * Open matter
 * @param id matter id
 */
export const openMatter = (id) => {
  return API().post(`business/matters/${id}/open/`);
};

/**
 * share matter
 * @param id matter id
 */
export const shareMatter = (id, data) => {
  return API().post(`business/matters/${id}/share/`, data);
};

/**
 * delete matter
 * @param id matter id
 */
export const deleteMatter = (id) => {
  return API().delete(`business/matters/${id}/`);
};

/**
 * Update matter by id
 * @param id matter id
 * @param data
 */
export const updateMatter = (id, data) => {
  return API().patch(`business/matters/${id}/`, data);
};

/**
 * Update matter by id
 * @param id matter id
 * @param data
 */
export const updateMatterPartial = (id, data) => {
  return API().patch(`business/matters/${id}/`, data);
}

/**
 * Leave matter by id
 * @param id matter id
 */
export const leaveMatter = (id) => {
  return API().put(`business/matters/${id}/leave_matter/`);
};

/**
 * Update matter stage by id
 * @param id matter id
 */
export const updateMatterStage = (id, data) => {
  return API().put(`business/matters/${id}/`, data);
};
