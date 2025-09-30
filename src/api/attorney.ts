import { API } from "helpers";
import { AttorneySearchInfo, PlaceResult } from "types";
import { MATTERS_PER_PAGE } from "config";
const ITEMS_PER_PAGE = 10;

interface ExtendedAttorneySearchInfo extends AttorneySearchInfo {
  /** Attorney's company state. */
  state?: string;
}
interface RequestParam {
  user?: string;
  user__in?: string;
  user__email?: string;
  user__email__in?: string;
  followed?: string;
  featured?: string;
  sponsored?: string;
  user__specialities?: string;
  fee_kinds?: string;
  education__university?: string;
  practice_jurisdictions?: string;
  longitude?: string;
  latitude?: string;
  firm_location_state?: string;
  firm_location_state__in?: string;
  firm_location_city?: string;
  firm_location_city__in?: string;
  has_lead_with_user?: string;
  distance__gte?: number;
  distance__lte?: number;
  ordering?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface SearchParams {
  /** Search query. */
  query?: string;
  /** Page number. */
  page?: number;
  /** Specialty id. */
  specialty?: number;
}
/**
 * Search attorneys
 * @param param0 Search params.
 */
export const searchForAttorney = ({ page, query, specialty }: SearchParams) => {
  return API().get("users/attorneys/", {
    params: {
      offset: (page || 0) * ITEMS_PER_PAGE,
      user__specialities: specialty,
      limit: ITEMS_PER_PAGE,
    },
  });
};
const getAttorneys = (params: RequestParam) => {
  return API().get("users/attorneys/", {
    params,
  });
};

/**
 * Return list of nearest attorneys.
 *
 * @param searchInfo Attorney search info.
 * @param state Firm location state.
 */
export const getNearestAttorneys = ({
  latitude,
  longitude,
  name,
  specialityId,
  state,
}: ExtendedAttorneySearchInfo) => {
  let params: RequestParam = {};
  if (latitude != null && longitude != null) {
    params = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      ordering: "-featured, distance",
    };
  } else {
    params = {
      ordering: "-featured, distance",
    };
  }
  if (specialityId != null) {
    params.user__specialities = specialityId.toString();
  }
  if (name != null) {
    params.search = name;
  }

  if (state != null) {
    params.firm_location_state = state;
  }
  return getAttorneys(params);
};

/**
 * Get sponsored attorneys.
 *
 * @param place Used to sort sponsored attorneys by distance to location.
 */
export const getSponsoredAttorneys = (place: PlaceResult) => {
  let params: RequestParam = { sponsored: "true" };

  if (place) {
    params.ordering = "distance";
    params.latitude = place.geometry?.location.lat().toString();
    params.longitude = place.geometry?.location.lng().toString();
  }

  return getAttorneys(params);
};

/**
 * Follow attorney.
 *
 * @param id Attorney's ID.
 */
export const followAttorney = (id: number | string) => {
  return API().post(`users/attorneys/${id}/follow/`);
};

/**
 * Unfollow attorney.
 *
 * @param id Attorney's ID.
 */
export const unfollowAttorney = (id: number | string) => {
  return API().post(`users/attorneys/${id}/unfollow/`);
};

/**
 * Get all contacts of the attorney
 *
 */
interface iGetContacts {
  search?: string;
  page?: number;
  pageSize?: number;
  sharable?: boolean;
}
export const getContacts = async (
  userId: string,
  userType: string,
  { search, page = 0, pageSize }: iGetContacts
) => {
  const params = {
    search,
    offset: page * (pageSize || 0),
    limit: pageSize,
  };
  try {
    const res = await API().get(
      `/users/${userType}s/${userId}/get_all_contacts/`,
      { params }
    );
    return res.data.results
      ? res.data.results.map((item) => ({
          ...item,
          name: item?.first_name + " " + item?.last_name,
          type: item?.user_type,
        }))
      : [];
  } catch (error) {
    return [];
  }
};

/**
 * Get client and leads for attorney to create an invoice.
 *
 * @param id Attorney's ID.
 */

export const getClientsForInvoice = async (
  id: string,
) => {
  try {
    const res = await API().get(`users/clients?attorney=${id}`);
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
    };
  }
};

/**
 * Get client and leads for attorney.
 *
 * @param id Attorney's ID.
 */

