import React from "react";
import { format } from "date-fns";
import NoteIcon from "assets/icons/note.svg";
import PinIcon from "assets/icons/pin.svg";
import "./style.scss";

interface Props {
  data?: any;
  onClick?(): void;
}

export const Note = ({ data, onClick }: Props) => {
  return (
    <div className="note-control" onClick={onClick}>
      <img src={NoteIcon} alt="note" />
      <div className="ml-2 flex-1">
        <div className="text-black text-ellipsis" style={{ maxWidth: 320 }}>
          {data?.title}
        </div>
        <div className="text-gray date">
          {data?.created && data?.created === data?.modified
            ? `Created ${format(
                new Date(data.created),
                "MM/dd/yyyy hh:mm:ss a"
              )}`
            :
            `Last Edited ${format(
              new Date(data.modified),
              "MM/dd/yyyy hh:mm:ss a"
            )}`
          }
        </div>
        <div className="preview d-flex">
          <span className="text">
            {data?.text}
          </span>
          {data?.attachments && data?.attachments.length > 0 &&
            <img src={PinIcon} className="ml-auto mt-auto" alt="pin" />
          }
        </div>
      </div>
    </div>
  );
};
