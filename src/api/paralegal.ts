import { API } from "helpers";

/**
 * Get attorney by id
 * @param param0 id.
 */
export const getParalegalById = async (id) => {
  const res = await API().get(`users/paralegals/${id}/`);
  return res.data;
};
