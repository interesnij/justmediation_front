import React from "react";
import filesize from "filesize";
import { SendToDocumentsModal, ViewDocumentModal } from "modals";
import { useModal } from "hooks";
import OpenIcon from "assets/icons/open_green.svg";
import EyeIcon from "assets/icons/eye_green.svg";
import PlayIcon from "assets/icons/play_green.svg";
import DownIcon from "assets/icons/download_green.svg";
import DocIcon from "assets/icons/document.svg";
import RecordingIcon from "assets/icons/recording.svg";

interface Props {
  title: string;
  url?: string;
  type?: string;
  fileType?: string;
  size?: number;
  sendType?: "receive" | "send";
  userId: number;
  file?: string;
}
export const ChatAttachment = ({
  title,
  fileType,
  type = "doc",
  size = 0,
  sendType,
  url,
  userId,
  file
}: Props) => {
  const sendDocument = useModal();
  const viewDocument = useModal();
  const handleDownload = () => {
    window.open(file);
  };
  const handlePlay = () => {};
  const filename = file?.split("/").pop();
  const mime = file?.split(".").pop();
  const fileObject = {
    name: title, 
    url: url || file || ''
  };

  return (
    <>
      <div
        className={`chat-message__content chat-message__content--attachment ${
          sendType === "send" ? "ml-auto" : ""
        }`}
      >
        <div className="icon my-auto">
          {type === "doc" ? (
            <img src={DocIcon} alt="file" />
          ) : (
            <img src={RecordingIcon} alt="recording" />
          )} 
        </div>
        <div className="ml-2">
          <div className="name">{filename}</div>
          <div className="size">{size}</div>
        </div>  
        <div className="actions">
          <span data-tip="Download">
            <img src={DownIcon} alt="download" onClick={handleDownload} />
          </span>
          <span data-tip="Send to document">
            <img src={OpenIcon} alt="open" onClick={() => sendDocument.setOpen(true)} />
          </span>
          {type === "doc" ? (
            <span data-tip="View document">
              <img src={EyeIcon} alt="eye" onClick={() => viewDocument.setOpen(true)} />
            </span>
          ) : (
            <span data-tip="Play voice message">
              <img src={PlayIcon} alt="play" onClick={handlePlay} />
            </span>
          )}
        </div>
      </div>
      {
        viewDocument.open &&
        <ViewDocumentModal {...viewDocument} file={fileObject} />
      }
      {
        sendDocument?.open &&
        <SendToDocumentsModal 
          {...sendDocument} 
          file={fileObject} 
          onCreate={() => sendDocument.setOpen(false)}
        />
      }
    </>
  );
};
