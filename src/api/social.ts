import { API } from "helpers";

/** 
 * Get chats 
 * 
 */
 interface ChatQueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  filter?: "opportunities"|"leads"|"clients"|"network";
  isGroup?: boolean;
}
export const getChats = async (queryParams?: ChatQueryParams) => {
  const params = {
    ordering: queryParams?.ordering || "-created"
  }
  try {
    const res = await API().get("social/chats/", { params });
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
 * Get chat by id 
 * 
 */
export const getChatById = async (id) => {
  try {
    const res = await API().get(`social/chats/${id}/`);
    return res.data;
  } catch (error) {
    return {};
  }
};

/** 
 * Update chat 
 * 
 */
export const updateChat = (id, data) => {
  return API().patch(`social/chats/${id}/`, data);
};

/** 
 * Create chat 
 * 
 */
export const createChat = async (data) => {
  const response = await API().post(`social/chats/`, data);
  return response.data;
};

/** 
 * Delete/Leave chat 
 * 
 */
export const deleteChat = (id: number) => {
  return API().delete(`social/chats/${id}/`);
};

/** 
 * Get chat messages 
 * 
 */
 export const getMessages = async (id: number, params={}) => {
  try {
    const res = await API().get(`social/chats/${id}/messages/`, { params });
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
 * Send message 
 * 
 */
 export const sendMessage = (id: number, data) => {
  return API().post(`social/chats/${id}/messages/`, data);
};