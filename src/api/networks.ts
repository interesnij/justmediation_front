import { API } from "helpers";
import { Network, SearchParams, NetworkInvitation } from "types";

/**
 * Create group chat.
 * @param network Chat info.
 */
export const createNetwork = (network: Network) => {
  return API().post("social/group-chats/", { data: network });
};

/**
 * Get group chats.
 * @param param0 Search params.
 */
export const getNetworks = ({
  itemsPerPage: itemsPerPageOrNull,
  query,
  page,
}: SearchParams) => {};

/**
 * Get network by id.
 * @param id Network id.
 */
export const getNetworkById = (id: number) => {
  return API().get(`social/group-chats/${id}`);
};

/**
 * Leave network.
 * @param network Network to leave.
 */
export const leaveNetwork = (network: Network) => {
  return API().delete(`social/group-chats/${network.id}/leave/`);
};

/**
 * Invite more people to a network.
 * @param network Network to invite people in.
 * @param invitation Invitation info.
 */
export const invitePeople = (
  network: Network,
  invitation: NetworkInvitation
) => {
  return API().post(`social/group-chats/${network.id}/add_participants/`, {
    data: {
      participants: invitation.participants.map((u) => u.id),
      message: invitation.message,
    },
  });
};

/**
 * Update network title.
 * @param network Network to rename.
 * @param title New title.
 */
export const updateNetworkName = (network: Network, title: string) => {
  return API().put(`social/group-chats/${network.id}/`, { data: { title } });
};