interface GetLeadClientsParams {
  search?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  type?: string;
}

export const getLeadClients = async (
  id: number | string,
  type: string,
  role: string,
  data?: GetLeadClientsParams,
) => {
  const params = {
    search: data?.search,
    offset: (data?.page || 0) * (data?.pageSize || 0),
    limit: data?.pageSize,
    type: data?.type
  };
  const userType = (type === 'attorney' || role === 'Attorney') ? 'attorney' : 'paralegal';
  if (data?.ordering) {
    params["ordering"] = data?.ordering;
  }
  try {
    const res = await API().get(`users/${userType}s/${id}/leads_and_clients/`, {
      params,
    });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
    };
  }
};

/**
 * Delete leads or clients
 * @param id
 */

export const deleteLeadClientsByAttorney = (id, dataId) => {
  return API().delete(`users/attorneys/${id}/remove_leads_and_clients/`, {
    data: { user_id: dataId },
  });
};

/**
 * Add contact.
 *
 * @param id Attorney's ID.
 */
export const addContactToAttorney = (
  id: number | string,
  client: number | string
) => {
  return API().post(`users/attorneys/${id}/add_contact/`, {
    client,
  });
};

/**
 * Invite client/lead to attorney.
 *
 * @param data
 */
export const inviteUserToAttorney = (data) => {
  return API().post(`users/invites/`, data);
};

/**
 * get current attorney profile.
 *
 */
export const getCurrentAttorneyProfile = async () => {
  try {
    const response = await API().get(`users/attorneys/current/`);
    return response.data;
  } catch (error) {
    return {};
  }
};

/**
 * update current attorney profile.
 *
 */
export const updateCurrentProfile = async (data) => {
  try {
    let userType: string = data.userType;
    
    if (userType == "enterprise") {
      userType = "attorney";
    }
    console.log("userType", userType);
    const response = await API().patch(`users/${userType}s/current/`, data);
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
 * Add industry contact.
 *
 * @param id Attorney's ID.
 */
export const addIndustryContactToAttorney = (
  id: number | string,
  user_id: number | string
) => {
  return API().post(`users/attorneys/${id}/add_industrial_contact/`, {
    user_id,
  });
};

interface GetIndustryContactParams {
  id: number | string;
  search?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  filter?: "attorney"|"paralegal"|"pending";
}
/**
 * Get industry contacts
 * @param data request params
 */
export const getIndustryContactsForAttorney = async ({
  id,
  search = "",
  page = 0,
  pageSize = 20,
  ordering = "-created",
  filter
}: GetIndustryContactParams) => {
  const params = {
    search,
    offset: page * pageSize,
    limit: pageSize,
    type: filter || "",
//    ordering,  // need BE adjustment (#754)
  };
  const response = await API().get(`users/attorneys/${id}/industry_contacts/`, { params });
  return response.data;
};

/**
 * get industry contact detail.
 *
 * @param id Attorney's ID.
 * @param user_id attorney/paralegal ID.
 */
export const getIndustryContactDetailForAttorney = async (
  id: number | string,
  user_id: number | string
) => {
  try {
    let response = await API().get(
      `users/attorneys/${id}/industry_contact_detail/`,
      {
        params: { user_id },
      }
    );
    return response.data;
  } catch (error) {
    return {};
  }
};

/**
 * Add contact.
 *
 * @param id Attorney's ID.
 * @param user_id attorney/paralegal ID.
 */
export const deleteIndustryContactForAttorney = async (
  id: number | string,
  user_id: number | string
) => {
  try {
    let response = await API().delete(
      `users/attorneys/${id}/remove_industrial_contact/`,
      {
        data: { user_id },
      }
    );
    return response.data;
  } catch (error) {
    return {};
  }
};

/**
 * Get attorney by id
 * @param param0 id.
 */
export const getAttorneyById = async (id, is_verified = true) => {
  let params = {
    is_verified,
  };
  const res = await API().get(`users/attorneys/${id}/`, { params });
  return res.data;
};

/**
 * Get attorney overview by id
 * @param param0 id.
 */
export const getAttorneyOverview = async (id) => {
  try {
    const res = await API().get(`users/attorneys/${id}/overview/`);
    return res.data;
  } catch (error) {
    return {};
  }
};
