import React from "react";
import RecordingIcon from "assets/icons/recording.svg";
import format from "format-duration";
import { VoicePlayModal } from "modals";
import { useModal } from "hooks";
interface Props {
  title: string;
  file: string;
  fileType?: string;
  size?: number;
  sendType?: "receive" | "send";
}
export const ChatVoiceMessage = ({ title, size = 0, sendType, file }: Props) => {
  const playModal = useModal();
  const handleClick = () => {
    playModal.setOpen(true);
  };

  return (
    <>
      <div
        className={`chat-message__content chat-message__content--attachment ${
          sendType === "send" ? "ml-auto" : ""
        }`}
        onClick={handleClick}
      >
        <div className="icon my-auto">
          <img src={RecordingIcon} alt="recording" />
        </div>
        <div className="ml-2">
          <div className="name">Voice Consent</div>
          <div className="size">{format(+size * 1000, { leading: true })}</div>
        </div>
      </div>
      {
        playModal?.open &&
        <VoicePlayModal {...playModal} title={title} url={file} />
      }
    </>
  );
};
