import {API} from "../helpers";


////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/**
 * Create matter topic.
 * @param data request body.
 */
export const createMatterTopic = (data) => {
  return API().post(`business/matter-post/`, data);
};
/**
 * Delete matter topic.
 * @param id matter topic id.
 */
export const deleteMatterTopic = (id) => {
  return API().delete(`business/matter-post/${id}/`);
};


interface MatterTopicsSearchParams {
  matter?: number;
  id__in?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  seen?: boolean;
  seenByClient?: boolean;
  ordering?: string;
}
/**
 * Get matter topics.
 * @param data request body.
 */
export const getMatterTopics = async ({
                                        matter,
                                        page = 0,
                                        pageSize = 10,
                                        search = "",
                                        seen,
                                        seenByClient,
                                        ordering
                                      }: MatterTopicsSearchParams) => {
  const params = {
    ordering: ordering || "-modified",
    offset: page * pageSize,
    limit: pageSize,
    search,
    matter,
    seen,
    seen_by_client: seenByClient,
  };
  try {
    const res = await API().get(`business/matter-post/`, { params });
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
 *
 * @param id
 */
export const getMatterTopicById = async (id: string) => {
  try {
    const res = await API().get(`business/matter-post/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
}


/**
 * Create matter comment.
 * request body.
 * @param post number
 * @param text string
 * @param participants number[] - user_id
 * @param attachments
 */
export const createMatterPost = ({ post, text, participants, attachments }: IPayloadMatterCreateComment) => {
  return API().post(`business/matter-comment/`, { post, text, participants, attachments });
};

/**
 * Mark post read.
 * @param id post id.
 */
export const markReadMatterPost = async (id) => {
  return API().post(`business/matter-post/${id}/mark_read/`);
};

/**
 * Mark post unread.
 * @param id post id.
 */
export const markUnreadMatterPost = async (id) => {
  return API().post(`business/matter-post/${id}/mark_unread/`);
};


interface MatterPostsSearchParams {
  topic?: number;
  seen_by_client?: boolean;
  seen?: boolean;
}
/**
 * Get matter topics.
 * @param data request body.
 */
export const getMatterPosts = async ({ topic, seen_by_client, seen }: MatterPostsSearchParams) => {
  const params = {
    post: topic,
    seen_by_client,
    seen
  };
  try {
    const res = await API().get(`business/matter-comment/`, { params });
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
 *
 * @param id
 */
export const deleteMatterMessageComment = (id) => {
  return API().delete(`business/matter-comment/${id}/`);
}

export interface IPayloadMatterCreateComment {
  post: number;
  text: string;
  participants?: number[];
  attachments?: string[];
}

/**
 *
 * @param id
 */
export const markCommentRead = (id) => {
  return API().post(`business/matter-comment/${id}/mark_read/`);
}

/**
 *
 * @param id
 */
export const markCommentUnread = (id) => {
  return API().post(`business/matter-comment/${id}/mark_unread/`);
}
