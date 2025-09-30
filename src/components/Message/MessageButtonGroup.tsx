import React, {FC} from "react";
import {Button} from "../Button";


interface IProps {
  id: number;
  postParticipants: number[];
  hasTwoParticipants: boolean;
  handleOpenReply: (arg: number[], boolean) => void;
}

export const MessageButtonGroup: FC<IProps> = ({
                                         handleOpenReply,
                                         hasTwoParticipants,
                                         id,
                                         postParticipants
                                       }) => {
  return (
    <>
      <div className="d-flex">
        <Button onClick={() => handleOpenReply && handleOpenReply([id], true)}
                type="outline">Reply</Button>

        {hasTwoParticipants ? null :
          <Button onClick={() => handleOpenReply && handleOpenReply(postParticipants, true)}
                  type="outline"
                  className=" ml-3">Reply All</Button>
        }
      </div>
    </>
  )
}