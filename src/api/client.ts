import { API } from "helpers";

/** Get client overview. */
export const getCurrentClientProfile = async () => {
  const res = await API().get(`users/clients/current/`);
  return res.data;
};

/** Get client overview. */
export const getClientOverview = async (id) => {
  const res = await API().get(`users/clients/${id}/overview/`);
  return res?.data;
};

/** Get client matter overview. */
export const getClientMatterOverview = async (id, matter) => {
  const res = await API().get(`users/clients/${id}/matter_overview/${matter}/`);
  return res.data;
};

/** Update client profile. */
export const updateClientProfile = (data) => {
  return API().put(`users/clients/current/`, data);
};

/** Partial update client profile. */
export const partialUpdateClientProfile = (data) => {
  return API().patch(`users/clients/current/`, data);
};

/** Update client 2fa. */
export const updateClient2FA = (id, twofa) => {
  return API().put(`users/clients/${id}/twofa/`, { twofa });
};

/** 
 * Get client's posted matters 
 * 
 **/
 interface iGetPostedMatterParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  isActive?: boolean;
}
export const getClientPostedMatters = async (
  id: number, 
  q: iGetPostedMatterParams
) => {
  const params = {
    //offset: (q?.pageSize || 0) * (q?.page || 0),
    //limit: q?.pageSize,
    client: id,
    ordering: q?.ordering || "-created",
    status: !!q.isActive ? "active" : "inactive"
  };
  try {
    const res = await API().get(`/business/posted-matter/`, { params });
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
 * Get all client contacts
 *
 */
interface iGetClientContacts {
  search?: string;
  page?: number;
  pageSize?: number;
  sharable?: boolean;
}
export const getClientContacts = async (
  userId: string,
  { search, page = 0, pageSize }: iGetClientContacts
) => {
  const params = {
    search,
    offset: page * (pageSize || 0),
    limit: pageSize,
  };
  //try {
    const res = await API().get(`/users/clients/${userId}/get_contacts/`, {
      params,
    });
    const __data = res["data"];
    const __results = __data["results"];
    console.log("results", __results);
    console.log("data", __data);
    const _items = __results.map((item) => ({
      ...item,
      name: item?.first_name + " " + item?.last_name,
      type: item?.user_type,
      }));
    console.log(_items); 
    return _items || [];
  //} catch (error) {
  //  return [];
  //}
};

/**
 * Get attorney/paralegal/enterprise by id
 * @param id
 */
export const getAttorneyDetails = async (id: number) => {
  const response = await API().get(`users/attorneys/${id}`);
  return response.data;
};

/**
 * Search attorney/paralegal/enterprise
 *
 */
export const findAttorneys = async (params: any) => {
  // appointment_type   2
  // user__specialities   2
  // fee_types    5
  // years_of_experience__gte   3
  // spoken_language     2
  // firm_locations__city    2
  // firm_locations__zip_code    10001
  const response = await API().get(`/users/attorneys/`, { params });
  return response.data;
};

/**
 * Get Favorite Attorneys
 *
 */
export const getFavoriteAttorneys = async () => {
  const response = await API().get(`/users/clients/current/favorite/`);
  return response.data;
};

/**
 * Add/remove attorney from favorites
 *
 */
export const toggleFavoriteAttorney = (id: number, value: boolean) => {
  return value === true
    ? API().put(`/users/clients/current/favorite/${id}/`)
    : API().delete(`/users/clients/current/favorite/${id}/`);
};
