import { API } from "helpers";

/**
 * Get enterprise user by id
 * @param param0 id.
 */
export const getEnterpriseAccountById = async (id) => {
  const res = await API().get(`users/enterprises/${id}/`);
  return res.data;
}; 

export const enterpriseInviteTeamMembers = async (id, data) => {
  const res = await API().post(`users/enterprises/${id}/invite_members/`, data);
  return res.data;
}

export const enterpriseDeleteTeamMember = async (id, data) => {
  console.log(data)
  const res = await API().delete(`users/enterprises/${id}/delete_members/`,{data: data});
  return res.data;
}

interface iGetEnterprises {
  search?: string;
  //page?: number;
  //pageSize?: number;
  //sharable?: boolean;
}
export const getAllEnterprises = async (
  { search }: iGetEnterprises
) => {
  const params = {
    search,
  };
  const res = await API().get(`users/enterprises/`, {params});
  return res.data;
};

/**
 * Add/remove enterprise from favorites
 *
 */
 export const toggleFavoriteEnterprise = (id: number, value: boolean) => {
  return value === true
    ? API().put(`/users/enterprises/current/favorite/${id}/`)
    : API().delete(`/users/enterprises/current/favorite/${id}/`);
};