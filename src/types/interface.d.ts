export interface NavMenuItem {
  title?: string;
  items: { label: string; route: string; icon: string; activeIcon: string }[];
}

export interface IMatter {
  matter: {
    name: string;
    state?: string;
  };
  client: {
    name: string;
    avatar?: string;
  };
  status: "open" | "closed" | "referred";
  rate: string;
  practiceArea: string;
  startDate: string;
  createdBy: {
    name: string;
    avatar?: string;
  };
}
export interface INotification {
  text: string;
  date: string;
  avatar: string;
}
export interface IChatThread {
  avatar?: string;
  name: string;
  favorited?: boolean;
  text: string;
  date: string | Date;
}
/**
 * IChatMessage
 * @sendType          send or receive
 * @messageYype       text or video call
 * @name              user name
 * @avatar            user avatar
 * @startTime         sending time of message
 * @text              text message
 * @attachments       audio recording and document file attachments
 * @participants      participants of video call
 * @endTime           end time of video call
 */
export interface IChatMessage {
  sendType: "send" | "receive";
  messageType: "text" | "call";
  name: string;
  avatar?: string;
  startTime: string;
  text?: string;
  attachments: {
    name: string;
    source: string;
    type: "doc" | "audio";
    fileType: string;
    size: string;
  }[];
  participants?: string[];
  endTime?: string;
}
/**
 * IPost
 * @postTitle      post title
 * @authorName     author name
 * @authorAvatar   author avatar
 * @createdAt      post created date
 * @postContent    post content
 * @replyCount     count of replies
 * @userCount      count of users
 * @lastRepliedAt  last replied date
 * @path post path
 */
export interface IPost {
  postTitle: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  postContent: string;
  replyCount: number;
  userCount: number;
  lastRepliedAt: string;
  path: string;
}
/**
 * ITopic
 * @topicTitle        topic title
 * @topicAvatar       topic avatar
 * @topicContent      topic content
 * @postCount         count of posts
 * @followerCount     count of followers
 * @isFollowing       whether following the topic
 * @path              topic path
 */
export interface ITopic {
  topicTitle: string;
  topicAvatar?: string;
  topicDescription: string;
  postCount: number;
  followerCount: number;
  isFollowing?: boolean;
  path: string;
}
/**
 * IReply
 * @avatar          user avatar
 * @userName        user name of the reply
 * @date            replied date
 * @message         message of reply
 * @children        children
 * @onReply         reply event handler
 */
export interface IReply {
  avatar?: string;
  userName: string;
  date: string;
  message: string;
  children?: React.ReactNode;
  onReply?(): void;
}
/**
 * INews
 * @source   source name of news
 * @title    title of news
 * @content  content of news
 * @date     date
 * @image    image
 */
export interface INews {
  source?: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}
export interface IContact {
  name: string;
  state?: string;
  avatar?: string;
  firm?: string;
  type?: string;
  phone?: string;
  email: string;
}
