import { API, getUserName } from "helpers";

const DEFAULT_USER_PARAMS: Record<string, string> = {
  ordering: "user__first_name",
};

/**
 * Get users by their ids.
 * @param ids Ids of users.
 */
export const getUsersByIds = (ids: number[]) => {
  const limit = ids.length.toString();
  const idsStr = ids.join(",");
  const params = {
    limit,
    id__in: idsStr,
  };
  return API().get("users/", { params });
};

/** Get clients. */
interface GetClientsParams {
  search?: string;
  page?: number;
  pageSize?: number;
  userId?: number | string;
  userType?: string;
}
export const getClients = async (data?: GetClientsParams) => {
  let params : any = {
    search: data?.search,
    offset: (data?.page || 0) * (data?.pageSize || 0),
    limit: data?.pageSize,
  };
  if (data?.userType === 'paralegal'){
    params.paralegal = data?.userId;
  }
  else {
    params.attorney = data?.userId;
  }
  try {
    const response = await API().get("users/clients/", { params });
    return response.data?.results
      ? response.data.results.map((item) => ({
          ...item,
          name: getUserName(item),
        }))
      : [];
  } catch (error) {
    return [];
  }
};


/** Search attorneys. */
interface SearchAttorneysParams {
  search?: string;
  page?: number;
  pageSize?: number;
  userId?: number | string;
  userType?: string;
}
export const SearchAttorneys = async (data?: SearchAttorneysParams) => {
  let params : any = {
    search: data?.search,
    offset: (data?.page || 0) * (data?.pageSize || 0),
    limit: data?.pageSize,
  };
  if (data?.userType === 'paralegal'){
    params.paralegal = data?.userId;
  }
  else {
    params.attorney = data?.userId;
  }
  try {
    const response = await API().get("users/attorneys/", { params });
    return response.data?.results
      ? response.data.results.map((item) => ({
          ...item,
          name: getUserName(item),
        }))
      : [];
  } catch (error) {
    return [];
  }
};


/** Get clients who have leads with current attorney. */
export const getClientsForAttorney = () => {
  //return []
  const params = {
    user_clients: "true",
    ...DEFAULT_USER_PARAMS,
  };
  return API().get("users/clients/", { params });
};

/** Get clients who have leads with current attorney. */
export const getClientsWithMatters = () => {
  const params = {
    has_matter_with_user: "true",
    ...DEFAULT_USER_PARAMS,
  };
  return API().get("users/clients/", { params });
};

/** 
 * Get attorneys.
 */
export const getAttorneys = () => {
  const params = {
    ...DEFAULT_USER_PARAMS,
  };
  return API().get("users/attorneys/", { params });
};

/**
 * Get paralegals.
 */
export const getParalegals = () => {
  const params = {
    ...DEFAULT_USER_PARAMS,
  };
  return API().get("users/paralegals/", { params });
};

/**
 * Fetch client user information from server.
 *
 * @param id Cleint's ID.
 */
export const getClientById = async (id: number | string) => {
  const resposne = await API().get(`users/clients/${id}`);
  return resposne.data;
};

/** Return followed attorneys for current user */
export const followedAttorneys = () => {
  const params = {
    followed: "true",
  };
  return API().get("users/attorneys/", { params });
};

/**
 * Get appointment types
 */
export const getAppointmentTypes = () => {
  return API().get("users/appointment-types");
};

/**
 * Get payment types
 */
export const getPaymentTypes = () => {
  return API().get("users/payment-types");
};

/**
 * Get fee kinds
 */
export const getFeeTypes = () => {
  return API().get("users/fee-types");
};

/**
 * Get currencies
 */
export const getCurrencies = () => {
  return API().get("users/currencies");
};

/**
 * Get Languages
 */
export const getLanguages = () => {
  return API().get("users/languages?limit=200");
};

/**
 * Get Firm sizes
 */
export const getFirmSizes = () => {
  return API().get("users/firm-sizes");
};

/**
 * Check if the user is registered
 */
export const isRegistered = (email: string) => {
  return API({}, { Authorization: "" }).get("users/is-registered/", {
    params: { email },
  });
};

/**
 * Check if the user is registered
 */
export const unsubscribeUser = (key: string) => {
  return API().post("users/unsubscribe/", { key });
};

/**
 * Get Timezones
 */
export const getTimezones = () => {
  return API().get("users/timezones?limit=600");
};

/**
 * Get user invites
 */
