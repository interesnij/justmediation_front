import { API } from "helpers";
import { Topic, DefaultRequestParams } from "types";

const TOPICS_PER_PAGE = 15;
const ORDERING_FIELD = "created";

/** Get topics by category id. */
export const getTopicsByCategoryId = (
  page: number = 0,
  categoryId?: number
) => {
  let params = {
    limit: TOPICS_PER_PAGE,
    ordering: "-last_post__created",
    category: "",
    offset: "",
  };

  if (categoryId) {
    params.category = categoryId.toString();
  }
  if (page && page !== 0) {
    params.offset = (TOPICS_PER_PAGE * page).toString();
  }
  return API().get("forum/topics/", { params });
};

/**
 * Get topic by id.
 * @param id Id of topic.
 */
export const getTopicById = (id: number) => {
  return API().get(`forum/topics/${id}`);
};

/**
 * Search topics.
 * @param query Search query.
 * @param page Page number.
 */
export const searchTopics = (query: string, page: number = 0) => {
  let params = {
    limit: TOPICS_PER_PAGE,
    ordering: ORDERING_FIELD,
    category: "",
    offset: TOPICS_PER_PAGE * page,
    search: "",
  };

  if (query) {
    params.search = query;
  }
  return API().get("forum/topics/", { params });
};

/**
 * Get followed topics.
 * @param page Number of page.
 * @param topicId
 */
export const getFollowedTopics = (page: number = 0, topicId: number = -1) => {
  let params = {
    limit: TOPICS_PER_PAGE,
    ordering: ORDERING_FIELD,
    category: "",
    offset: TOPICS_PER_PAGE * page,
    search: "",
    topic: "",
  };

  if (topicId) {
    params.topic = topicId.toString();
  }
  return API().get("forum/followed/", { params });
};

/** Create new topic */
export const createTopic = (topic: Topic) => {
  return API().post("forum/topics/", { data: topic });
};

/**
 * Get last modified topics
 * @param limit Maximum number of topics
 * */
export const getLastModifiedTopics = (limit: number) => {
  const params = {
    ordering: "-last_post__created",
    limit,
  };
  return API().get("forum/topics/", { params });
};

/**
 * Get mediator's opportunities
 */
export const getOpportunities = (reqParams: DefaultRequestParams) => {
  return API().get("opportunities/", { params: reqParams });
};
