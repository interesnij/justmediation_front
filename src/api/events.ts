import { API } from "helpers";
/**
 * Get events.
 *
 */
interface GetEventsParams {
  mediator?: string;
  paralegal?: string;
  ordering?: string;
}

export const getEvents = async ({ mediator, paralegal, ordering }: GetEventsParams) => {
  const params = {
    ordering,
    mediator,
    paralegal,
  };
  try {
    const res = await API().get(`promotion/events/`, {
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
 * Create events.
 *
 * @param data event data
 */
export const createEvent = (data) => {
  return API().post(`promotion/events/`, data);
};

/**
 * Delete event.
 *
 * @param id event id
 */
export const deleteEvent = (id: number | string) => {
  return API().delete(`promotion/events/${id}`);
};

/**
 * Update events.
 *
 * @param id event id
 * @param data event data
 */
export const updateEvent = (id: number | string, data) => {
  return API().put(`promotion/events/${id}/`, data);
};
