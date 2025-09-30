import { API } from "helpers";
import { CATEGORIES_PER_PAGE } from "config";

// interface ForumCategoriesQuery {
//   /** Ordering. */
//   readonly ordering?: string;
//   /** Search term. */
//   readonly search?: string;
// }
interface SearchParam {
  speciality?: string;
  featured?: string;
  ordering?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get forum categories
 */
export const getForumCategories = () => {
  let params = {
    ordering: "title",
    search: "",
  };
  return API().get("forum/categories", {
    params,
  });
};

/**
 * Get category by id.
 * @param id Id.
 */
export const getForumCategoryById = (id: number) => {
  return API().get(`forum/categories/${id}`);
};

/**
 * Search for category
 * @param query
 * @param page
 */
export const searchForumCategory = (query: string, page: number = 0) => {
  let params: SearchParam = {
    limit: CATEGORIES_PER_PAGE,
    ordering: "created",
    offset: page * CATEGORIES_PER_PAGE,
  };
  if (query) {
    params.search = query;
  }
  return API().get("forum/categories", { params });
};

/**
 * create a new forum topic
 * @param query
 * @param data
 */
export const createForumPost = (params) => {
  return API().post("forum/posts/", params);
};

/**
 * create a new forum comment
 * @param query
 * @param data
 */
export const createForumComment = (params) => {
  return API().post("forum/comments/", params);
};

interface GetForumTopicsParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
}
/**
 * Get forum topics
 */
export const getForumTopics = async ({
  page = 0,
  pageSize = 10,
  sort,
  search,
}: GetForumTopicsParams) => {
  let params = {
    ordering: sort,
    search: search,
    limit: pageSize,
    offset: page * pageSize,
  };
  try {
    const res = await API().get("forum/topics/", {
      params,
    });
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
 * Get all forum topics
 */
export const getAllForumTopics = () => {
  let params = {
    ordering: 'title'
  };
  return API().get("forum/topics/", { params });
};

/**
 * Get recent posts for forum overview page
 */
export const getRecentPosts = async () => {
  let params = {
    ordering: "-modified",
    limit: 3,
  };
  try {
    const res = await API().get("forum/posts/", {
      params,
    });
    return res.data.results;
  } catch (error) {
    return [];
  }
};

/**
 * Get posts by author
 */
 interface GetPostsByAuthorProps {
  authorId: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  comment_count?: string;
}

export const getPostsByAuthor = async ({
  authorId,
  page,
  pageSize,
  ordering,
  comment_count
}: GetPostsByAuthorProps) => {
  try {
    let params = {
      author: authorId,
      page,
      pageSize,
      ordering,
      comment_count
    };
    const res = await API().get("forum/posts/", {
      params,
    });
    return res.data.results;
  } catch (error) {
    return [];
  }
};

/**
 * Follow topic
 */
export const followTopic = (id: number) => {
  let data = {
    id,
  };
  return API().post(`forum/topics/${id}/follow/`, data);
};

/**
 * unfollow topic
 */
export const unfollowTopic = (id: number) => {
  let data = {
    id,
  };
  return API().post(`forum/topics/${id}/unfollow/`, data);
};
/**
 * Get followed topics by author
 */
export const getFollowedTopics = async () => {
  try {
    const res = await API().get("forum/followed_topics/");
    return res.data.results;
  } catch (error) {
    return [];
  }
};
/**
 * Get followed posts by author
 */
interface GetFollowedPostsProps {
  page?: number;
  pageSize?: number;
  search?: string;
  ordering?: string;
  comment_count?: string;
}
export const getFollowedPosts = async ({
  page = 0,
  pageSize = 10,
  search,
  ordering,
  comment_count
}: GetFollowedPostsProps) => {
  const params = {
    search: search,
    limit: pageSize,
    offset: page * pageSize,
    followed: true,
    ordering,
    comment_count
  };
  try {
    const res = await API().get("forum/posts/", { params });
    return res.data;
  } catch (error) {
    return [];
  }
};
/**
 * Get post by id
 */
export const getPostById = async (id: number) => {
  try {
    const res = await API().get(`forum/posts/${id}/`);
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
 * Get topic by id
 */
export const getTopicById = async (id: number) => {
  try {
    const res = await API().get(`forum/topics/${id}/`);
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

interface GetForumPostsProps {
  page?: number;
  pageSize?: number;
  search?: string;
  topic?: number;
  ordering?: string;
  comment_count?: string;
}
/**
 * Get topic by id
 */
export const getPosts = async ({
  page = 0,
  pageSize = 10,
  search = "",
  topic,
  ordering,
  comment_count
}: GetForumPostsProps) => {
  const params = {
    offset: page * pageSize,
    limit: page,
    search,
    topic,
    ordering,
    comment_count
  };
  try {
    const res = await API().get(`forum/posts/`, { params });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

interface GetForumComentsProps {
  post?: number;
  author?: number;
  search?: string;
  ordering?: string;
}
/**
 * Get comments from post
 */
export const getForumComments = async ({
  post,
  author,
  search,
  ordering
}: GetForumComentsProps) => {
  const params = {
    post,
    author,
    search,
    ordering
  };
  try {
    const res = await API().get(`forum/comments/`, { params });
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
 * Follow post
 */
export const followPost = (id) => {
  let data = {
    post: id,
  };
  return API().post(`forum/followed/`, data);
};

/** 
 * 
 * Unfollow post
 */
export const unfollowPost = (id: number) => {
  let data = {
    id,
  };
  return API().post(`forum/posts/${id}/unfollow/`, data);
};

/** 
export const unfollowPost = (id) => {
  return API().post(`forum/followed/${id}/`);
};
export const followTopic = (id: number) => {
  let data = {
    id,
  };
  return API().post(`forum/topics/${id}/follow/`, data);
};
export const unfollowTopic = (id: number) => {
  let data = {
    id,
  };
  return API().post(`forum/topics/${id}/unfollow/`, data);
};
*/