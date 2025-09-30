export let getChatTabs = (userType: string) => [
  {
    tab: "opportunities",
    badge: 0,
    path: `/${userType}/chats/opportunities`,
  },
  {
    tab: "leads",
    badge: 0,
    path: `/${userType}/chats/leads`,
  },
  {
    tab: "clients",
    badge: 0,
    path: `/${userType}/chats/clients`,
  },
  {
    tab: "network",
    badge: 0,
    path: `/${userType}/chats/network`,
  },
];

export const sortChatData = [
  { title: "Newest", id: "-created" },
  { title: "Oldest", id: "created" },
  { title: "Priority first", id: "-is_favorite" },
];