export const getUserInvites = async (id) => {
  const response = await API().get(`users/invites/${id}`);
  return response.data;
};

/**
 * Get Attorneys and paralegals.
 *
 * @param search params.
 */
interface GetAttorneyParalegalParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sharable?: boolean;
}
export const getAttorneysAndParalegals = async ({
  search,
  page = 0,
  pageSize,
  sharable = false,
}: GetAttorneyParalegalParams) => {
  const params = {
    search,
    offset: page * (pageSize || 0),
    limit: pageSize,
    sharable,
  };
  try {
    const res = await API().get(
      `/users/clients/search_attorneys_and_paralegals/`,
      {
        params,
      }
    );
    return res.data.results
      ? res.data.results.map((item) => ({
          ...item,
          name: getUserName(item),
        }))
      : [];
  } catch (error) {
    return [];
  }
};

/**
 * Delete client by id.
 */
export const deleteClientById = (id) => {
  return API().delete(`users/clients/${id}/`);
};

/**
 * Resend invites to leads
 */
export const resendInviteLead = async (id) => {
  const response = await API().post(`users/invites/${id}/resend/`);
  return response.data;
};

/**
 * Update user type of client/lead
 */
export const updateUserTypeClientLead = async (attorneyId, client) => {
  console.log("attorney id", attorneyId);
  console.log("client id", client);
  const response = await API().post(
    `users/attorneys/${attorneyId}/change_user_type/`,
    { client }
  );
  return response.data;
};

/**
 * Share client/lead
 */
export const shareContact = async (attorneyId, data) => {
  const response = await API().put(
    `users/attorneys/${attorneyId}/share_contact/`,
    data
  );
  return response.data;
};

/**
 * Update contact
 */
export const updateContact = async (attorneyId, data) => {
  const response = await API().put(
    `users/attorneys/${attorneyId}/update_contact/`,
    data
  );
  return response.data;
};

/**
 * Check 2FA
 */
export const check2FA = async (email) => {
  const response = await API({}, { Authorization: "" }).get(`users/is_twofa/`, {
    params: { email },
  });
  return response.data;
};

/**
 * Update 2FA
 */
export const update2FA = async (userId, twofa) => {
  const response = await API().post(`users/${userId}/twofa/`, { twofa });
  return response.data;
};

/**
 * Send 2FA
 */
export const send2FA = async (phone) => {
  const response = await API({}, { Authorization: "" }).post(
    `users/send_code/`,
    { phone: phone.startsWith('+') ? phone: '+' + phone }
  );
  return response.data;
};


/**
 * Get profile overview
 * @param type (attorney, paralegal, enterprise, other)
 * @param id
 */
 export const getProfileOverview = async (type: string, id, role) => {
  try {
    const userType = type === 'attorney' || role==='Attorney' ? 'attorney' : 'paralegal';
    const res = await API().get(`users/${userType}s/${id}/overview/`);
    return res.data;
  } catch (error) {
    return {};
  }
};

/**
 * Get current profile
 * @param type (attorney, paralegal, enterprise, other)
 */
 export const getCurrentProfile = async (type: string) => {
  try {
    const userType = type === 'other' ? 'paralegal' : type;
    const response = await API().get(`users/${userType}s/current/`);
    return response.data;
  } catch (error) {
    return {};
  }
};
/**
 * Get enterprise profile
 */
 export const getEnterpriseProfile = async () => {
  try {
    const response = await API().get(`users/enterprises/current/`);
    return response.data;
  } catch (error) {
    return {};
  }
};

/**
 * Update current profile
 * @param type (attorney, paralegal, enterprise, other)
 */
 export const updateProfile = async (type, data) => {
  try {
    const userType = type === 'other' ? 'paralegal' : type;
    const response = await API().patch(`users/${userType}s/current/`, data);
    return response.data;
  } catch (error) {
    return {};
  }
};

/**
 * Add contact
 * @param type (attorney, paralegal, enterprise, other)
 * @param id
 */
 export const addContact = (
  type: string,
  role: string,
  id: number | string,
  client: number | string
) => { 
  console.log("type", type);
  console.log("role", role);
  console.log("id", id);
  console.log("client", client);
  if (type === 'client') {
    return API().post(`users/clients/${id}/add_contact/`, {
      client,
    });
  }
  else {
    const userType = (type === 'attorney' || role === 'Attorney') ? 'attorney' : 'paralegal';
    return API().post(`users/${userType}s/${id}/add_contact/`, {
      client,
    });
  }
};