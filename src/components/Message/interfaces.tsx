export interface IPropsMessage {
  className?: string;
  data?: any;
  handleOpenReply?: (participants: number[], showMessage: boolean) => void;
  handleReply?: any;
  message?: any;
  refetchMessages?: any;
  postParticipants: number[];
  postParticipantsData: IParticipantData[] | undefined;
  expandMessageDisabled?: boolean;
  postData?: any;
  isLastItem?: boolean;
}

export interface IParticipantData {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  middle_name: string;
}