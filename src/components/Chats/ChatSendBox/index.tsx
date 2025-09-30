import React, { useState, useCallback, useMemo } from "react";
import { Button } from "components";
import TextareaAutosize from "react-textarea-autosize";
import { useDropzone } from "react-dropzone";
import filesize from "filesize";
import { uploadFiles } from "api";
import AttachIcon from "assets/icons/attach.svg";
import RecordIcon from "assets/icons/record.svg";
import CloseIcon from "assets/icons/close.svg";
import DocumentIcon from "assets/icons/document.svg";
import { FirestoreTextMessageAttachment } from "types";
import { VoiceMessageModal } from "modals";
import { useModal } from "hooks";

import "./style.scss";
const baseStyle = {
  background: "white",
  border: "1px solid #E0E0E1",
  borderRadius: 4,
  margin: 8,
  padding: 16,
  display: "flex",
};

const activeStyle = {
  borderColor: "rgba(0,0,0,.6)",
};

const acceptStyle = {
  borderColor: "rgba(0,0,0,.6)",
};

const rejectStyle = {
  borderColor: "#CC4B39",
};
interface Props {
  onSend?(params: { text?: string; files?: { file: string }[] });
  onVoiceSend(params);
  isArchive?: boolean;
}

export const ChatSendBox = ({ 
  onSend = () => {}, 
  onVoiceSend, 
  isArchive = false 
}: Props) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const voiceModal = useModal();
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: true,
    maxSize: 10 * 1024 * 1024,
    onDrop,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  const handleSend = async () => {
    if (text || files.length) {
      setIsLoading(true);
      let attachments: string[] = [];
      if (files.length > 0) { 
        attachments = await uploadFiles(files, "documents", 0);
        // ошибка
      }
      onSend({
        text,
        files: attachments.map(url => {
          return { file: url };
        }),
      });
      setText("");
      setFiles([]);
      setIsLoading(false);
    }
  };

  const removeFile = (file: any) => {
    let newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const handleSendVoiceMsg = () => {
    voiceModal.setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.altKey) {
      setText(e.target.value + '\r\n');
    } else if (e.keyCode === 13) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div {...getRootProps({ className: "dropzone chat-send-box", style })}>
      <TextareaAutosize
        autoFocus
        minRows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ border: "none", outline: "none", fontFamily: "DM Sans" }}
      />
      <div className={`d-flex flex-wrap ${files.length > 0 ? "mt-1" : ""}`}>
        {files.map((file, index) => (
          <div className="upload-control__file" key={`${index}key`}>
            <img
              src={DocumentIcon}
              className="my-auto upload-control__img"
              alt="file"
            />
            <span className="mx-1 my-auto">
              {file?.name} ({filesize(file.size)})
            </span>
            <img
              src={CloseIcon}
              className="my-auto upload-control__close"
              alt="close"
              onClick={() => removeFile(file)}
            />
          </div>
        ))}
      </div>
      <input {...getInputProps()} />
      <div className="d-flex justify-content-between mt-1">
        <div className="d-flex">
          <img src={AttachIcon} alt="attachments" onClick={open} />
          <img
            src={RecordIcon}
            data-tip="Send Voice Message"
            alt="send voice message"
            onClick={handleSendVoiceMsg}
          />
        </div>
        <Button
          theme="green"
          disabled={!text && files.length === 0}
          onClick={() => handleSend()}
          isLoading={isLoading}
        >
          {isArchive ? `Send and unarchive` : `Send`}
        </Button>
      </div>
      {
        voiceModal?.open &&
        <VoiceMessageModal {...voiceModal} onSend={onVoiceSend} />
      }
    </div>
  );
};
