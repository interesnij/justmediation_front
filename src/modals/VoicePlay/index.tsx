import React, { useEffect } from "react";
import { Modal, Button } from "components";
import ReactAudioPlayer from "react-audio-player";
import { SendToDocumentsModal } from 'modals';
import { useModal } from "hooks";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  title: string;
  url: string;
}
export const VoicePlayModal = ({ open, setOpen, title, url }: Props) => {
  const sendDocument = useModal();
  useEffect(() => {
    if (open) {
    }
    return () => {};
  }, [open]);

  return (
    <>
      <Modal
        title={`Voice Consent`}
        open={open}
        setOpen={setOpen}
      >
        <div className="new-post-modal">
          <div className="d-flex">
            <ReactAudioPlayer src={url} className="w-100" autoPlay={false} controls />
          </div>
          <div className="mt-4 d-flex">
            <Button 
              className="ml-auto" 
              type="outline" 
              size="normal"
              onClick={() => sendDocument.setOpen(true)}
            >
              Send to documents
            </Button>
          </div>
        </div>
        {
          sendDocument?.open &&
          <SendToDocumentsModal 
            {...sendDocument} 
            file={{name: title, url}} 
            onCreate={() => sendDocument.setOpen(false)}
          />
        }
      </Modal>

    </>
  );
};
