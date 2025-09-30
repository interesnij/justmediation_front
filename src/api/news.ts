import { API } from "helpers";

/** Get news by page. */
export const getNewsByPage = async (page = 0, pageSize = 10) => {
  try {
    const response = await API().get(
      `news/?offset=${page * pageSize}&limit=${pageSize}`
    );
    return response.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/** Get news by id. */
export const getNewsById = async (pageId: number) => {
  try {
    const response = await API().get(`news/${pageId}`);
    return response.data;
  } catch (error) {
    return {};
  }
};
