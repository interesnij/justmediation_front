import { API } from "helpers";
import { NotificationStatusDto } from "types";

const NOTIFICATIONS_ORDERING = "-modified";

export const getNotificationsSettings = () => {
  return API().get("settings/");
};

export const getNotificationsTypes = () => {
  let params = {
    ordering: "-group",
  };
  return API().get("types/", {
    params,
  });
};

export const getUnreadNotificationsCount = () => {
  const unreadStatuses: NotificationStatusDto[] = ["prepared", "sent"];
  const params = {
    limit: 1,
    status__in: unreadStatuses.join(","),
  };
  return API().get("notifications/", { params });
};

/** Obtain last notification dispatch from back-end API. */
export const getLastNotification = () => {
  const params = {
    limit: 1,
    ordeirng: NOTIFICATIONS_ORDERING,
  };
  return API().get("notifications/", { params });
};

/**
 * Get all notifications.
 * @param limit Limit of notifications.
 */
export const getNotifications = async (limit: number = 100) => {
  const params = {
    limit,
    ordeirng: NOTIFICATIONS_ORDERING,
  };
  const res = await API().get("notifications/", { params });
  return res.data;
};

/**
 * Mark notification as read
 * @param id of notification.
 */
export const markNotificationRead = async (id) => {
  const res = await API().post(`notifications/${id}/read/`);
  return res?.data;
};

/**
 * Mark notification as unread
 * @param id of notification.
 */
export const markNotificationUnread = async (id) => {
  const res = await API().post(`notifications/${id}/unread/`);
  return res.data;
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async () => {
  const res = await API().get(`notifications/settings/`);
  return res.data;
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (data) => {
  const res = await API().post(`notifications/settings/`, data);
  return res.data;
};
