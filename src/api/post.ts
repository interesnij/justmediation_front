import { API } from "helpers";
import { Post } from "types";

const POSTS_PER_PAGE = 10;

/** Get posts for topic. */
export const getForumPostsByTopic = (topicId: number, page: number = 0) => {
  let params = {
    topic: topicId,
    limit: POSTS_PER_PAGE,
    ordering: "created",
    offset: 0,
  };
  let offset = 0;
  if (page) {
    offset = page * POSTS_PER_PAGE;
    params.offset = offset;
  }
  return API().get("forum/posts/", { params });
};

/**
 * Publish new post.
 * @param post - post information.
 */
export const publishForumPost = (post: Post) => {
  return API().post("forum/posts/", { data: post });
};

/**
 * Return post by id.
 * @param postId
 */
export const getForumPostById = (postId: number) => {
  return API().get(`forum/post/${postId}`);
};

/**
 * Delete selected post by id.
 * @param postId
 */
export const deleteForumPostById = (postId: number) => {
  return API().delete(`forum/post/${postId}`);
};

/**
 * Update selected post by id.
 * @param postId
 * @param post
 */
export const updateForumPostById = (postId: number, post: Partial<Post>) => {
  return API().put(`forum/posts/${postId}/`, post);
};
