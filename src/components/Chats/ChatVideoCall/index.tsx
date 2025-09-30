import React from "react";
import { FaUser } from "react-icons/fa";
import { format, intervalToDuration, formatDuration } from "date-fns";
import CallEndIcon from "assets/icons/call_end.svg";
import { User } from "components";
import { v4 as uuid } from 'uuid';

interface Props {
  callStartedAt?: any,
  participants?: []
  ended?: any;
  allParticipants?: {
    id: number;
    avatar: string;
  }[]
}
export const ChatVideoCall = (props: Props) => {
  const getElapsedTime = (props) => {
    if (!props.ended || !props.callStartedAt) return "";
    const elapsed = intervalToDuration ({
      start: new Date(props.ended),
      end: new Date(props.callStartedAt)
    })  
    return ` - ${formatDuration(elapsed)}`;
  }

  var __participants;
  console.log("props", props);
  var participants = props.participants;
  if (typeof participants == "string") {
    var _participants: string = participants;
    __participants = _participants.replace("[", "").replace("]", "").split(",");
  }
  else {
    __participants = participants;
  }

  return (
    <div className="chat-message__content">
      <div className="icon mt-1">
        <img src={CallEndIcon} alt="call" />
      </div>
      <div className="ml-2">
        <div className="name">Call Ended</div>
        {props.ended && (
          <div className="size">
            Ended at {format(new Date(props.ended), "hh:mm:ss a")}{getElapsedTime(props)}
          </div>
        )}
        
        {__participants?.length && (
          <div className="d-flex mt-1">
            {__participants.slice(0,2).map(id => {
              const person = props.allParticipants?.find(p => +p.id === +id);
              return person?.avatar
                  ? <User className="mx-05" key={uuid()} avatar={person.avatar} />
                  : (
                    <div key={uuid()} className="user-avatar small">
                      <FaUser />
                    </div>
                  )
            })}
            {__participants.length > 3 && (
              <span> + {__participants.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
