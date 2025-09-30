
export const filterChatList = (
  list: any[], 
  chatType: string|false, 
  sortType
) => {
  const unreads: any[] = [];
  const reads: any[] = [];
  for(const item of list) {
    if (chatType && item?.chat_type !== chatType)
      continue;
    item?.unread
      ? unreads.push(item)
      : reads.push(item);
  }
  return [
    ...sortChatList(unreads, sortType),
    ...sortChatList(reads, sortType)
  ]
}

const sortChatList = (list, sortType) => 
  list.sort((a,b) => {
    switch (sortType) {
      case '-is_favorite':
        return +b.is_favorite - +a.is_favorite
      case 'created':
        return a.lastMessageTime - b.lastMessageTime;
      case '-created':
      default:
        return b.lastMessageTime - a.lastMessageTime;
    }
  })

export const updateUnreads = (
  threadData, 
  tabData, 
  chatId, 
  onlyDirect = false,
  resetUnreads = (chatChannel: string) => {}
) => {
  const counts = {
    opportunities: 0,
    leads: 0,
    clients: 0,
    network: 0
  }
  for(const l of threadData) {
    const currentChat = chatId && +chatId === +l.id;
    if (currentChat && l.unread) 
      resetUnreads(l?.chat_channel);
    if (
      currentChat || 
      l.is_archived ||
      (onlyDirect && l.is_group === true)
    ) {
      continue;
    }
    counts[l.chat_type] += l.unread;
  }
  tabData[0].badge = counts.opportunities;
  tabData[1].badge = counts.leads;
  tabData[2].badge = counts.clients;
  tabData[3].badge = counts.network;
  return tabData;
}